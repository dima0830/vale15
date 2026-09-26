import { getPool } from "../../utils/db";
import { ensurePhotosTable, photoUrl } from "../../utils/photos";

interface PhotoRow {
  id: number;
  filename: string;
  guest_name: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

// Público: solo fotos aprobadas, para la pantalla grande.
export default defineEventHandler(async () => {
  await ensurePhotosTable();
  const [rows] = await getPool().query(
    `SELECT id, filename, guest_name, width, height, created_at
     FROM photos
     WHERE status = 'approved'
     ORDER BY id DESC
     LIMIT 500`
  );

  return {
    ok: true,
    photos: (rows as PhotoRow[]).map((r) => ({
      id: r.id,
      url: photoUrl(r.filename),
      guestName: r.guest_name,
      width: r.width,
      height: r.height,
      createdAt: r.created_at,
    })),
  };
});
