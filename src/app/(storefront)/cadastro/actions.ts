"use server";

import { createUser, findUserByEmail } from "@/server/repositories/user-repository";
import { getClientIp, rateLimit } from "@/server/rate-limit";
import { signupSchema } from "@/lib/validation";

const SIGNUP_LIMIT = 10;
const SIGNUP_WINDOW_MS = 10 * 60 * 1000;

export type SignupResult = { success: true } | { success: false; error: string };

export async function signupAction(input: unknown): Promise<SignupResult> {
  const ip = await getClientIp();
  const limited = rateLimit(`signup:${ip}`, SIGNUP_LIMIT, SIGNUP_WINDOW_MS);
  if (!limited.allowed) {
    return { success: false, error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
  }

  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { name, email, password } = parsed.data;

  if (await findUserByEmail(email)) {
    return { success: false, error: "Já existe uma conta com esse e-mail." };
  }

  await createUser({ name, email, password });
  return { success: true };
}
