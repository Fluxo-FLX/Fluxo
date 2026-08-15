"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Look, Product } from "@/lib/types";
import { PlaceholderPhoto } from "./placeholder-photo";

export function LookCard({ look, products }: { look: Look; products: Product[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative block aspect-[3/4] w-full overflow-hidden"
        aria-expanded={open}
      >
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
          <PlaceholderPhoto tone={look.category} className="h-full w-full" demoTag={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-left text-paper">
          <p className="font-display text-xl">{look.title}</p>
          <p className="mt-1 text-xs text-paper/80">{look.description}</p>
          <span className="label-caps mt-3 inline-flex items-center gap-2 text-[11px]">
            {open ? "Ocultar produtos" : "Ver produtos do look"}
            <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
          </span>
        </div>
      </button>

      {open && (
        <ul className="mt-3 space-y-2 border border-mist p-4">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/produto/${product.slug}`}
                className="flex items-center justify-between text-sm text-ink transition-colors hover:text-petrol"
              >
                <span>{product.name}</span>
                <span className="text-graphite">{formatPrice(product.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
