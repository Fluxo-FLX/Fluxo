import type { PlaceholderTone } from "@/components/placeholder-photo";
import type { SizeGuideRow } from "./size-guide";

export type CategorySlug = "fitness" | "surf" | "street";

export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  history: string;
  categories: CategorySlug[];
  accent: "petrol" | "sand" | "ink";
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  slug: string;
  name: string;
  brandSlug: string;
  /**
   * Denormalized brand name — always populated fresh by the product
   * repository at read time (never trusted from storage/input), so
   * renaming a brand shows up on every product immediately without a
   * cascade-update step.
   */
  brandName: string;
  category: CategorySlug;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  description: string;
  composition: string;
  care: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  relatedSlugs?: string[];
  /** Stock level — drives the "Esgotado"/"Últimas peças" badges and purchase gating. */
  stock: number;
  /** Overrides the category-derived placeholder art direction when set. */
  imageTone?: PlaceholderTone;
  /** Real photo URLs. Falls back to the generated placeholder when empty. */
  images?: string[];
  /** Measurement table for the size guide modal, set per product by the admin. */
  sizeGuideRows?: SizeGuideRow[];
};

export type Look = {
  slug: string;
  title: string;
  category: CategorySlug;
  description: string;
  productSlugs: string[];
};

export type Testimonial = {
  name: string;
  city: string;
  rating: number;
  text: string;
};

export type CartLine = {
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
};
