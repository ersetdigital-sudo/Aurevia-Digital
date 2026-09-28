import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

type Cache = { anon?: SupabaseClient; admin?: SupabaseClient };
const cache: Cache = (globalThis as unknown as { __sb?: Cache }).__sb ?? {};
(globalThis as unknown as { __sb?: Cache }).__sb = cache;

/** Client publik (anon key) — untuk baca kategori/produk/pengaturan. */
export function anonClient(): SupabaseClient {
  if (!cache.anon) {
    cache.anon = createClient(URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cache.anon;
}

/** Client admin (service role) — HANYA dipakai di route server / API admin. */
export function adminClient(): SupabaseClient {
  if (!cache.admin) {
    cache.admin = createClient(URL, SERVICE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cache.admin;
}

export const supabaseConfigured = Boolean(URL && ANON && SERVICE);
