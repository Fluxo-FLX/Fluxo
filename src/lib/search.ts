import type { Product } from "./types";

/** Shared by the server repository (authoritative) and the client search view (instant, on the fetched snapshot). */
export function matchesSearch(product: Product, term: string) {
  const haystack = [product.name, product.brandName, product.category, product.subcategory, ...product.tags]
    .join(" ")
    .toLowerCase();
  return haystack.includes(term.toLowerCase());
}
