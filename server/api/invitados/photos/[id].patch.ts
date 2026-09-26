import { getPool } from "../../../utils/db";
import { ensurePhotosTable, PHOTO_STATUSES, requireAdmin, type PhotoStatus } from "../../../utils/photos";

export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);
  const status = String(body?.status ?? "") as PhotoStatus;

  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: "ID inválido." });
  }
  if (!PHOTO_STATUSES.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: "Estado inválido." });
  }

  await ensurePhotosTable();
  await getPool().query(
    "UPDATE photos SET status = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?",
    [status, id]
  );

  return { ok: true };
});
