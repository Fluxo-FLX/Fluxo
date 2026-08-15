"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { productFormSchema, type ProductFormInput } from "@/lib/admin-validation";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  type DeleteProductResult,
  type ProductInput,
  type ProductMutationResult,
} from "@/server/repositories/product-repository";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

function toStoredProduct(input: ProductFormInput): ProductInput {
  const tags = (input.tagsRaw ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    slug: input.slug,
    name: input.name,
    brandSlug: input.brandSlug,
    category: input.category,
    subcategory: input.subcategory,
    price: input.price,
    compareAtPrice: input.compareAtPrice === "" || input.compareAtPrice === undefined ? undefined : Number(input.compareAtPrice),
    stock: input.stock,
    colors: input.colors,
    sizes: input.sizes,
    description: input.description,
    composition: input.composition,
    care: input.care.filter((c) => c.trim().length > 0),
    tags,
    isNew: input.isNew,
    isBestSeller: input.isBestSeller,
    imageTone: input.imageTone,
    images: (input.images ?? []).map((url) => url.trim()).filter(Boolean),
    sizeGuideRows: (input.sizeGuideRows ?? []).filter((row) => row.label.trim().length > 0),
  };
}

function revalidateCatalogPaths(slug: string, brandSlug: string) {
  revalidatePath("/");
  revalidatePath("/loja");
  revalidatePath("/fitness");
  revalidatePath("/surf");
  revalidatePath("/casual");
  revalidatePath(`/produto/${slug}`);
  revalidatePath(`/marcas/${brandSlug}`);
}

export async function createProductAction(input: ProductFormInput): Promise<ProductMutationResult> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Acesso restrito ao administrador." };
  }
  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const result = await createProduct(toStoredProduct(parsed.data));
  if (result.success) revalidateCatalogPaths(result.product.slug, result.product.brandSlug);
  return result;
}

export async function updateProductAction(slug: string, input: ProductFormInput): Promise<ProductMutationResult> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Acesso restrito ao administrador." };
  }
  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const stored = toStoredProduct(parsed.data);
  const result = await updateProduct(slug, {
    name: stored.name,
    brandSlug: stored.brandSlug,
    category: stored.category,
    subcategory: stored.subcategory,
    price: stored.price,
    compareAtPrice: stored.compareAtPrice,
    stock: stored.stock,
    colors: stored.colors,
    sizes: stored.sizes,
    description: stored.description,
    composition: stored.composition,
    care: stored.care,
    tags: stored.tags,
    isNew: stored.isNew,
    isBestSeller: stored.isBestSeller,
    imageTone: stored.imageTone,
    images: stored.images,
    sizeGuideRows: stored.sizeGuideRows,
  });
  if (result.success) revalidateCatalogPaths(result.product.slug, result.product.brandSlug);
  return result;
}

export async function deleteProductAction(slug: string, brandSlug: string): Promise<DeleteProductResult> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Acesso restrito ao administrador." };
  }
  const result = await deleteProduct(slug);
  if (result.success) revalidateCatalogPaths(slug, brandSlug);
  return result;
}
