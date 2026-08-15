"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { getProduct } from "@/lib/demo-data";
import { addressSchema } from "@/lib/validation";
import { computeShippingCost } from "@/lib/shipping";
import { computeCouponDiscount } from "@/lib/coupons";
import { round2 } from "@/lib/money";
import { addOrder, generateOrderId } from "@/server/repositories/order-repository";
import { registerCouponUsage, validateCoupon } from "@/server/repositories/coupon-repository";
import { getSettings } from "@/server/repositories/settings-repository";
import { getClientIp, rateLimit } from "@/server/rate-limit";
import { escapeHtml, sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { SITE_URL } from "@/lib/site-config";
import type { Order } from "@/server/types";

const CHECKOUT_LIMIT = 15;
const CHECKOUT_WINDOW_MS = 10 * 60 * 1000;

const checkoutItemSchema = z.object({
  productSlug: z.string(),
  color: z.string(),
  size: z.string(),
  quantity: z.number().int().min(1),
});

const checkoutInputSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  address: addressSchema,
  shippingMethod: z.enum(["padrao", "expressa"]),
  paymentMethod: z.enum(["pix", "cartao", "boleto"]),
  couponCode: z.string().optional(),
  guestEmail: z.string().email().optional(),
});

export type CreateOrderResult = { success: true; order: Order } | { success: false; error: string };

/**
 * Prices, brand names and shipping cost are all re-resolved server-side
 * from the product slugs rather than trusted from the client payload —
 * the checkout UI sends only slug/color/size/quantity plus the chosen
 * shipping method and coupon code.
 */
export async function createOrderAction(input: unknown): Promise<CreateOrderResult> {
  // Every call — success or failure — counts, so a script can't retry its
  // way past a declined card by hammering this action.
  const ip = await getClientIp();
  const limited = rateLimit(`checkout:${ip}`, CHECKOUT_LIMIT, CHECKOUT_WINDOW_MS);
  if (!limited.allowed) {
    return { success: false, error: "Muitas tentativas de finalizar compra. Aguarde alguns minutos." };
  }

  const parsed = checkoutInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados de checkout inválidos." };
  }
  const { items, address, shippingMethod, paymentMethod, couponCode, guestEmail } = parsed.data;

  // Guests can check out with just an e-mail — no account required. When a
  // session exists it always wins, so a logged-in user can't be spoofed
  // into a guest order via a stale client-side guestEmail value.
  const session = await auth();
  const email = session?.user?.email ?? guestEmail;
  if (!email) {
    return { success: false, error: "Informe um e-mail para continuar." };
  }

  const productsBySlug = new Map(
    (await Promise.all(items.map((line) => getProduct(line.productSlug))))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => [p.slug, p] as const),
  );

  const resolvedItems = items
    .map((line) => {
      const product = productsBySlug.get(line.productSlug);
      if (!product) return null;
      return {
        productSlug: product.slug,
        name: product.name,
        brandName: product.brandName,
        color: line.color,
        size: line.size,
        quantity: line.quantity,
        price: product.price,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (resolvedItems.length === 0) {
    return { success: false, error: "Carrinho vazio ou produtos inválidos." };
  }

  // Stock is re-checked here too — the "Esgotado" state on the product
  // page is a UI courtesy, not the enforcement point.
  const outOfStockItem = resolvedItems.find((item) => {
    const product = productsBySlug.get(item.productSlug);
    return !product || product.stock < item.quantity;
  });
  if (outOfStockItem) {
    return {
      success: false,
      error: `"${outOfStockItem.name}" não tem estoque suficiente disponível.`,
    };
  }

  const subtotal = round2(resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0));

  let discount = 0;
  let freeShippingFromCoupon = false;
  let appliedCouponCode: string | undefined;

  if (couponCode) {
    const result = await validateCoupon(couponCode, subtotal);
    if (result.valid) {
      appliedCouponCode = result.code;
      if (result.type === "frete-gratis") {
        freeShippingFromCoupon = true;
      } else {
        discount = computeCouponDiscount(subtotal, result.type, result.value);
      }
    }
  }

  const { freeShippingThreshold } = await getSettings();
  const shipping = freeShippingFromCoupon ? 0 : computeShippingCost(shippingMethod, subtotal, freeShippingThreshold);
  const total = round2(Math.max(0, subtotal - discount) + shipping);

  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    userEmail: email,
    items: resolvedItems,
    subtotal,
    shipping,
    discount,
    couponCode: appliedCouponCode,
    total,
    paymentMethod,
    address: { ...address, id: `addr-${Date.now()}`, label: "Entrega" },
    status: "Pagamento aprovado",
  };

  await addOrder(order);
  if (appliedCouponCode) await registerCouponUsage(appliedCouponCode);

  const itemsHtml = resolvedItems
    .map(
      (item) =>
        `<li>${item.quantity}x ${escapeHtml(item.name)} (${escapeHtml(item.color)}, ${escapeHtml(item.size)}) · ${formatPrice(item.price * item.quantity)}</li>`,
    )
    .join("");
  await sendEmail({
    to: email,
    subject: `Fluxo FLX: pedido ${order.id} confirmado`,
    html: `<p>Seu pedido foi confirmado!</p><ul>${itemsHtml}</ul><p><strong>Total: ${formatPrice(total)}</strong></p><p>Acompanhe o status em ${SITE_URL}/conta/pedidos</p>`,
  });

  return { success: true, order };
}
