import { createSessionToken, INVITADOS_COOKIE, SESSION_TTL_SECONDS } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const password = String(body?.password ?? "");

  if (!config.adminPassword) {
    throw createError({ statusCode: 500, statusMessage: "ADMIN_PASSWORD no está configurado en el servidor." });
  }

  if (password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: "Contraseña incorrecta." });
  }

  setCookie(event, INVITADOS_COOKIE, createSessionToken(config.adminPassword), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return { ok: true };
});
