import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import type { H3Event } from "h3";
import { getPool } from "./db";
import { INVITADOS_COOKIE, isValidSessionToken } from "./auth";

export type PhotoStatus = "pending" | "approved" | "rejected";
export const PHOTO_STATUSES: PhotoStatus[] = ["pending", "approved", "rejected"];

// Solo nombres generados por nosotros: evita path traversal al servir archivos.
export const PHOTO_FILENAME_RE = /^[a-z0-9-]+\.(jpg|png|webp)$/;

let tableReady: Promise<void> | null = null;

// La tabla se crea sola la primera vez que se usa, sin migraciones manuales.
export function ensurePhotosTable() {
  if (!tableReady) {
    tableReady = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS photos (
          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          filename VARCHAR(100) NOT NULL UNIQUE,
          guest_name VARCHAR(80) NULL,
          status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
          width INT UNSIGNED NULL,
          height INT UNSIGNED NULL,
          ip_address VARCHAR(64) NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          reviewed_at TIMESTAMP NULL,
          INDEX idx_status_created (status, created_at)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      )
      .then(() => undefined)
      .catch((error) => {
        tableReady = null;
        throw error;
      });
  }
  return tableReady;
}

export async function getUploadsDir() {
  const dir = resolve(useRuntimeConfig().uploadsDir);
  await mkdir(dir, { recursive: true });
  return dir;
}

export function isAdmin(event: H3Event) {
  const config = useRuntimeConfig();
  return isValidSessionToken(getCookie(event, INVITADOS_COOKIE), config.adminPassword);
}

export function requireAdmin(event: H3Event) {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: "No autorizado." });
  }
}

export function photoUrl(filename: string) {
  return `/api/photos/file/${filename}`;
}

// Detecta el formato real por los "magic bytes", no por lo que diga el cliente.
export function detectImageType(data: Buffer): "jpg" | "png" | "webp" | null {
  if (data.length < 12) return null;
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "jpg";
  if (data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}
