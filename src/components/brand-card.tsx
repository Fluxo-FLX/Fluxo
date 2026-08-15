import Link from "next/link";
import type { Brand } from "@/lib/types";

const ACCENT_CLASSES: Record<Brand["accent"], string> = {
  petrol: "text-petrol",
  sand: "text-sand",
  ink: "text-ink",
};

function initials(name: string) {
  const parts = name.replace(/^Marca\s+/i, "").split(" ");
  const letters = parts.find((p) => /^[A-Za-z]+$/.test(p));
  const numbers = parts.find((p) => /^[0-9]+$/.test(p));
  return `${letters ? letters[0] : ""}${numbers ?? ""}`.toUpperCase();
}

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/marcas/${brand.slug}`}
      className="group flex flex-col items-center gap-4 border border-mist p-8 text-center transition-colors hover:border-petrol"
    >
      <span className={`font-display text-3xl tracking-tight ${ACCENT_CLASSES[brand.accent]}`}>
        {initials(brand.name)}
      </span>
      <div>
        <p className="text-sm text-ink">{brand.name}</p>
        <p className="mt-1 text-xs text-graphite">{brand.tagline}</p>
      </div>
    </Link>
  );
}
