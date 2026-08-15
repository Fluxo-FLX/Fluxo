"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateProduct, type ProductMutationResult } from "@/server/repositories/product-repository";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function updateStockAction(slug: string, stock: number): Promise<ProductMutationResult> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Acesso restrito ao administrador." };
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { success: false, error: "Informe um número inteiro maior ou igual a zero." };
  }

  const result = await updateProduct(slug, { stock });
  if (result.success) {
    revalidatePath("/admin/estoque");
    revalidatePath("/admin/produtos");
    revalidatePath("/admin");
    revalidatePath(`/produto/${result.product.slug}`);
  }
  return result;
}
