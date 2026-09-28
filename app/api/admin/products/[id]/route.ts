import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { badRequest, bool, guard, num, serverError, str } from "@/lib/adminApi";

type Params = { params: Promise<{ id: string }> };

/** PUT /api/admin/products/[id] — ubah produk */
export async function PUT(request: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string") {
    const name = str(body.name, "", 120);
    if (!name) return badRequest("Nama produk tidak boleh kosong.");
    patch.name = name;
  }
  if (typeof body.category_id === "string" && body.category_id) patch.category_id = body.category_id;
  if (typeof body.detail === "string") patch.detail = str(body.detail, "", 240);
  if ("price" in body) patch.price = num(body.price, 0);
  if ("variable" in body) patch.variable = bool(body.variable, false);
  if (typeof body.group_name === "string") patch.group_name = str(body.group_name, "", 80);
  if ("image_url" in body) patch.image_url = str(body.image_url as string, "", 500) || null;
  if ("sort" in body) patch.sort = num(body.sort, 0);
  if ("active" in body) patch.active = body.active === true;

  if (Object.keys(patch).length === 0) return badRequest("Tidak ada perubahan.");

  const { data, error } = await adminClient()
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ product: data });
}

/** DELETE /api/admin/products/[id] — hapus produk */
export async function DELETE(_request: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const { error } = await adminClient().from("products").delete().eq("id", id);
  if (error) return serverError(error.message);
  return NextResponse.json({ ok: true });
}
