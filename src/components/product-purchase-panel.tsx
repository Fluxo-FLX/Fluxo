"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { getDemoReviewStats } from "@/lib/reviews";
import { LOW_STOCK_THRESHOLD, isSoldOut } from "@/lib/badges";
import { formatPrice } from "@/lib/format";
import { pixPrice } from "@/lib/money";
import type { Product } from "@/lib/types";
import { PriceBlock } from "./price-block";
import { QuantityStepper } from "./quantity-stepper";
import { SecurityBadge } from "./security-badge";
import { ShareButtons } from "./share-buttons";
import { ShippingEstimate } from "./shipping-estimate";
import { SizeGuideModal } from "./size-guide-modal";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addLine } = useCart();
  const { has, toggle } = useWishlist();
  const router = useRouter();

  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const sizeSectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const stats = getDemoReviewStats(product.slug);
  const soldOut = isSoldOut(product);
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD;

  useEffect(() => {
    if (soldOut || !ctaRef.current) return;
    const el = ctaRef.current;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), {
      rootMargin: "0px 0px -40% 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [soldOut]);

  const ensureSize = () => {
    if (!size) {
      setSizeError(true);
      sizeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!ensureSize()) return;
    addLine({ productSlug: product.slug, color, size: size!, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!ensureSize()) return;
    addLine({ productSlug: product.slug, color, size: size!, quantity });
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/marcas/${product.brandSlug}`} className="label-caps text-xs text-petrol hover:underline">
          {product.brandName}
        </Link>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl">{product.name}</h1>
        <div className="mt-2 flex items-center justify-between gap-3">
          <a
            href="#avaliacoes"
            title="Nota de demonstração, ainda não há avaliações reais"
            className="inline-flex items-center gap-1.5 text-xs text-graphite hover:text-petrol"
          >
            <span className="text-petrol">★ {stats.average}</span>({stats.count} avaliações demo)
          </a>
          <ShareButtons productName={product.name} />
        </div>
      </div>

      <PriceBlock price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />

      <ShippingEstimate price={product.price} quantity={quantity} />

      <div>
        <p className="label-caps mb-2 text-[11px] text-graphite">Cor: {color}</p>
        <div className="flex gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              aria-label={c.name}
              aria-pressed={color === c.name}
              className={`h-9 w-9 rounded-full border-2 transition-colors ${
                color === c.name ? "border-ink" : "border-transparent"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div ref={sizeSectionRef}>
        <p className="label-caps mb-2 text-[11px] text-graphite">Tamanho</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSize(s);
                setSizeError(false);
              }}
              aria-pressed={size === s}
              className={`label-caps flex h-10 min-w-10 items-center justify-center border px-3 text-xs transition-colors ${
                size === s ? "border-ink bg-ink text-paper" : "border-mist text-ink hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {sizeError && <p className="mt-2 text-xs text-red-600">Selecione um tamanho para continuar.</p>}
        <div className="mt-3">
          <SizeGuideModal product={product} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <QuantityStepper value={quantity} onChange={setQuantity} max={soldOut ? 1 : product.stock} />
        {soldOut ? (
          <p className="text-xs text-graphite">Esgotado</p>
        ) : lowStock ? (
          <p className="text-xs text-sand">Últimas {product.stock} peças</p>
        ) : (
          <p className="text-xs text-petrol">Disponível em estoque</p>
        )}
      </div>

      <div ref={ctaRef} className="flex flex-col gap-3">
        {soldOut ? (
          <p className="border border-mist p-4 text-sm text-graphite">
            Este produto está esgotado. Adicione aos favoritos para saber quando chegar novamente.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleAddToCart}
              className="label-caps flex items-center justify-center gap-2 bg-ink py-4 text-xs text-paper transition-colors hover:bg-petrol"
            >
              {added ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                  Adicionado ao carrinho
                </>
              ) : (
                "Adicionar ao carrinho"
              )}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="label-caps border border-ink py-4 text-xs text-ink transition-colors hover:border-petrol hover:text-petrol"
            >
              Comprar agora
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => toggle(product.slug)}
          className="label-caps flex items-center justify-center gap-2 py-2 text-xs text-graphite transition-colors hover:text-petrol"
        >
          <span>{has(product.slug) ? "♥" : "♡"}</span>
          {has(product.slug) ? "Adicionado aos favoritos" : "Adicionar aos favoritos"}
        </button>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-mist pt-3 text-[11px] text-graphite">
          <SecurityBadge />
          <span>Troca ou devolução grátis em até 7 dias</span>
        </div>
      </div>

      {showStickyBar && !soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-mist bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-sm lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-graphite">{product.name}</p>
            <p className="text-sm text-petrol">{formatPrice(pixPrice(product.price))} no Pix</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="label-caps shrink-0 bg-ink px-5 py-3 text-[11px] text-paper transition-colors hover:bg-petrol"
          >
            {added ? "Adicionado ✓" : "Adicionar"}
          </button>
        </div>
      )}
    </div>
  );
}
