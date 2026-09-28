import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admn_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 jam

function password(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function toBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value) as unknown as Uint8Array;
}

function bufferOf(value: string): BufferSource {
  return toBytes(value) as unknown as BufferSource;
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    bufferOf(password()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, bufferOf(payload));
  return Buffer.from(digest).toString("base64url");
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const expected = password();
  if (!expected) return false;
  const a = toBytes(candidate);
  const b = toBytes(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Buat nilai cookie sesi: `admin-<exp>.<signature>` */
export async function createSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin-${exp}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !password()) return false;
  const expected = await hmac(payload);
  if (signature.length !== expected.length) return false;
  let diff = 0;
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  if (diff !== 0) return false;
  const exp = Number(payload.replace("admin-", ""));
  return Number.isFinite(exp) && exp * 1000 > Date.now();
}

/** Cek sesi admin dari cookie request berjalan. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}
