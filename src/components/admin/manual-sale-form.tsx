"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createManualSaleAction } from "@/app/admin/vendas/actions";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import type { OrderStatus, PaymentMethod } from "@/server/types";

type ManualSaleChannel = "presencial" | "whatsapp";

type SaleItem = {
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
};

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "pix", label: "PIX" },
  { value: "cartao", label: "Cartão" },
  { value: "boleto", label: "Boleto" },
];

const STATUSES: OrderStatus[] = [
  "Pedido recebido",
  "Pagamento aprovado",
  "Em preparação",
  "Enviado",
  "Em trânsito",
  "Entregue",
  "Cancelado",
];

function labelClass() {
  return "label-caps text-[11px] text-graphite";
}

function inputClass(hasError?: boolean) {
  return `border px-3 py-2 text-base outline-none focus:border-petrol sm:text-sm ${hasError ? "border-red-500" : "border-mist"}`;
}

function emptyItem(products: Product[]): SaleItem {
  const first = products[0];
  return {
    productSlug: first?.slug ?? "",
    color: first?.colors[0]?.name ?? "",
    size: first?.sizes[0] ?? "",
    quantity: 1,
    price: first?.price ?? 0,
  };
}

export function ManualSaleForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [channel, setChannel] = useState<ManualSaleChannel>("presencial");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [status, setStatus] = useState<OrderStatus>("Entregue");
  const [items, setItems] = useState<SaleItem[]>([emptyItem(products)]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

  const updateItem = (index: number, patch: Partial<SaleItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const handleProductChange = (index: number, slug: string) => {
    const product = productBySlug(slug);
    updateItem(index, {
      productSlug: slug,
      color: product?.colors[0]?.name ?? "",
      size: product?.sizes[0] ?? "",
      price: product?.price ?? 0,
    });
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem(products)]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }
    if (items.some((item) => !item.productSlug || !item.color || !item.size)) {
      setError("Selecione produto, cor e tamanho em todos os itens.");
      return;
    }

    setSubmitting(true);
    const result = await createManualSaleAction({
      channel,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      paymentMethod,
      status,
      items,
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push("/admin/pedidos");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <p className={labelClass() + " mb-2"}>Canal da venda</p>
        <div className="flex gap-2">
          {(["presencial", "whatsapp"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={`label-caps border px-4 py-2.5 text-[11px] transition-colors ${
                channel === c ? "border-ink bg-ink text-paper" : "border-mist text-graphite hover:border-ink"
              }`}
            >
              {c === "presencial" ? "Presencial" : "WhatsApp"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="customerName">
            Nome do cliente
          </label>
          <input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={inputClass()}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="customerPhone">
            Telefone (opcional)
          </label>
          <input
            id="customerPhone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="84999999999"
            className={inputClass()}
          />
        </div>
      </div>

      <div>
        <p className={labelClass() + " mb-2"}>Forma de pagamento</p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.value}
              type="button"
              onClick={() => setPaymentMethod(method.value)}
              className={`label-caps border px-4 py-2.5 text-[11px] transition-colors ${
                paymentMethod === method.value
                  ? "border-ink bg-ink text-paper"
                  : "border-mist text-graphite hover:border-ink"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:max-w-xs">
        <label className={labelClass()} htmlFor="status">
          Status do pedido
        </label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className={inputClass()}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className={labelClass()}>Produtos vendidos</p>
          <button type="button" onClick={addItem} className="label-caps text-[11px] text-petrol hover:underline">
            + adicionar produto
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item, index) => {
            const product = productBySlug(item.productSlug);
            return (
              <div key={index} className="border border-mist p-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr_1fr]">
                  <select
                    value={item.productSlug}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className={inputClass()}
                  >
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} ({formatPrice(p.price)}) · {p.stock} un.
                      </option>
                    ))}
                  </select>
                  <select
                    value={item.color}
                    onChange={(e) => updateItem(index, { color: e.target.value })}
                    className={inputClass()}
                  >
                    {product?.colors.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={item.size}
                    onChange={(e) => updateItem(index, { size: e.target.value })}
                    className={inputClass()}
                  >
                    {product?.sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 flex flex-wrap items-end gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="label-caps text-[10px] text-graphite">Qtd</span>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                      className={`w-20 ${inputClass()}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="label-caps text-[10px] text-graphite">Preço unit. (R$)</span>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.price}
                      onChange={(e) => updateItem(index, { price: Math.max(0, Number(e.target.value) || 0) })}
                      className={`w-28 ${inputClass()}`}
                    />
                  </div>
                  <span className="ml-auto text-sm text-graphite">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                    className="label-caps px-2 text-[11px] text-graphite hover:text-red-600 disabled:opacity-30"
                  >
                    remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-mist pt-4">
        <p className="label-caps text-[11px] text-graphite">Total</p>
        <p className="font-display text-xl">{formatPrice(subtotal)}</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="label-caps bg-ink px-8 py-4 text-xs text-paper transition-colors hover:bg-petrol disabled:opacity-60"
        >
          {submitting ? "Registrando..." : "Registrar venda"}
        </button>
      </div>
    </form>
  );
}
