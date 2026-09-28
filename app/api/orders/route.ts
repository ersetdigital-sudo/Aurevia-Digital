import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { adminClient } from "@/lib/supabase";
import { badRequest, num, serverError, str } from "@/lib/adminApi";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateRef(): string {
  const bytes = randomBytes(6);
  let out = "";
  for (let i = 0; i < 6; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return `AD-${out}`;
}

/**
 * POST /api/orders — dipanggil checkout situs publik.
 * Menulis pesanan ke Supabase (service role, RLS menutup akses anon).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const category = str(body.category, "", 80);
  const product = str(body.product, "", 160);
  const target = str(body.target, "", 60);
  const amount = num(body.amount, 0);

  if (!category) return badRequest("Kategori layanan wajib diisi.");
  if (!product) return badRequest("Produk wajib dipilih.");
  if (target.length < 4) return badRequest("Nomor tujuan belum valid.");
  if (amount < 0) return badRequest("Nominal tidak valid.");

  const client = adminClient();
  let categoryId: string | null = null;

  const { data: categoryRow } = await client
    .from("categories")
    .select("id")
    .eq("slug", category)
    .maybeSingle();
  categoryId = categoryRow?.id ?? null;

  // Coba beberapa kali kalau nomor referensi bentrok
  for (let attempt = 0; attempt < 4; attempt++) {
    const ref = generateRef();
    const { data, error } = await client
      .from("orders")
      .insert({
        ref,
        category,
        category_id: categoryId,
        product,
        target,
        amount,
        status: "pending",
        payment_method: "QRIS",
        invoice_no: str(body.invoice_no, "", 60) || null,
      })
      .select("ref, status, created_at")
      .single();

    if (!error) {
      return NextResponse.json({ order: data }, { status: 201 });
    }
    if (error.code !== "23505") return serverError(error.message); // bukan unique violation
  }

  return serverError("Gagal membuat nomor referensi. Coba lagi.");
}
