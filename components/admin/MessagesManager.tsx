"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { MESSAGE_STATUS, formatDate } from "@/components/admin/status";
import type { DbMessage, MessageStatus } from "@/types";

type Props = { messages: DbMessage[] };

const VALUES: MessageStatus[] = ["new", "read", "replied"];

export function MessagesManager({ messages }: Props) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const detail = messages.find((message) => message.id === detailId) ?? null;

  // Escape menutup modal detail pesan.
  useEffect(() => {
    if (!detail) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDetailId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

  async function setStatus(id: string, status: MessageStatus) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDetailId(null);
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  function openDetail(message: DbMessage) {
    setDetailId(message.id);
    // Pesan baru otomatis ditandai dibaca begitu detailnya dibuka.
    if (message.status === "new") void setStatus(message.id, "read");
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="adm-eyebrow">Komunikasi</p>
        <h1 className="adm-page-title">Kontak Masuk</h1>
        <p className="adm-page-sub">
          Pesan dari form kontak situs publik. Buka detail untuk membaca isi lengkap, lalu tandai
          sudah dibaca atau sudah dibalas agar tidak ada yang terlewat.
        </p>
      </header>

      <section className="adm-card">
        <div className="adm-card-head">
          <span className="adm-card-title">{messages.length} pesan</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => router.refresh()}>
            <Icon name="chart" className="h-4 w-4" />
            Muat ulang
          </button>
        </div>

        {messages.length === 0 ? (
          <p className="adm-empty">Belum ada pesan masuk.</p>
        ) : (
          <>
            {/* ---------- Tabel (desktop) ---------- */}
            <div className="adm-table-wrap hidden md:block">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Pengirim</th>
                    <th>Subjek &amp; Pesan</th>
                    <th>Waktu</th>
                    <th>Status</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => {
                    const meta = MESSAGE_STATUS[message.status];
                    return (
                      <tr key={message.id}>
                        <td className="align-top whitespace-nowrap">
                          <span className="block font-bold text-[color:var(--ink)]">
                            {message.name}
                          </span>
                          <span className="block text-[12px] text-[color:var(--mute)]">
                            {message.contact}
                          </span>
                        </td>
                        <td className="max-w-[380px]">
                          <span className="block font-bold">{message.subject}</span>
                          <span className="mt-0.5 block truncate text-[12.5px] text-[color:var(--mute)]">
                            {message.body.replace(/\s+/g, " ").trim()}
                          </span>
                        </td>
                        <td className="align-top text-[12.5px] whitespace-nowrap">
                          {formatDate(message.created_at)}
                        </td>
                        <td className="align-top">
                          <span className={`badge ${meta.cls}`}>{meta.label}</span>
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => openDetail(message)}
                          >
                            <Icon name="chat" className="h-4 w-4" />
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ---------- Kartu (mobile) ---------- */}
            <ul className="md:hidden">
              {messages.map((message) => {
                const meta = MESSAGE_STATUS[message.status];
                return (
                  <li
                    key={message.id}
                    className="px-4 py-4"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-bold">{message.name}</span>
                      <span className={`badge ${meta.cls}`}>{meta.label}</span>
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-[color:var(--mute)]">
                      {message.contact} · {formatDate(message.created_at)}
                    </p>
                    <p className="mt-2 text-[13.5px] font-semibold">{message.subject}</p>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[color:var(--body)]">
                      {message.body}
                    </p>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm mt-3 w-full"
                      onClick={() => openDetail(message)}
                    >
                      <Icon name="chat" className="h-4 w-4" />
                      Lihat Detail
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {/* ---------- Modal detail pesan ---------- */}
      {detail ? (
        <div
          className="adm-modal-wrap"
          role="dialog"
          aria-modal="true"
          aria-labelledby="adm-message-detail-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setDetailId(null);
          }}
        >
          <div className="adm-modal">
            <div className="adm-card-head">
              <span className="adm-card-title" id="adm-message-detail-title">
                Detail Pesan
              </span>
              <button
                type="button"
                className="btn btn-quiet btn-sm"
                aria-label="Tutup detail pesan"
                onClick={() => setDetailId(null)}
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 p-4 sm:p-5">
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="adm-label">Pengirim</dt>
                  <dd className="text-[14px] font-bold">{detail.name}</dd>
                </div>
                <div>
                  <dt className="adm-label">Kontak</dt>
                  <dd className="text-[13.5px] break-words">{detail.contact || "—"}</dd>
                </div>
                <div>
                  <dt className="adm-label">Dikirim</dt>
                  <dd className="text-[13.5px]">{formatDate(detail.created_at)}</dd>
                </div>
                <div>
                  <dt className="adm-label">Status</dt>
                  <dd>
                    <span className={`badge ${MESSAGE_STATUS[detail.status].cls}`}>
                      {MESSAGE_STATUS[detail.status].label}
                    </span>
                  </dd>
                </div>
              </dl>

              <div>
                <p className="adm-label">Subjek</p>
                <p className="text-[15px] font-bold break-words">{detail.subject}</p>
              </div>

              <div>
                <p className="adm-label">Isi pesan</p>
                <div
                  className="whitespace-pre-wrap text-[13.5px] leading-relaxed"
                  style={{
                    background: "var(--inset)",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    color: "var(--body)",
                  }}
                >
                  {detail.body}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t pt-4" style={{ borderColor: "var(--line)" }}>
                <span className="mr-auto text-[12px] font-bold text-[color:var(--mute)]">
                  Ubah status:
                </span>
                {VALUES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`btn btn-sm ${detail.status === value ? "btn-primary" : "btn-ghost"}`}
                    disabled={busyId === detail.id || detail.status === value}
                    onClick={() => void setStatus(detail.id, value)}
                  >
                    {MESSAGE_STATUS[value].label}
                  </button>
                ))}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={busyId === detail.id}
                  onClick={() => {
                    if (confirm(`Hapus pesan dari ${detail.name}?`)) void remove(detail.id);
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
