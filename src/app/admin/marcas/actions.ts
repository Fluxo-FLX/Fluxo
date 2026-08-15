"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { brandFormSchema, type BrandFormInput } from "@/lib/admin-validation";
import {
  createBrand,
  deleteBrand,
  getBrand,
  updateBrand,
  type DeleteBrandResult,
} from "@/server/repositories/brand-repository";
import type { Brand } from "@/lib/types";

type BrandMutationResult = { success: true; brand: Brand } | { success: false; error: string };

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

function revalidateBrandPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/marcas");
  revalidatePath(`/marcas/${slug}`);
  revalidatePath("/loja");
  revalidatePath("/fitness");
  revalidatePath("/surf");
  revalidatePath("/casual");
}

export async function createBrandAction(input: BrandFormInput): Promise<BrandMutationResult> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Acesso restrito ao administrador." };
  }
  const parsed = brandFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  if (await getBrand(parsed.data.slug)) {
    return { success: false, error: "Já existe uma marca com esse slug." };
  }

  const brand = await createBrand(parsed.data);
  revalidateBrandPaths(brand.slug);
  return { success: true, brand };
}

export async function updateBrandAction(slug: string, input: BrandFormInput): Promise<BrandMutationResult> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Acesso restrito ao administrador." };
  }
  const parsed = brandFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const brand = await updateBrand(slug, {
    name: parsed.data.name,
    tagline: parsed.data.tagline,
    description: parsed.data.description,
    history: parsed.data.history,
    categories: parsed.data.categories,
    accent: parsed.data.accent,
  });
  if (!brand) {
    return { success: false, error: "Marca não encontrada." };
  }
  revalidateBrandPaths(slug);
  return { success: true, brand };
}

export async function deleteBrandAction(slug: string): Promise<DeleteBrandResult> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Acesso restrito ao administrador." };
  }
  const result = await deleteBrand(slug);
  if (result.success) revalidateBrandPaths(slug);
  return result;
}
