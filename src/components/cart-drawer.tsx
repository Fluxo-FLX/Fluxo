"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { formatPrice } from "@/lib/format";
import { PIX_DISCOUNT } from "@/lib/money";
import { CartCrossSell } from "./cart-cross-sell";
import { QuantityStepper } from "./quantity-stepper";
import { ButtonLink } from "./button";
import { ProductThumb } from "./product-thumb";

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeLine, updateQuantity, subtotal, getCartProduct } = useCart();
  const { toggle } = useWishlist();
  const { settings } = useStoreSettings();
  const [showOffers, setShowOffers] = useState(false);

  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / settings.freeShippingThreshold) * 100);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-paper shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Carrinho"
      >
        <div className="flex items-center justify-between border-b border-mist p-5">
          <h2 className="font-display text-lg">Seu carrinho</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="-m-2 p-2 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="border-b border-mist px-5 py-4">
          {remainingForFreeShipping > 0 ? (
            <p className="text-xs text-graphite">
              Você está a <strong className="text-ink">{formatPrice(remainingForFreeShipping)}</strong> do frete grátis.
            </p>
          ) : (
            <p className="text-xs text-petrol">Você garantiu frete grátis 🎉</p>
          )}
          <div className="mt-2 h-1 w-full bg-mist">
            <div className="h-1 bg-petrol transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-sm text-graphite">Seu carrinho está vazio.</p>
              {showOffers ? (
                <div className="w-full border border-mist p-4 text-left text-xs text-graphite">
                  <p className="label-caps mb-3 text-[10px] text-ink">Ofertas disponíveis</p>
                  <ul className="space-y-2">
                    <li>
                      <span className="text-ink">Cupom FLUXO10</span> · 10% OFF na primeira compra
                    </li>
                    <li>
                      <span className="text-ink">{Math.round(PIX_DISCOUNT * 100)}% OFF no Pix</span> em qualquer
                      compra
                    </li>
                    <li>
                      <span className="text-ink">Frete grátis</span> a partir de{" "}
                      {formatPrice(settings.freeShippingThreshold)}
                    </li>
                  </ul>
                  <button
                    onClick={() => setShowOffers(false)}
                    className="label-caps mt-3 text-[10px] text-graphite hover:text-petrol"
                  >
                    Ocultar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowOffers(true)}
                  className="label-caps border border-mist px-4 py-2.5 text-[11px] text-ink transition-colors hover:border-petrol hover:text-petrol"
                >
                  Confira as ofertas disponíveis
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-mist">
              {lines.map((line) => {
                const product = getCartProduct(line.productSlug);
                if (!product) return null;
                return (
                  <li key={`${line.productSlug}-${line.color}-${line.size}`} className="flex gap-4 py-5">
                    <ProductThumb product={product} color={line.color} className="h-24 w-20 shrink-0" />
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="label-caps text-[10px] text-graphite">
                        {product.subcategory}
                      </p>
                      <p className="text-sm">{product.name}</p>
                      <p className="text-xs text-graphite">
                        {line.color} · {line.size}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <QuantityStepper
                          value={line.quantity}
                          onChange={(q) => updateQuantity(line.productSlug, line.color, line.size, q)}
                        />
                        <span className="text-sm font-medium">
                          {formatPrice(product.price * line.quantity)}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-3 text-[11px]">
                        <button
                          className="label-caps text-graphite underline-offset-2 hover:text-petrol hover:underline"
                          onClick={() => removeLine(line.productSlug, line.color, line.size)}
                        >
                          Remover
                        </button>
                        <button
                          className="label-caps text-graphite underline-offset-2 hover:text-petrol hover:underline"
                          onClick={() => toggle(line.productSlug)}
                        >
                          Favoritar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {lines.length > 0 && (
            <div className="border-t border-mist py-6">
              <CartCrossSell limit={2} />
            </div>
          )}
        </div>

        <div className="border-t border-mist p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-graphite">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-graphite">Frete e descontos calculados no checkout.</p>
          <ButtonLink href="/checkout" onClick={closeCart} className="mt-4 w-full" variant="primary">
            Ir para o checkout
          </ButtonLink>
        </div>
      </aside>
    </>
  );
}
