"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateOrderStatus, type UpdateOrderResult } from "@/server/repositories/order-repository";
import type { OrderStatus } from "@/server/types";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function updateOrderStatusAction(
  id: string,
  status: OrderStatus,
  tracking: string,
): Promise<UpdateOrderResult> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Acesso restrito ao administrador." };
  }
  const result = await updateOrderStatus(id, status, tracking);
  if (result.success) {
    revalidatePath("/admin/pedidos");
    revalidatePath("/conta/pedidos");
    revalidatePath("/rastreamento");
  }
  return result;
}
