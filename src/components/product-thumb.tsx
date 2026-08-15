import type { Product } from "@/lib/types";

/** Small cart/checkout thumbnail — real photo when available, color swatch otherwise. */
export function ProductThumb({
  product,
  color,
  className = "",
}: {
  product: Product;
  color: string;
  className?: string;
}) {
  const image = product.images?.[0];
  if (image) {
    return <img src={image} alt={product.name} className={`object-cover ${className}`} />;
  }
  const hex = product.colors.find((c) => c.name === color)?.hex ?? "#111111";
  return <div className={className} style={{ backgroundColor: hex }} />;
}
