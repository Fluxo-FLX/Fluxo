"use client";

import { useState } from "react";
import { applyCouponAction } from "@/app/(storefront)/carrinho/actions";
import { useCart } from "@/contexts/cart-context";
import { ProductThumb } from "@/components/product-thumb";
import { formatPrice } from "@/lib/format";
import { round2 } from "@/lib/money";
import type { CartLine } from "@/lib/types";
import { TrustBadges } from "./trust-badges";

export function OrderSummarySidebar({
  lines,
  shipping,
}: {
  lines: CartLine[];
  shipping: number | null;
}) {
  const { subtotal, discount, coupon, applyCoupon, removeCoupon, getCartProduct } = useCart();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const total = round2(Math.max(0, subtotal - discount) + (shipping ?? 0));

  const handleApplyCoupon = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setMessage(null);
    const result = await applyCouponAction(code.trim(), subtotal);
    setLoading(false);
    if (!result.valid) {
      setMessage(result.message);
      return;
    }
    applyCoupon({ code: result.code, type: result.type, value: result.value });
    setCode("");
  };

  return (
    <div className="h-fit border border-mist p-6">
      <p className="label-caps mb-4 text-xs text-graphite">Resumo do pedido</p>
      <ul className="max-h-72 space-y-3 overflow-y-auto divide-y divide-mist">
        {lines.map((line) => {
          const product = getCartProduct(line.productSlug);
          if (!product) return null;
          return (
            <li key={`${line.productSlug}-${line.color}-${line.size}`} className="flex gap-3 pt-3 first:pt-0">
              <div className="h-16 w-14 shrink-0 overflow-hidden">
                <ProductThumb product={product} color={line.color} className="h-full w-full" />
              </div>
              <div className="flex-1 text-xs">
                <p className="text-ink">{product.name}</p>
                <p className="text-graphite">
                  {line.color} · {line.size} · Qtd {line.quantity}
                </p>
              </div>
              <span className="text-xs">{formatPrice(product.price * line.quantity)}</span>
            </li>
          );
        })}
      </ul>

      {coupon ? (
        <div className="mt-4 flex items-center justify-between border-t border-mist pt-4 text-xs">
          <span className="text-petrol">
            Cupom <strong>{coupon.code}</strong> aplicado
          </span>
          <button
            type="button"
            onClick={removeCoupon}
            className="label-caps text-graphite hover:text-petrol hover:underline"
          >
            Remover
          </button>
        </div>
      ) : (
        <div className="mt-4 border-t border-mist pt-4">
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Cupom de desconto"
              className="flex-1 border border-mist px-3 py-2 text-xs outline-none focus:border-petrol"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={loading}
              className="label-caps flex items-center justify-center gap-2 border border-ink px-3 py-2 text-[11px] transition-colors hover:bg-ink hover:text-paper disabled:opacity-60"
            >
              {loading && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="animate-spin">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              )}
              Aplicar
            </button>
          </div>
          {message && <p className="mt-2 text-xs text-red-600">{message}</p>}
        </div>
      )}

      <div className="mt-4 space-y-2 border-t border-mist pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-graphite">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-graphite">Desconto</span>
            <span className="text-petrol">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-graphite">Frete</span>
          <span>{shipping === null ? "A calcular" : shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between border-t border-mist pt-3 text-base font-medium">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <TrustBadges />
    </div>
  );
}
