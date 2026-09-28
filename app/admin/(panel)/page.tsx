import Link from "next/link";
import { Icon } from "@/components/Icon";
import { MESSAGE_STATUS, ORDER_STATUS, formatDate, rupiah } from "@/components/admin/status";
import { adminClient } from "@/lib/supabase";
import type { DbMessage, DbOrder } from "@/types";

export const metadata = { title: "Ringkasan" };

export default async function AdminDashboard() {
  const sb = adminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [orderCount, pendingCount, todayCount, newMessageCount, productCount, ordersRes, messagesRes] =
    await Promise.all([
      sb.from("orders").select("*", { count: "exact", head: true }),
      sb.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      sb.from("orders").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
      sb.from("messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      sb.from("products").select("*", { count: "exact", head: true }).eq("active", true),
      sb.from("orders").select("*").order("created_at", { ascending: false }).limit(8),
      sb.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
    ]);

  const orders = (ordersRes.data ?? []) as DbOrder[];
  const messages = (messagesRes.data ?? []) as DbMessage[];

  const stats = [
    { label: "Pesanan masuk", value: orderCount.count ?? 0, hint: "semua waktu" },
    { label: "Menunggu bayar", value: pendingCount.count ?? 0, hint: "perlu dipantau" },
    { label: "Pesanan hari ini", value: todayCount.count ?? 0, hint: "sejak 00.00" },
    { label: "Pesan baru", value: newMessageCount.count ?? 0, hint: "belum dibaca" },
    { label: "Produk aktif", value: productCount.count ?? 0, hint: "tampil di situs" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="adm-eyebrow">Dashboard</p>
        <h1 className="adm-page-title">Ringkasan operasional</h1>
        <p className="adm-page-sub">
          Gambaran pesanan, pesan masuk, dan katalog produk Aurevia Digital hari ini.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="adm-stat">
            <p className="adm-stat-label">{stat.label}</p>
            <p className="adm-stat-value">{stat.value}</p>
            <p className="adm-stat-hint">{stat.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="adm-card">
          <div className="adm-card-head">
            <span className="adm-card-title">Pesanan terbaru</span>
            <Link href="/admin/pesanan" className="btn btn-ghost btn-sm">
              Lihat semua
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="adm-empty">Belum ada pesanan masuk.</p>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Produk</th>
                    <th className="text-right">Nominal</th>
                    <th>Status</th>
                    <th>Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const meta = ORDER_STATUS[order.status];
                    return (
                      <tr key={order.id}>
                        <td className="adm-num">{order.ref}</td>
                        <td>
                          <span className="font-semibold text-[color:var(--ink)]">{order.product}</span>
                          <span className="block text-[12px] text-[color:var(--mute)]">
                            {order.target}
                          </span>
                        </td>
                        <td className="adm-num text-right">{rupiah(order.amount)}</td>
                        <td>
                          <span className={`badge ${meta.cls}`}>{meta.label}</span>
                        </td>
                        <td className="whitespace-nowrap text-[12.5px]">
                          {formatDate(order.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <span className="adm-card-title">Pesan terbaru</span>
            <Link href="/admin/kontak" className="btn btn-ghost btn-sm">
              Kelola
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          {messages.length === 0 ? (
            <p className="adm-empty">Belum ada pesan masuk.</p>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
              {messages.map((message) => {
                const meta = MESSAGE_STATUS[message.status];
                return (
                  <li key={message.id} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13.5px] font-bold">{message.name}</span>
                      <span className={`badge ${meta.cls}`}>{meta.label}</span>
                    </div>
                    <p className="text-[13px] text-[color:var(--body)]">{message.subject}</p>
                    <p className="text-[11.5px] text-[color:var(--mute)]">
                      {formatDate(message.created_at)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/admin/produk" className="adm-card adm-card-pad adm-link">
          <Icon name="tag" className="h-[18px] w-[18px]" />
          Kelola produk & kategori
        </Link>
        <Link href="/admin/pengaturan" className="adm-card adm-card-pad adm-link">
          <Icon name="qr" className="h-[18px] w-[18px]" />
          Foto QRIS & pengaturan
        </Link>
        <Link href="/" className="adm-card adm-card-pad adm-link">
          <Icon name="arrow" className="h-[18px] w-[18px]" />
          Lihat situs publik
        </Link>
      </section>
    </div>
  );
}
