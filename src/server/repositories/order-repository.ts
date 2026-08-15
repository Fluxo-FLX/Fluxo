import { db } from "../db";
import type { Order, OrderStatus } from "../types";
import type { Prisma } from "@/generated/prisma/client";

export type { Order, OrderItem, OrderStatus, PaymentMethod } from "../types";

type OrderRow = Prisma.OrderGetPayload<object>;

function toOrder(row: OrderRow): Order {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    couponCode: row.couponCode ?? undefined,
    tracking: row.tracking ?? undefined,
    paymentMethod: row.paymentMethod as Order["paymentMethod"],
    status: row.status as Order["status"],
    items: row.items as Order["items"],
    address: row.address as Order["address"],
  };
}

export async function addOrder(order: Order): Promise<Order> {
  const { createdAt, ...rest } = order;
  const created = await db.order.create({
    data: {
      ...rest,
      createdAt: new Date(createdAt),
      items: rest.items as unknown as Prisma.InputJsonValue,
      address: rest.address as unknown as Prisma.InputJsonValue,
    },
  });
  return toOrder(created);
}

export async function getAllOrders(): Promise<Order[]> {
  const rows = await db.order.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toOrder);
}

export async function findOrdersByEmail(email: string): Promise<Order[]> {
  const rows = await db.order.findMany({
    where: { userEmail: { equals: email, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function findOrderById(id: string): Promise<Order | undefined> {
  if (!id) return undefined;
  const row = await db.order.findUnique({ where: { id } });
  return row ? toOrder(row) : undefined;
}

export type UpdateOrderResult = { success: true; order: Order } | { success: false; error: string };

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  tracking?: string,
): Promise<UpdateOrderResult> {
  const existing = await db.order.findUnique({ where: { id } });
  if (!existing) return { success: false, error: "Pedido não encontrado." };
  const updated = await db.order.update({
    where: { id },
    data: { status, ...(tracking !== undefined ? { tracking: tracking || null } : {}) },
  });
  return { success: true, order: toOrder(updated) };
}

export function generateOrderId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `FLX-${random}`;
}
