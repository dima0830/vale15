import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { getPool } from "../../../utils/db";
import { ensurePhotosTable, getUploadsDir, PHOTO_FILENAME_RE, requireAdmin } from "../../../utils/photos";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: "ID inválido." });
  }

  await ensurePhotosTable();
  const pool = getPool();
  const [rows] = await pool.query("SELECT filename FROM photos WHERE id = ?", [id]);
  const filename = (rows as { filename: string }[])[0]?.filename;
  if (!filename) return { ok: true };

  await pool.query("DELETE FROM photos WHERE id = ?", [id]);
  if (PHOTO_FILENAME_RE.test(filename)) {
    await unlink(join(await getUploadsDir(), filename)).catch(() => {});
  }

  return { ok: true };
});
