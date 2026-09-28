import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { badRequest, bool, guard, num, serverError, str } from "@/lib/adminApi";

/** GET /api/admin/products?category=<id> — daftar produk (semua status) */
export async function GET(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category");

  let query = adminClient()
    .from("products")
    .select("*")
    .order("sort", { ascending: true })
    .order("created_at", { ascending: true });
  if (categoryId) query = query.eq("category_id", categoryId);

  const { data, error } = await query;
  if (error) return serverError(error.message);
  return NextResponse.json({ products: data ?? [] });
}

/** POST /api/admin/products — tambah produk */
export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = str(body.name, "", 120);
  const categoryId = str(body.category_id, "", 60);
  if (!name) return badRequest("Nama produk wajib diisi.");
  if (!categoryId) return badRequest("Kategori wajib dipilih.");

  const { data, error } = await adminClient()
    .from("products")
    .insert({
      category_id: categoryId,
      name,
      detail: str(body.detail, "", 240),
      price: num(body.price, 0),
      variable: bool(body.variable, false),
      group_name: str(body.group_name, "", 80),
      image_url: typeof body.image_url === "string" && body.image_url ? body.image_url : null,
      sort: num(body.sort, 0),
      active: body.active !== false,
    })
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ product: data }, { status: 201 });
}
