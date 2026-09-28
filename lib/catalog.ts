import { anonClient } from "@/lib/supabase";
import { services as staticServices } from "@/data/content";
import { checkoutCategories as staticCheckout } from "@/data/checkout";
import type {
  CheckoutCategory,
  CheckoutGroup,
  DbCategory,
  DbProduct,
  QrisSettings,
  Service,
} from "@/types";

export type Catalog = {
  categories: DbCategory[];
  products: DbProduct[];
  fromDatabase: boolean;
};

/**
 * Ambil kategori + produk dari Supabase (client anon, RLS hanya boleh baca
 * yang aktif). Kalau database kosong / gagal, pakai data statis supaya situs
 * tetap tampil.
 */
export async function getCatalog(): Promise<Catalog> {
  try {
    const client = anonClient();
    const [categoriesRes, productsRes] = await Promise.all([
      client.from("categories").select("*").order("sort", { ascending: true }),
      client
        .from("products")
        .select("*")
        .order("sort", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    const categories = (categoriesRes.data ?? []) as DbCategory[];
    const products = (productsRes.data ?? []) as DbProduct[];

    if (categoriesRes.error || productsRes.error || categories.length === 0) {
      return { categories: [], products: [], fromDatabase: false };
    }
    return { categories, products, fromDatabase: true };
  } catch {
    return { categories: [], products: [], fromDatabase: false };
  }
}

/** Kategori+produk DB -> bentuk Service untuk daftar layanan di landing. */
export function toServices(catalog: Catalog): Service[] {
  if (!catalog.fromDatabase) return staticServices;

  return catalog.categories
    .filter((category) => category.active)
    .map((category) => {
      const items = catalog.products
        .filter((product) => product.category_id === category.id && product.active)
        .slice(0, 4)
        .map((product) => product.name);

      return {
        id: category.slug,
        title: category.name,
        description: category.description,
        icon: category.icon as Service["icon"],
        tileClassName: category.tile_class,
        items: items.length > 0 ? items : [category.description || category.name],
      };
    });
}

/** Kategori+produk DB -> bentuk CheckoutCategory untuk drawer checkout. */
export function toCheckoutCategories(catalog: Catalog): CheckoutCategory[] {
  if (!catalog.fromDatabase) return staticCheckout;

  return catalog.categories
    .filter((category) => category.active)
    .map((category) => {
      const rows = catalog.products.filter(
        (product) => product.category_id === category.id && product.active
      );

      const groups: CheckoutGroup[] = [];
      for (const row of rows) {
        const groupName = row.group_name || "Pilihan";
        let group = groups.find((entry) => entry.name === groupName);
        if (!group) {
          group = { name: groupName, items: [] };
          groups.push(group);
        }
        group.items.push({
          label: row.name,
          detail: row.detail,
          price: row.price,
          variable: row.variable,
        });
      }

      return {
        id: category.slug,
        nominalTitle: category.nominal_title,
        field: {
          label: category.field_label,
          placeholder: category.field_placeholder,
          hint: category.field_hint,
        },
        admin: category.admin_fee,
        groups,
      } satisfies CheckoutCategory;
    });
}

export type Qris = QrisSettings;

/** Pengaturan QRIS dari database (fallback: null -> pakai QR contoh). */
export async function getQris(): Promise<Qris | null> {
  try {
    const { data } = await anonClient()
      .from("settings")
      .select("value")
      .eq("key", "qris")
      .maybeSingle();
    return (data?.value as Qris | undefined) ?? null;
  } catch {
    return null;
  }
}
