"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { MESSAGE_STATUS, formatDate } from "@/components/admin/status";
import type { DbMessage, MessageStatus } from "@/types";

type Props = { messages: DbMessage[] };

const VALUES: MessageStatus[] = ["new", "read", "replied"];

export function MessagesManager({ messages }: Props) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

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
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="adm-eyebrow">Komunikasi</p>
        <h1 className="adm-page-title">Kontak Masuk</h1>
        <p className="adm-page-sub">
          Pesan dari form kontak situs publik. Tandai sudah dibaca atau sudah dibalas agar
          tidak ada yang terlewat.
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
          <ul>
            {messages.map((message) => {
              const meta = MESSAGE_STATUS[message.status];
              return (
                <li
                  key={message.id}
                  className="px-4 py-4"
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-bold">{message.name}</span>
                        <span className={`badge ${meta.cls}`}>{meta.label}</span>
                      </div>
                      <p className="text-[13px] text-[color:var(--mute)]">
                        {message.contact} · {formatDate(message.created_at)}
                      </p>
                      <p className="mt-1 text-[13.5px] font-semibold">{message.subject}</p>
                      <p className="mt-1 max-w-[80ch] whitespace-pre-wrap text-[13.5px] leading-relaxed text-[color:var(--body)]">
                        {message.body}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {VALUES.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`btn btn-sm ${message.status === value ? "btn-primary" : "btn-ghost"}`}
                          disabled={busyId === message.id || message.status === value}
                          onClick={() => void setStatus(message.id, value)}
                        >
                          {MESSAGE_STATUS[value].label}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        disabled={busyId === message.id}
                        onClick={() => {
                          if (confirm(`Hapus pesan dari ${message.name}?`)) void remove(message.id);
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
