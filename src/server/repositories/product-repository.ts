import { db } from "../db";
import { matchesSearch } from "@/lib/search";
import type { Product } from "@/lib/types";
import type { StoredProduct } from "../types";
import type { Prisma } from "@/generated/prisma/client";

type ProductRow = Prisma.ProductGetPayload<{ include: { brand: true } }>;

function toProduct(row: ProductRow): Product {
  const { brand, ...rest } = row;
  return {
    ...rest,
    compareAtPrice: rest.compareAtPrice ?? undefined,
    colors: rest.colors as Product["colors"],
    imageTone: (rest.imageTone as Product["imageTone"] | null) ?? undefined,
    sizeGuideRows: (rest.sizeGuideRows as Product["sizeGuideRows"] | null) ?? undefined,
    isNew: rest.isNew || undefined,
    isBestSeller: rest.isBestSeller || undefined,
    relatedSlugs: rest.relatedSlugs.length > 0 ? rest.relatedSlugs : undefined,
    brandName: brand.name,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({ include: { brand: true } });
  return rows.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!slug) return undefined;
  const row = await db.product.findUnique({ where: { slug }, include: { brand: true } });
  return row ? toProduct(row) : undefined;
}

export async function getProductsByBrand(slug: string): Promise<Product[]> {
  const rows = await db.product.findMany({ where: { brandSlug: slug }, include: { brand: true } });
  return rows.map(toProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { category: category as Prisma.ProductWhereInput["category"] },
    include: { brand: true },
  });
  return rows.map(toProduct);
}

/** Distinct subcategories within a category, sorted alphabetically — powers the header mega menu. */
export async function getSubcategoriesByCategory(category: string): Promise<string[]> {
  const rows = await db.product.findMany({
    where: { category: category as Prisma.ProductWhereInput["category"] },
    select: { subcategory: true },
    distinct: ["subcategory"],
  });
  return rows.map((r) => r.subcategory).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  if (!product.relatedSlugs) return [];
  const rows = await db.product.findMany({
    where: { slug: { in: product.relatedSlugs } },
    include: { brand: true },
  });
  const bySlug = new Map(rows.map((row) => [row.slug, toProduct(row)]));
  return product.relatedSlugs.map((slug) => bySlug.get(slug)).filter((p): p is Product => Boolean(p));
}

/** Matches against name, brand, category, subcategory and tags. */
export async function searchProducts(query: string): Promise<Product[]> {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  const all = await getAllProducts();
  return all.filter((p) => matchesSearch(p, term));
}

export type ProductInput = StoredProduct;

export type ProductMutationResult = { success: true; product: Product } | { success: false; error: string };

export async function createProduct(input: ProductInput): Promise<ProductMutationResult> {
  const existing = await db.product.findUnique({ where: { slug: input.slug } });
  if (existing) {
    return { success: false, error: "Já existe um produto com esse slug." };
  }
  const brand = await db.brand.findUnique({ where: { slug: input.brandSlug } });
  if (!brand) {
    return { success: false, error: "Marca inválida." };
  }
  const created = await db.product.create({
    data: input as unknown as Prisma.ProductCreateInput,
    include: { brand: true },
  });
  return { success: true, product: toProduct(created) };
}

export async function updateProduct(
  slug: string,
  input: Partial<Omit<ProductInput, "slug">>,
): Promise<ProductMutationResult> {
  const existing = await db.product.findUnique({ where: { slug } });
  if (!existing) return { success: false, error: "Produto não encontrado." };
  if (input.brandSlug) {
    const brand = await db.brand.findUnique({ where: { slug: input.brandSlug } });
    if (!brand) return { success: false, error: "Marca inválida." };
  }
  const updated = await db.product.update({
    where: { slug },
    data: input as unknown as Prisma.ProductUpdateInput,
    include: { brand: true },
  });
  return { success: true, product: toProduct(updated) };
}

export type DeleteProductResult = { success: true } | { success: false; error: string };

export async function deleteProduct(slug: string): Promise<DeleteProductResult> {
  const existing = await db.product.findUnique({ where: { slug } });
  if (!existing) return { success: false, error: "Produto não encontrado." };
  await db.product.delete({ where: { slug } });
  return { success: true };
}
