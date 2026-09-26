import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { getPool } from "../../../utils/db";
import { ensurePhotosTable, getUploadsDir, isAdmin, PHOTO_FILENAME_RE } from "../../../utils/photos";

const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;

// Sirve las fotos desde el volumen. Las no aprobadas solo las ve el moderador.
export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name") ?? "";
  if (!PHOTO_FILENAME_RE.test(name)) {
    throw createError({ statusCode: 404, statusMessage: "No encontrada." });
  }

  await ensurePhotosTable();
  const [rows] = await getPool().query("SELECT status FROM photos WHERE filename = ?", [name]);
  const row = (rows as { status: string }[])[0];
  if (!row || (row.status !== "approved" && !isAdmin(event))) {
    throw createError({ statusCode: 404, statusMessage: "No encontrada." });
  }

  const path = join(await getUploadsDir(), name);
  const info = await stat(path).catch(() => null);
  if (!info) {
    throw createError({ statusCode: 404, statusMessage: "No encontrada." });
  }

  const ext = name.split(".").pop() as keyof typeof MIME;
  setResponseHeaders(event, {
    "Content-Type": MIME[ext],
    "Content-Length": String(info.size),
    // Las aprobadas son inmutables; las demás no se cachean para que el cambio de estado aplique.
    "Cache-Control": row.status === "approved" ? "public, max-age=31536000, immutable" : "private, no-store",
  });
  return sendStream(event, createReadStream(path));
});
