/**
 * Isi pesanan demo (tabel orders) supaya dashboard admin ada isinya.
 *
 *   node --import ./scripts/ts-paths.mjs scripts/seed-orders.ts           # pratinjau
 *   node --import ./scripts/ts-paths.mjs scripts/seed-orders.ts --apply   # tulis
 *   ... --apply --reset                  # hapus pesanan demo yang lama dulu
 *   ... --apply --reset-only             # cuma hapus pesanan demo
 *
 * Semua baris ditandai `note = "Data demo"` sehingga bisa dihapus kembali
 * tanpa menyentuh pesanan asli.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const NOTE_TAG = "Data demo";

const apply = process.argv.includes("--apply");
const reset = process.argv.includes("--reset");
const resetOnly = process.argv.includes("--reset-only");

function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

type DemoOrder = {
  ref: string;
  category: string;
  product: string;
  target: string;
  amount: number;
  status: "pending" | "paid" | "processing" | "success" | "failed" | "refunded";
  method: string;
  daysAgo: number;
  hour: number;
};

// Sebaran status sengaja dibuat variatif supaya semua filter & badge terlihat.
const DEMO_ORDERS: DemoOrder[] = [
  { ref: "AD-DEMO01", category: "pulsa", product: "Pulsa 10.000", target: "081234567890", amount: 10500, status: "success", method: "QRIS", daysAgo: 0, hour: 8 },
  { ref: "AD-DEMO02", category: "pln", product: "Token 50.000", target: "14123456789", amount: 55000, status: "pending", method: "QRIS", daysAgo: 0, hour: 10 },
  { ref: "AD-DEMO03", category: "paket-data", product: "10 GB / 30 Hari", target: "085712345678", amount: 65000, status: "processing", method: "QRIS", daysAgo: 0, hour: 12 },
  { ref: "AD-DEMO04", category: "e-wallet", product: "Top Up GoPay 50.000", target: "081298765432", amount: 51000, status: "success", method: "QRIS", daysAgo: 1, hour: 9 },
  { ref: "AD-DEMO05", category: "bpjs", product: "BPJS Kesehatan — Kelas 2", target: "0001884277361", amount: 100000, status: "success", method: "QRIS", daysAgo: 1, hour: 14 },
  { ref: "AD-DEMO06", category: "pulsa", product: "Pulsa 25.000", target: "089612345678", amount: 25500, status: "failed", method: "QRIS", daysAgo: 2, hour: 11 },
  { ref: "AD-DEMO07", category: "pdam", product: "Tagihan Air — September", target: "1200345678", amount: 87500, status: "pending", method: "QRIS", daysAgo: 2, hour: 16 },
  { ref: "AD-DEMO08", category: "internet", product: "IndiHome — 30 Mbps", target: "121234567890", amount: 345000, status: "paid", method: "QRIS", daysAgo: 3, hour: 10 },
  { ref: "AD-DEMO09", category: "pln", product: "Token 100.000", target: "14123456780", amount: 105000, status: "success", method: "QRIS", daysAgo: 4, hour: 13 },
  { ref: "AD-DEMO10", category: "multifinance", product: "FIF Group — Angsuran", target: "001234567890", amount: 853500, status: "success", method: "QRIS", daysAgo: 5, hour: 15 },
  { ref: "AD-DEMO11", category: "paket-data", product: "5 GB / 30 Hari", target: "087812345678", amount: 40000, status: "refunded", method: "QRIS", daysAgo: 7, hour: 9 },
  { ref: "AD-DEMO12", category: "pulsa", product: "Pulsa 50.000", target: "082112345678", amount: 50500, status: "success", method: "QRIS", daysAgo: 9, hour: 17 },
];

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum ada di .env.local.");
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Tanggal pesanan demo: `daysAgo` hari lalu pada jam `hour` menit ke-15. */
function createdAtOf(order: DemoOrder): string {
  const date = new Date();
  date.setDate(date.getDate() - order.daysAgo);
  date.setHours(order.hour, 15, 0, 0);
  return date.toISOString();
}

async function main() {
  if (reset || resetOnly) {
    if (!apply) {
      console.log("Dry run: pesanan demo lama akan dihapus (note = 'Data demo').");
    } else {
      const { error, count } = await sb
        .from("orders")
        .delete({ count: "exact" })
        .eq("note", NOTE_TAG);
      if (error) {
        console.error("Gagal menghapus pesanan demo:", error.message);
        process.exit(1);
      }
      console.log(`Pesanan demo lama dihapus: ${count ?? 0} baris.`);
    }
    if (resetOnly) return;
  }

  const { data: categories, error: categoryError } = await sb.from("categories").select("id, slug");
  if (categoryError) {
    console.error("Gagal membaca kategori:", categoryError.message);
    process.exit(1);
  }
  const idBySlug = new Map((categories ?? []).map((row) => [row.slug as string, row.id as string]));

  const rows = DEMO_ORDERS.map((order, index) => ({
    ref: order.ref,
    category: order.category,
    category_id: idBySlug.get(order.category) ?? null,
    product: order.product,
    target: order.target,
    amount: order.amount,
    status: order.status,
    payment_method: order.method,
    invoice_no: `INV-DEMO-${String(index + 1).padStart(2, "0")}`,
    note: NOTE_TAG,
    created_at: createdAtOf(order),
  }));

  if (!apply) {
    console.log(`Dry run — ${rows.length} pesanan demo siap dimasukkan:\n`);
    for (const row of rows) {
      console.log(
        `- ${row.ref} · ${row.category} · ${row.product} · ${row.status} · ${row.created_at.slice(0, 10)}`,
      );
    }
    console.log("\nTambahkan --apply untuk menyimpan.");
    return;
  }

  const { count } = await sb
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("note", NOTE_TAG);
  if ((count ?? 0) > 0) {
    console.error(`Sudah ada ${count} pesanan demo. Pakai --reset kalau mau menimpanya.`);
    process.exit(1);
  }

  const { error } = await sb.from("orders").insert(rows);
  if (error) {
    console.error("Gagal menyimpan pesanan demo:", error.message);
    process.exit(1);
  }
  console.log(`Selesai: ${rows.length} pesanan demo tersimpan.`);
}

void main();
