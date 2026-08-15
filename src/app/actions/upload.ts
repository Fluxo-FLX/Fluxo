"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type UploadImageResult = { success: true; url: string } | { success: false; error: string };

/**
 * Saves to public/uploads on local disk — fine for this dev/demo stage, but
 * won't survive a serverless deploy (e.g. Vercel's read-only filesystem).
 * Swap for real object storage (S3, Supabase Storage, Cloudinary) once the
 * store moves off the in-memory database.
 */
export async function uploadImageAction(formData: FormData): Promise<UploadImageResult> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { success: false, error: "Acesso restrito ao administrador." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "Nenhum arquivo enviado." };
  }

  const extension = EXTENSION_BY_TYPE[file.type];
  if (!extension) {
    return { success: false, error: "Envie uma imagem em JPG, PNG, WEBP ou GIF." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "A imagem deve ter no máximo 5 MB." };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return { success: true, url: `/uploads/${filename}` };
}
