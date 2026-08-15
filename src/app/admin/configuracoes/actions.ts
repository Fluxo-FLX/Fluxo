"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { updateSettings } from "@/server/repositories/settings-repository";
import type { StoreSettings } from "@/server/types";

const settingsFormSchema = z.object({
  freeShippingThreshold: z.number("Informe um valor válido.").min(0, "O valor não pode ser negativo."),
  whatsappNumber: z
    .string()
    .regex(/^\d{10,15}$/, "Use apenas números, com DDI e DDD (ex: 5584999999999)."),
});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
export type SettingsMutationResult = { success: true; settings: StoreSettings } | { success: false; error: string };

export async function updateSettingsAction(input: SettingsFormInput): Promise<SettingsMutationResult> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { success: false, error: "Acesso restrito ao administrador." };
  }

  const parsed = settingsFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const settings = await updateSettings(parsed.data);
  // Settings affect pages across the whole storefront (shipping, WhatsApp
  // links), so revalidate everything rather than tracking every path.
  revalidatePath("/", "layout");
  return { success: true, settings };
}
