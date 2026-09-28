import { OrdersManager } from "@/components/admin/OrdersManager";
import { adminClient } from "@/lib/supabase";
import type { DbOrder } from "@/types";

export const metadata = { title: "Pesanan" };

export default async function AdminOrdersPage() {
  const { data, error } = await adminClient()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return (
      <div className="adm-card adm-card-pad" style={{ color: "var(--bad)" }}>
        Gagal memuat pesanan: {error.message}
      </div>
    );
  }

  return <OrdersManager orders={(data ?? []) as DbOrder[]} />;
}
