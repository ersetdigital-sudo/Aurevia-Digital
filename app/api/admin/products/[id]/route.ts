import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { deleteImageByUrl } from "@/lib/storage";
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

  // Catat gambar lama; baru dihapus SETELAH perubahan tersimpan.
  let previousImage: string | null = null;
  if ("image_url" in patch) {
    const { data: current } = await adminClient().from("products").select("image_url").eq("id", id).maybeSingle();
    previousImage = current?.image_url ?? null;
  }

  const { data, error } = await adminClient()
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return serverError(error.message);

  if (previousImage && previousImage !== data.image_url) await deleteImageByUrl(previousImage);
  return NextResponse.json({ product: data });
}

/** DELETE /api/admin/products/[id] — hapus produk */
export async function DELETE(_request: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const { data: current } = await adminClient().from("products").select("image_url").eq("id", id).maybeSingle();
  const { error } = await adminClient().from("products").delete().eq("id", id);
  if (error) return serverError(error.message);

  await deleteImageByUrl(current?.image_url);
  return NextResponse.json({ ok: true });
}
