import { getPool } from "../../../utils/db";
import { ensurePhotosTable, photoUrl, requireAdmin } from "../../../utils/photos";

interface PhotoRow {
  id: number;
  filename: string;
  guest_name: string | null;
  status: string;
  created_at: string;
}

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  await ensurePhotosTable();

  const [rows] = await getPool().query(
    `SELECT id, filename, guest_name, status, created_at
     FROM photos
     ORDER BY id DESC`
  );

  return {
    ok: true,
    photos: (rows as PhotoRow[]).map((r) => ({
      id: r.id,
      url: photoUrl(r.filename),
      guestName: r.guest_name,
      status: r.status,
      createdAt: r.created_at,
    })),
  };
});
