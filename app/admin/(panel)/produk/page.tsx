import { ProductsManager } from "@/components/admin/ProductsManager";
import { adminClient } from "@/lib/supabase";
import type { DbCategory, DbProduct } from "@/types";

export const metadata = { title: "Produk & Kategori" };

export default async function AdminProductsPage() {
  const sb = adminClient();

  const [categoriesRes, productsRes] = await Promise.all([
    sb.from("categories").select("*").order("sort", { ascending: true }),
    sb.from("products").select("*").order("sort", { ascending: true }).order("created_at", { ascending: true }),
  ]);

  const categories = (categoriesRes.data ?? []) as DbCategory[];
  const products = (productsRes.data ?? []) as DbProduct[];

  return <ProductsManager categories={categories} products={products} />;
}
