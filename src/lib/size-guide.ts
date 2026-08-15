export type SizeGuideKind = "camiseta" | "shorts" | "calca" | "unico";

const SUBCATEGORY_KIND: Record<string, SizeGuideKind> = {
  Camisetas: "camiseta",
  Regatas: "camiseta",
  Shorts: "shorts",
  Boardshorts: "shorts",
  Bermudas: "shorts",
  Calças: "calca",
};

/** Only used to pick which illustration to draw in the size guide modal. */
export function getSizeGuideKind(subcategory: string): SizeGuideKind {
  return SUBCATEGORY_KIND[subcategory] ?? "unico";
}

/** Per-product measurement row, set by the admin on each product individually. */
export type SizeGuideRow = { label: string; values: Record<string, string> };
