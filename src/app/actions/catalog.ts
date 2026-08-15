"use server";

import { getAllBrands, getAllProducts } from "@/lib/demo-data";

/**
 * The only sanctioned way for a Client Component to read the product/brand
 * catalog. Client bundles can't share memory with the server process, so a
 * static `import { products } from "@/lib/demo-data"` inside a "use
 * client" file would freeze a build-time copy that never sees admin
 * edits — this round-trips to the live server store instead.
 */
export async function getCatalogSnapshotAction() {
  const [products, brands] = await Promise.all([getAllProducts(), getAllBrands()]);
  return { products, brands };
}
