import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

/** Guard: kembalikan respons 401 bila bukan sesi admin, null bila lolos. */
export async function guard(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = "Gagal memproses permintaan."): NextResponse {
  return NextResponse.json({ error: message }, { status: 500 });
}

/** Ambil string dari body JSON (trim), dengan default. */
export function str(value: unknown, fallback = "", max = 2000): string {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, max) || fallback;
}

/** Ambil angka bulat dari body JSON (untuk harga, urutan, dll). */
export function num(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.round(parsed));
}

export function bool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}
