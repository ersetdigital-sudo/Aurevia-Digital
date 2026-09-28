"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import {
  ORDER_STATUS,
  ORDER_STATUS_VALUES,
  formatDate,
  rupiah,
} from "@/components/admin/status";
import type { DbOrder } from "@/types";

type Props = { orders: DbOrder[] };

export function OrdersManager({ orders }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchStatus = status === "all" || order.status === status;
      const matchQuery =
        !q ||
        order.ref.toLowerCase().includes(q) ||
        order.target.toLowerCase().includes(q) ||
        order.product.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [orders, query, status]);

  async function updateOrder(id: string, patch: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        alert(data.error ?? "Gagal memperbarui pesanan.");
        return;
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  const total = filtered.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="space-y-5">
      <header>
        <p className="adm-eyebrow">Transaksi</p>
        <h1 className="adm-page-title">Kelola Pesanan</h1>
        <p className="adm-page-sub">
          Pesanan dari checkout situs masuk otomatis. Ubah status setelah pembayaran terverifikasi.
        </p>
      </header>

      <section className="adm-card adm-card-pad flex flex-wrap items-center gap-3">
        <input
          className="adm-input"
          style={{ maxWidth: 320 }}
          placeholder="Cari ref, nomor, atau produk…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="adm-select"
          style={{ width: "auto", minWidth: 190 }}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">Semua status</option>
          {ORDER_STATUS_VALUES.map((value) => (
            <option key={value} value={value}>
              {ORDER_STATUS[value].label}
            </option>
          ))}
        </select>
        <span className="adm-stat-hint" style={{ marginTop: 0 }}>
          {filtered.length} pesanan · total {rupiah(total)}
        </span>
      </section>

      <section className="adm-card">
        <div className="adm-card-head">
          <span className="adm-card-title">Daftar pesanan</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => router.refresh()}>
            <Icon name="chart" className="h-4 w-4" />
            Muat ulang
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="adm-empty">Tidak ada pesanan yang cocok.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Pelanggan</th>
                  <th>Produk</th>
                  <th className="text-right">Nominal</th>
                  <th>Status</th>
                  <th>Waktu</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const meta = ORDER_STATUS[order.status];
                  const isOpen = expanded === order.id;
                  return (
                    <tr key={order.id}>
                      <td>
                        <button
                          type="button"
                          className="adm-num"
                          style={{ color: "var(--clay)", textDecoration: "underline" }}
                          onClick={() => setExpanded(isOpen ? null : order.id)}
                        >
                          {order.ref}
                        </button>
                        {isOpen ? (
                          <div className="mt-2 whitespace-pre-wrap text-[12px] text-[color:var(--mute)]">
                            Kategori: {order.category || "—"}
                            {"\n"}Metode: {order.payment_method}
                            {order.note ? `\nCatatan: ${order.note}` : ""}
                          </div>
                        ) : null}
                      </td>
                      <td className="adm-num">{order.target}</td>
                      <td>{order.product}</td>
                      <td className="adm-num text-right">{rupiah(order.amount)}</td>
                      <td>
                        <span className={`badge ${meta.cls}`}>{meta.label}</span>
                      </td>
                      <td className="whitespace-nowrap text-[12.5px]">
                        {formatDate(order.created_at)}
                      </td>
                      <td>
                        <div className="flex justify-end gap-1.5">
                          <select
                            className="adm-select"
                            style={{ width: "auto", padding: "5px 8px", fontSize: 12.5 }}
                            value={order.status}
                            disabled={busyId === order.id}
                            onChange={(event) =>
                              void updateOrder(order.id, { status: event.target.value })
                            }
                          >
                            {ORDER_STATUS_VALUES.map((value) => (
                              <option key={value} value={value}>
                                {ORDER_STATUS[value].label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (confirm(`Hapus pesanan ${order.ref}?`)) {
                                void fetch(`/api/admin/orders/${order.id}`, { method: "DELETE" }).then(
                                  () => router.refresh()
                                );
                              }
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
