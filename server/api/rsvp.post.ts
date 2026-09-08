import { getPool } from "../utils/db";

const ATTENDANCE_VALUES = [
  "Acepto con mucho gusto",
  "Lamentablemente no puedo asistir",
];

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const fullName = String(body?.fullName ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const attendance = String(body?.attendance ?? "").trim();
  const passesCount = Number(body?.passesCount);

  if (!fullName) {
    throw createError({ statusCode: 400, statusMessage: "El nombre completo es requerido." });
  }
  if (!ATTENDANCE_VALUES.includes(attendance)) {
    throw createError({ statusCode: 400, statusMessage: "Selecciona si asistirás." });
  }
  if (![1, 2, 3].includes(passesCount)) {
    throw createError({ statusCode: 400, statusMessage: "Selecciona cuántos pases usarás." });
  }

  const ip =
    getRequestHeader(event, "x-forwarded-for")?.split(",")[0]?.trim() ||
    event.node.req.socket.remoteAddress ||
    "";

  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO rsvps (full_name, phone, attendance, passes_count, ip_address)
     VALUES (?, ?, ?, ?, ?)`,
    [fullName, phone || null, attendance, passesCount, ip]
  );

  return { ok: true, id: (result as { insertId: number }).insertId };
});
