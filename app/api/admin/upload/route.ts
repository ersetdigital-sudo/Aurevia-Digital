import { NextResponse } from "next/server";
import { guard } from "@/lib/adminApi";
import { MAX_IMAGE_BYTES, sniffImageType, uploadImage } from "@/lib/storage";

export const runtime = "nodejs";

/**
 * POST /api/admin/upload — unggah gambar admin ke Supabase Storage (bucket `images`).
 * Body: multipart/form-data { file, folder? }. Balasan: { url }.
 *
 * Service key hanya hidup di server. Gambar lama dihapus oleh API simpan
 * (produk/pengaturan) setelah perubahan berhasil disimpan, bukan di sini.
 */

const FOLDER_PATTERN = /^[a-z0-9-]{1,32}$/;

const reply = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return reply("File tidak ditemukan.", 400);
  if (file.size === 0) return reply("File kosong.", 400);
  if (file.size > MAX_IMAGE_BYTES) {
    return reply(`Ukuran maksimal ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`, 413);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniffImageType(bytes);
  if (!mime) return reply("Format harus JPG, PNG, atau WEBP.", 415);

  const rawFolder = form?.get("folder");
  const folder = typeof rawFolder === "string" && FOLDER_PATTERN.test(rawFolder) ? rawFolder : "umum";

  try {
    const url = await uploadImage(bytes, mime, folder);
    return NextResponse.json({ url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[upload] gagal", error);
    return reply("Gagal menyimpan gambar ke Supabase Storage.", 502);
  }
}
