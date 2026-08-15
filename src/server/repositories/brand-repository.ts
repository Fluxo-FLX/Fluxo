import { db } from "../db";
import type { Brand } from "@/lib/types";

export async function getAllBrands(): Promise<Brand[]> {
  return db.brand.findMany({ orderBy: { name: "asc" } }) as Promise<Brand[]>;
}

export async function getBrand(slug: string): Promise<Brand | undefined> {
  if (!slug) return undefined;
  const brand = await db.brand.findUnique({ where: { slug } });
  return (brand as Brand | null) ?? undefined;
}

export async function getBrandName(slug: string): Promise<string> {
  const brand = await getBrand(slug);
  return brand?.name ?? "";
}

export type BrandInput = Omit<Brand, "slug"> & { slug: string };

export async function createBrand(input: BrandInput): Promise<Brand> {
  const existing = await getBrand(input.slug);
  if (existing) {
    throw new Error("Já existe uma marca com esse slug.");
  }
  return db.brand.create({ data: input }) as Promise<Brand>;
}

export async function updateBrand(slug: string, input: Partial<Omit<Brand, "slug">>): Promise<Brand | null> {
  const existing = await getBrand(slug);
  if (!existing) return null;
  return db.brand.update({ where: { slug }, data: input }) as Promise<Brand>;
}

export type DeleteBrandResult = { success: true } | { success: false; error: string };

export async function deleteBrand(slug: string): Promise<DeleteBrandResult> {
  // A brand backing live products can't just vanish — every product
  // would point at a slug nothing resolves, breaking every card that
  // reads brandName. Reassign or remove those products first.
  const linkedCount = await db.product.count({ where: { brandSlug: slug } });
  if (linkedCount > 0) {
    return {
      success: false,
      error: `Esta marca tem ${linkedCount} produto(s) vinculado(s). Remova ou reatribua-os antes de excluir a marca.`,
    };
  }
  const existing = await getBrand(slug);
  if (!existing) return { success: false, error: "Marca não encontrada." };
  await db.brand.delete({ where: { slug } });
  return { success: true };
}
