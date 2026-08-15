import { db } from "../db";
import type { StoreSettings } from "../types";

const SETTINGS_ID = 1;

export async function getSettings(): Promise<StoreSettings> {
  const row = await db.settings.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
  return { freeShippingThreshold: row.freeShippingThreshold, whatsappNumber: row.whatsappNumber };
}

export async function updateSettings(input: Partial<StoreSettings>): Promise<StoreSettings> {
  const row = await db.settings.update({ where: { id: SETTINGS_ID }, data: input });
  return { freeShippingThreshold: row.freeShippingThreshold, whatsappNumber: row.whatsappNumber };
}
