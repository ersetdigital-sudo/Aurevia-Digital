import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { badRequest, serverError, str } from "@/lib/adminApi";

/**
 * POST /api/messages — form kontak di situs publik.
 * Tidak ada kebijakan RLS insert, jadi ditulis lewat service role di server.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const name = str(body.name, "", 80);
  const contact = str(body.contact, "", 120);
  const subject = str(body.subject, "", 120);
  const message = str(body.message, "", 2000);

  if (!name) return badRequest("Nama wajib diisi.");
  if (!contact) return badRequest("Email/WhatsApp wajib diisi.");
  if (message.length < 10) return badRequest("Pesan terlalu pendek (min. 10 karakter).");

  const { error } = await adminClient()
    .from("messages")
    .insert({ name, contact, subject: subject || "Pesan dari situs", body: message });

  if (error) return serverError(error.message);
  return NextResponse.json({ ok: true }, { status: 201 });
}
