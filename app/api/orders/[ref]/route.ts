import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { badRequest, str } from "@/lib/adminApi";

type Params = { params: Promise<{ ref: string }> };

/**
 * GET /api/orders/[ref] — cek status transaksi (halaman Cek Status).
 * Hanya field yang aman ditampilkan ke publik.
 */
export async function GET(_request: Request, { params }: Params) {
  const { ref } = await params;
  const code = str(ref, "", 30).toUpperCase();
  if (!code) return badRequest("Nomor referensi wajib diisi.");

  const { data, error } = await adminClient()
    .from("orders")
    .select("ref, category, product, target, amount, status, payment_method, created_at, updated_at")
    .eq("ref", code)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Gagal menyalakan transaksi." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Nomor referensi tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ order: data });
}
