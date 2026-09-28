/**
 * Isi katalog awal (tabel categories + products) dari data statis project.
 *
 *   node --import ./scripts/ts-paths.mjs scripts/seed-catalog.ts           # pratinjau (dry run)
 *   node --import ./scripts/ts-paths.mjs scripts/seed-catalog.ts --apply   # tulis ke Supabase
 *   ... --apply --reset                                                     # hapus dulu katalog lama
 *
 * Pakai SUPABASE_SERVICE_ROLE_KEY dari .env.local (bypass RLS) — jalankan
 * dari folder Aurevia-Digital.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { services } from "@/data/content";
import { checkoutCategories } from "@/data/checkout";

const apply = process.argv.includes("--apply");
const reset = process.argv.includes("--reset");

function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum ada di .env.local.");
  process.exit(1);
}

type CategoryRow = Record<string, unknown> & { slug: string };
type ProductRow = Record<string, unknown> & { slug: string };

const categories: CategoryRow[] = [];
const products: ProductRow[] = [];

checkoutCategories.forEach((checkout, index) => {
  const service = services.find((entry) => entry.id === checkout.id);

  categories.push({
    name: service?.title ?? checkout.id,
    slug: checkout.id,
    icon: service?.icon ?? "card",
    tile_class: service?.tileClassName ?? "bg-[#EFF6FF] text-[#2563EB]",
    description: service?.description ?? "",
    nominal_title: checkout.nominalTitle,
    field_label: checkout.field.label,
    field_placeholder: checkout.field.placeholder,
    field_hint: checkout.field.hint,
    admin_fee: checkout.admin,
    sort: index,
    active: true,
  });

  checkout.groups.forEach((group) => {
    group.items.forEach((item, itemIndex) => {
      products.push({
        slug: checkout.id,
        name: item.label,
        detail: item.detail,
        price: item.price,
        variable: Boolean(item.variable),
        group_name: group.name,
        image_url: null,
        sort: itemIndex,
        active: true,
      });
    });
  });
});

console.log(
  `Katalog: ${categories.length} kategori, ${products.length} produk` +
    (reset ? " (mode reset: katalog lama akan dihapus)" : ""),
);

if (!apply) {
  console.log("\nDry run — belum ada yang ditulis. Tambahkan --apply untuk menyimpan.\n");
  for (const category of categories) {
    const count = products.filter((product) => product.slug === category.slug).length;
    console.log(`- ${category.slug} (${category.name}): ${count} produk`);
  }
  process.exit(0);
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { count } = await sb.from("categories").select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0 && !reset) {
    console.error(
      `Tabel categories sudah berisi ${count} baris. Pakai --reset kalau memang mau menimpanya.`,
    );
    process.exit(1);
  }

  if (reset) {
    const { error } = await sb.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      console.error("Gagal mengosongkan katalog:", error.message);
      process.exit(1);
    }
    console.log("Katalog lama dihapus (produk ikut terhapus lewat on delete cascade).");
  }

  const { data: inserted, error: categoryError } = await sb
    .from("categories")
    .insert(categories)
    .select("id, slug");

  if (categoryError || !inserted) {
    console.error("Gagal menyimpan kategori:", categoryError?.message ?? "tidak ada data");
    process.exit(1);
  }

  const idBySlug = new Map(inserted.map((row) => [row.slug as string, row.id as string]));
  const rows = products.map(({ slug, ...rest }) => ({
    ...rest,
    category_id: idBySlug.get(slug),
  }));

  const { error: productError } = await sb.from("products").insert(rows);
  if (productError) {
    console.error("Gagal menyimpan produk:", productError.message);
    process.exit(1);
  }

  console.log(`Selesai: ${inserted.length} kategori dan ${rows.length} produk tersimpan.`);
}

void main();
