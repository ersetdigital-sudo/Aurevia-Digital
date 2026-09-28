import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { badRequest, guard, serverError, str } from "@/lib/adminApi";

const KEYS = ["qris", "site"] as const;

/** GET /api/admin/settings — semua pengaturan (admin) */
export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const { data, error } = await adminClient().from("settings").select("*");
  if (error) return serverError(error.message);

  const map: Record<string, unknown> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return NextResponse.json({ settings: map });
}

/** PUT /api/admin/settings — simpan satu slot pengaturan { key, value } */
export async function PUT(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as {
    key?: string;
    value?: Record<string, unknown>;
  };

  if (!body.key || !KEYS.includes(body.key as (typeof KEYS)[number])) {
    return badRequest("Key pengaturan tidak dikenal.");
  }
  if (!body.value || typeof body.value !== "object") {
    return badRequest("Value pengaturan tidak valid.");
  }

  const value: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(body.value)) {
    value[key] = typeof raw === "string" ? str(raw, "", 600) : raw;
  }

  const { data, error } = await adminClient()
    .from("settings")
    .upsert({ key: body.key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ settings: { [data.key]: data.value } });
}
