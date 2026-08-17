"use client";

import Link from "next/link";
import { useState } from "react";
import { getPrimaryBadge, isSoldOut } from "@/lib/badges";
import type { Product } from "@/lib/types";
import { Badge } from "./badge";
import { PlaceholderPhoto } from "./placeholder-photo";
import { PriceBlock } from "./price-block";
import { WishlistButton } from "./wishlist-button";
import { useCart } from "@/contexts/cart-context";

const TONE_BY_CATEGORY = {
  fitness: "fitness",
  surf: "surf",
  street: "street",
} as const;

export function ProductCard({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [adding, setAdding] = useState(false);
  const badge = getPrimaryBadge(product);
  const soldOut = isSoldOut(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addLine({
      productSlug: product.slug,
      color: product.colors[0].name,
      size: product.sizes[0],
      quantity: 1,
    });
    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-mist">
        <div
          className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
            soldOut ? "opacity-50" : ""
          }`}
        >
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <PlaceholderPhoto
              tone={product.imageTone ?? TONE_BY_CATEGORY[product.category]}
              className="h-full w-full"
            />
          )}
        </div>

        {badge && (
          <div className="absolute left-3 top-3">
            <Badge tone={badge.tone}>{badge.label}</Badge>
          </div>
        )}

        <WishlistButton slug={product.slug} className="absolute right-3 top-3" />

        {!soldOut && (
          <div className="absolute inset-x-0 bottom-0 translate-y-0 p-3 transition-transform duration-300 sm:translate-y-full sm:group-hover:translate-y-0">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="label-caps flex w-full items-center justify-center gap-1.5 bg-ink py-2.5 text-[11px] text-paper transition-colors hover:bg-petrol"
            >
              {adding && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l5 5L20 6" />
                </svg>
              )}
              {adding ? "Adicionado" : "Adicionar rápido"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="label-caps text-[11px] text-graphite">{product.brandName}</p>
        <h3 className="text-sm text-ink">{product.name}</h3>
        <PriceBlock price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
        <div className="flex items-center gap-1 pt-1">
          {product.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3.5 w-3.5 rounded-full border border-mist"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
