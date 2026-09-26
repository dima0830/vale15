import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getPool } from "../../utils/db";
import { detectImageType, ensurePhotosTable, getUploadsDir } from "../../utils/photos";

const MAX_BYTES = 15 * 1024 * 1024;

// Recibe UNA foto por petición (el cliente las envía de a una y ya comprimidas).
export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  const file = parts?.find((p) => p.name === "foto" && p.filename);
  const guestName = String(parts?.find((p) => p.name === "guestName")?.data ?? "")
    .trim()
    .slice(0, 80);
  const width = Number(parts?.find((p) => p.name === "width")?.data ?? "") || null;
  const height = Number(parts?.find((p) => p.name === "height")?.data ?? "") || null;

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: "No se recibió ninguna foto." });
  }
  if (file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: "La foto es demasiado grande." });
  }

  const ext = detectImageType(file.data);
  if (!ext) {
    throw createError({ statusCode: 415, statusMessage: "Formato no soportado. Usa JPG, PNG o WEBP." });
  }

  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
  await writeFile(join(await getUploadsDir(), filename), file.data);

  const ip =
    getRequestHeader(event, "x-forwarded-for")?.split(",")[0]?.trim() ||
    event.node.req.socket.remoteAddress ||
    "";

  await ensurePhotosTable();
  const [result] = await getPool().query(
    `INSERT INTO photos (filename, guest_name, width, height, ip_address)
     VALUES (?, ?, ?, ?, ?)`,
    [filename, guestName || null, width, height, ip]
  );

  return { ok: true, id: (result as { insertId: number }).insertId };
});
