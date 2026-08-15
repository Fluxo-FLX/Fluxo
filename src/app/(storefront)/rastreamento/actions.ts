"use server";

import { auth } from "@/auth";
import { findOrderById } from "@/server/repositories/order-repository";
import type { Order } from "@/server/types";

export type TrackOrderResult = { found: true; order: Order } | { found: false };

/**
 * Logged-in users are authorized by session alone. Guests (no session —
 * checkout doesn't require an account) must additionally provide the
 * e-mail the order was placed with, since there's no other credential to
 * check against.
 */
export async function trackOrderAction(orderId: string, email?: string): Promise<TrackOrderResult> {
  const order = await findOrderById(orderId.trim());
  if (!order) return { found: false };

  const session = await auth();
  const sessionEmail = session?.user?.email?.toLowerCase();
  const providedEmail = email?.trim().toLowerCase();
  const orderEmail = order.userEmail.toLowerCase();

  const authorized = sessionEmail === orderEmail || (Boolean(providedEmail) && providedEmail === orderEmail);
  if (!authorized) return { found: false };

  return { found: true, order };
}
