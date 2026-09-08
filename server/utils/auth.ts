import { createHmac, timingSafeEqual } from "node:crypto";

export const INVITADOS_COOKIE = "vale15_invitados_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

function getSecret(adminPassword: string) {
  return createHmac("sha256", "vale15-invitados-salt").update(adminPassword).digest("hex");
}

function sign(secret: string, value: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createSessionToken(adminPassword: string) {
  const secret = getSecret(adminPassword);
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const signature = sign(secret, String(expiresAt));
  return `${expiresAt}.${signature}`;
}

export function isValidSessionToken(token: string | undefined, adminPassword: string) {
  if (!token || !adminPassword) return false;
  const [expiresAtStr, signature] = token.split(".");
  if (!expiresAtStr || !signature) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const secret = getSecret(adminPassword);
  const expected = sign(secret, expiresAtStr);
  return safeEqual(signature, expected);
}
