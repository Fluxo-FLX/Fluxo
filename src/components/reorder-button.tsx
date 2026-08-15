"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import type { OrderItem } from "@/server/types";

export function ReorderButton({ items }: { items: OrderItem[] }) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);

  const handleReorder = () => {
    items.forEach((item) => {
      addLine({
        productSlug: item.productSlug,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      });
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleReorder}
      className="label-caps mt-2 inline-flex items-center gap-1.5 text-[11px] text-petrol hover:underline"
    >
      {added && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12l5 5L20 6" />
        </svg>
      )}
      {added ? "Adicionado ao carrinho" : "Comprar novamente"}
    </button>
  );
}
