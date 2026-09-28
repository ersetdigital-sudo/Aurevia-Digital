import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { badRequest, guard, num, serverError, str } from "@/lib/adminApi";

type Params = { params: Promise<{ id: string }> };

/** PUT /api/admin/categories/[id] — ubah kategori */
export async function PUT(request: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string") {
    const name = str(body.name, "", 80);
    if (!name) return badRequest("Nama kategori tidak boleh kosong.");
    patch.name = name;
  }
  if (typeof body.slug === "string") patch.slug = str(body.slug, "", 80).toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (typeof body.icon === "string") patch.icon = str(body.icon, "card", 40);
  if (typeof body.tile_class === "string") patch.tile_class = str(body.tile_class, "", 120);
  if (typeof body.description === "string") patch.description = str(body.description, "", 240);
  if (typeof body.nominal_title === "string") patch.nominal_title = str(body.nominal_title, "", 120);
  if (typeof body.field_label === "string") patch.field_label = str(body.field_label, "", 80);
  if (typeof body.field_placeholder === "string") patch.field_placeholder = str(body.field_placeholder, "", 80);
  if (typeof body.field_hint === "string") patch.field_hint = str(body.field_hint, "", 240);
  if ("admin_fee" in body) patch.admin_fee = num(body.admin_fee, 0);
  if ("sort" in body) patch.sort = num(body.sort, 0);
  if ("active" in body) patch.active = body.active === true;

  if (Object.keys(patch).length === 0) return badRequest("Tidak ada perubahan.");

  const { data, error } = await adminClient()
    .from("categories")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ category: data });
}

/** DELETE /api/admin/categories/[id] — hapus kategori beserta produknya */
export async function DELETE(_request: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const { error } = await adminClient().from("categories").delete().eq("id", id);
  if (error) return serverError(error.message);
  return NextResponse.json({ ok: true });
}
