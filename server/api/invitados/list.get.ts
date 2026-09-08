import { getPool } from "../../utils/db";
import { INVITADOS_COOKIE, isValidSessionToken } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getCookie(event, INVITADOS_COOKIE);

  if (!isValidSessionToken(token, config.adminPassword)) {
    throw createError({ statusCode: 401, statusMessage: "No autorizado." });
  }

  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, full_name, phone, attendance, passes_count, created_at
     FROM rsvps
     ORDER BY created_at DESC`
  );

  return { ok: true, rows };
});
