import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { badRequest, guard, num, serverError, str } from "@/lib/adminApi";

/** GET /api/admin/categories — semua kategori (termasuk non-aktif) */
export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const { data, error } = await adminClient()
    .from("categories")
    .select("*")
    .order("sort", { ascending: true });

  if (error) return serverError(error.message);
  return NextResponse.json({ categories: data ?? [] });
}

/** POST /api/admin/categories — buat kategori baru */
export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = str(body.name, "", 80);
  const slug = str(body.slug, "", 80).toLowerCase().replace(/[^a-z0-9-]/g, "-");
  if (!name) return badRequest("Nama kategori wajib diisi.");
  if (!slug) return badRequest("Slug kategori wajib diisi.");

  const { data, error } = await adminClient()
    .from("categories")
    .insert({
      name,
      slug,
      icon: str(body.icon, "card", 40),
      tile_class: str(body.tile_class, "bg-[#EFF6FF] text-[#2563EB]", 120),
      description: str(body.description, "", 240),
      nominal_title: str(body.nominal_title, "Pilih Layanan", 120),
      field_label: str(body.field_label, "Nomor Tujuan", 80),
      field_placeholder: str(body.field_placeholder, "", 80),
      field_hint: str(body.field_hint, "", 240),
      admin_fee: num(body.admin_fee, 0),
      sort: num(body.sort, 0),
      active: body.active !== false,
    })
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ category: data }, { status: 201 });
}
