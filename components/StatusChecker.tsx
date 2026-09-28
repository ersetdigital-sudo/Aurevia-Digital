"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  demoTransactions,
  stateLabels,
  transactionSteps,
  type DemoTransaction,
  type TransactionState,
} from "@/data/status";
import { findInvoice, type SavedInvoice } from "@/lib/checkout";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/types";

type Phase = "idle" | "loading" | "found" | "notfound";

const tone: Record<TransactionState, { badge: string; dot: string }> = {
  success: { badge: "bg-ok-soft text-ok-ink", dot: "bg-ok-ink" },
  processing: { badge: "bg-info-soft text-info-ink", dot: "bg-info-ink" },
  pending: { badge: "bg-warn-soft text-warn-ink", dot: "bg-warn-ink" },
  failed: { badge: "bg-bad-soft text-bad-ink", dot: "bg-bad-ink" },
};

const idMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatStamp(timestamp: number): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "-";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getDate()} ${idMonths[date.getMonth()]} ${date.getFullYear()}, ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

const helpSteps = [
  { title: "Struk digital", text: "Muncul otomatis setelah pembayaran, berformat AD-XXXXXX." },
  { title: "Email konfirmasi", text: "Dikirim ke email terdaftar dalam 1 menit." },
  { title: "Menu riwayat", text: "Buka riwayat transaksi, tap detail untuk menyalin referensi." },
];

type ApiOrder = {
  ref: string;
  category: string;
  product: string;
  target: string;
  amount: number;
  status: OrderStatus;
  payment_method: string;
  created_at: string;
  updated_at: string;
};

const metaByStatus: Record<
  OrderStatus,
  { state: TransactionState; stepIndex: number; note: string }
> = {
  pending: {
    state: "pending",
    stepIndex: 1,
    note: "Pesanan sudah dibuat. Selesaikan pembayaran QRIS agar transaksi bisa diproses.",
  },
  paid: {
    state: "processing",
    stepIndex: 2,
    note: "Pembayaran diterima. Transaksi sedang diteruskan ke penyedia.",
  },
  processing: {
    state: "processing",
    stepIndex: 2,
    note: "Dana sudah diterima dan diteruskan ke penyedia. Produk muncul maksimal 5 menit lagi.",
  },
  success: {
    state: "success",
    stepIndex: 3,
    note: "Transaksi selesai dan produk sudah dikirim ke nomor tujuan.",
  },
  failed: {
    state: "failed",
    stepIndex: 2,
    note: "Transaksi gagal diteruskan ke penyedia. Dana dikembalikan maksimal 1×24 jam.",
  },
  refunded: {
    state: "failed",
    stepIndex: 3,
    note: "Transaksi dibatalkan dan dana sudah dikembalikan ke metode pembayaran.",
  },
};

function orderToTransaction(order: ApiOrder): DemoTransaction {
  const meta = metaByStatus[order.status] ?? metaByStatus.processing;
  return {
    ref: order.ref,
    state: meta.state,
    service: `${order.category} · ${order.product}`,
    target: order.target,
    amount: formatRupiah(order.amount),
    method: order.payment_method || "QRIS",
    createdAt: formatStamp(Date.parse(order.created_at)),
    updatedAt: formatStamp(Date.parse(order.updated_at)),
    stepIndex: meta.stepIndex,
    note: meta.note,
  };
}

/** Ambil pesanan asli dari database lebih dulu, baru jatuh ke contoh/lokal. */
async function fetchOrder(ref: string): Promise<DemoTransaction | null> {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(ref)}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { order?: ApiOrder };
    return data.order ? orderToTransaction(data.order) : null;
  } catch {
    return null;
  }
}

function invoiceToTransaction(invoice: SavedInvoice): DemoTransaction {
  const stamp = formatStamp(invoice.createdAt);
  return {
    ref: invoice.ref,
    state: "processing",
    service: `${invoice.service} · ${invoice.product}`,
    target: invoice.target,
    amount: formatRupiah(invoice.amount),
    method: "QRIS",
    createdAt: stamp,
    updatedAt: stamp,
    stepIndex: 2,
    note: "Pembayaran QRIS diterima. Transaksi menunggu konfirmasi admin sebelum diteruskan ke penyedia.",
  };
}

export function StatusChecker() {
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<DemoTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const requestRef = useRef(0);

  async function lookup(rawRef: string) {
    const code = rawRef.trim().toUpperCase();

    if (!code) {
      setError("Masukkan nomor referensi transaksi terlebih dahulu.");
      setPhase("idle");
      return;
    }
    if (!/^AD-[A-Z0-9]{6}$/.test(code)) {
      setError("Format referensi: AD- diikuti 6 karakter, contoh AD-8F4K2Q.");
      setPhase("idle");
      return;
    }

    setError(null);
    setCopied(false);
    setResult(null);
    setPhase("loading");

    // Abaikan hasil yang datang telat kalau user sudah memicu pencarian baru.
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    const localInvoice = findInvoice(code);
    const found =
      (await fetchOrder(code)) ??
      demoTransactions.find((item) => item.ref === code) ??
      (localInvoice ? invoiceToTransaction(localInvoice) : null);

    if (requestRef.current !== requestId) return;

    setResult(found);
    setPhase(found ? "found" : "notfound");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup(value);
  }

  async function copyRef(ref: string) {
    try {
      await navigator.clipboard.writeText(ref);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("");
    setResult(null);
    setError(null);
    setCopied(false);
    setPhase("idle");
  }

  return (
    <section id="beranda" className="relative overflow-hidden border-b border-line bg-surface-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)" }}
      />

      <div className="wrap relative pt-9 pb-9 sm:pt-12 sm:pb-11 lg:pt-14 lg:pb-14">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-[11.5px] font-bold text-muted">
            <span className="status-pulse h-1.5 w-1.5 rounded-full bg-ok-ink" aria-hidden="true" />
            Terhubung ke database pesanan
          </span>
          <span className="readout text-[10.5px] tracking-[0.16em] text-faint uppercase">
            Lacak transaksi
          </span>
        </div>

        <h1 className="font-display mt-4 text-[clamp(1.95rem,7vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
          Cek Status Transaksi
        </h1>
        <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-body sm:text-[15px]">
          Masukkan nomor referensi dari struk digital atau email konfirmasi untuk melihat tahapan
          transaksi secara real-time.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 sm:mt-7">
          <div className="card flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:rounded-full sm:pl-4">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 px-2 sm:px-0">
              <Icon name="doc" className="h-[18px] w-[18px] shrink-0 text-faint" />
              <label htmlFor="reference" className="sr-only">
                Nomor referensi transaksi
              </label>
              <input
                id="reference"
                name="reference"
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                value={value}
                onChange={(event) => {
                  setValue(event.target.value.toUpperCase());
                  if (error) setError(null);
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "reference-feedback" : undefined}
                placeholder="AD-XXXXXX — contoh: AD-8F4K2Q, AD-2X9M4T, AD-5R1W7B, AD-6C3J9D"
                className="readout min-w-0 flex-1 bg-transparent py-3 text-base font-semibold tracking-[0.04em] outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-hint sm:py-2.5"
              />
              {value ? (
                <button
                  type="button"
                  aria-label="Kosongkan nomor referensi"
                  onClick={() => {
                    setValue("");
                    setError(null);
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface-3 hover:text-ink"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={phase === "loading"}
              className="cta flex min-h-[48px] w-full items-center justify-center gap-2 px-6 text-[14.5px] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            >
              {phase === "loading" ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  />
                  Menelusuri…
                </>
              ) : (
                <>
                  Cek Status
                  <Icon name="arrow" className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <p
            id="reference-feedback"
            role={error ? "alert" : undefined}
            className={cn(
              "mt-2.5 min-h-[18px] px-1 text-[12.5px]",
              error ? "font-semibold text-bad-ink" : "text-muted",
            )}
          >
            {error}
          </p>
        </form>

        <div className="mt-5" aria-live="polite" aria-busy={phase === "loading"}>
          <AnimatePresence mode="wait">
            {phase === "idle" && !error ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="card p-5 sm:p-6"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-[15px] font-extrabold text-brand-ink">
                    1
                  </span>
                  <p className="text-[14.5px] font-extrabold">Di mana menemukan nomor referensi?</p>
                </div>

                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                  {helpSteps.map((item, index) => (
                    <li key={item.title} className="rounded-2xl border border-line bg-surface-3 p-3.5">
                      <span className="readout text-[11px] font-bold text-faint">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block text-[13px] font-bold">{item.title}</span>
                      <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : null}

            {phase === "loading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="card p-5 sm:p-6"
              >
                <p className="sr-only">Menelusuri referensi transaksi…</p>
                <div className="space-y-3" aria-hidden="true">
                  <div className="h-3.5 w-28 animate-pulse rounded bg-surface-2" />
                  <div className="h-5 w-40 animate-pulse rounded bg-surface-2" />
                  <div className="grid gap-2 sm:grid-cols-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="h-14 animate-pulse rounded-xl bg-surface-2" />
                    ))}
                  </div>
                  <div className="h-24 animate-pulse rounded-xl bg-surface-2" />
                </div>
              </motion.div>
            ) : null}

            {phase === "found" && result ? (
              <ResultCard
                key={result.ref}
                transaction={result}
                copied={copied}
                onCopy={copyRef}
                onReset={reset}
              />
            ) : null}

            {phase === "notfound" ? (
              <motion.div
                key="notfound"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="card p-5 sm:p-6"
              >
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bad-soft text-bad-ink">
                    <Icon name="alert" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-extrabold break-words">
                      Referensi {value.trim().toUpperCase()} tidak ditemukan
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-body">
                      Pastikan tidak ada spasi atau karakter yang tertukar. Referensi selalu berawalan
                      AD- dan bisa dilihat di struk pembayaran atau email konfirmasi.
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-[12px] text-muted">Coba contoh referensi:</p>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {demoTransactions.map((item) => (
                      <li key={item.ref}>
                        <button
                          type="button"
                          onClick={() => {
                            setValue(item.ref);
                            void lookup(item.ref);
                          }}
                          className="readout flex min-h-[44px] items-center rounded-full border border-line-strong px-4 text-[12.5px] font-semibold transition hover:border-brand hover:text-brand-ink"
                        >
                          {item.ref}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-3 flex min-h-[44px] items-center gap-1.5 text-[12.5px] font-semibold text-brand-ink transition hover:text-brand"
                  >
                    Cari referensi lain
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

type ResultCardProps = {
  transaction: DemoTransaction;
  copied: boolean;
  onCopy: (ref: string) => void;
  onReset: () => void;
};

function ResultCard({ transaction, copied, onCopy, onReset }: ResultCardProps) {
  const colors = tone[transaction.state];
  const isSuccess = transaction.state === "success";
  const progress = Math.min(
    100,
    Math.round(((isSuccess ? 3 : Math.min(transaction.stepIndex, 3)) / 3) * 100),
  );

  const details = [
    { label: "Layanan", value: transaction.service, wide: true },
    { label: "Nomor Tujuan", value: transaction.target, numeric: true },
    { label: "Nominal", value: transaction.amount, numeric: true },
    { label: "Metode", value: transaction.method },
    { label: "Dibuat", value: transaction.createdAt, numeric: true },
    { label: "Diperbarui", value: transaction.updatedAt, numeric: true },
  ];

  return (
    <motion.div
      key={transaction.ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="card overflow-hidden"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <p className="text-[11.5px] text-muted">Nomor Referensi</p>
          <p className="readout mt-1 text-lg font-semibold tracking-[0.04em] break-all sm:text-xl">
            {transaction.ref}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold",
              colors.badge,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} aria-hidden="true" />
            {stateLabels[transaction.state]}
          </span>
          <button
            type="button"
            onClick={() => onCopy(transaction.ref)}
            aria-label={`Salin nomor referensi ${transaction.ref}`}
            className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-line-strong px-4 text-[12.5px] font-semibold transition hover:border-brand hover:text-brand-ink"
          >
            <Icon name={copied ? "check" : "doc"} className="h-3.5 w-3.5" />
            {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      <div className="h-1 w-full bg-line" aria-hidden="true">
        <div
          className="h-full origin-left bg-brand transition-transform duration-500"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <p className="text-[11.5px] tracking-wide text-muted uppercase">Tahapan transaksi</p>

        <ol className="mt-3 grid gap-2.5 sm:grid-cols-4">
          {transactionSteps.map((step, index) => {
            const isDone = index < transaction.stepIndex || isSuccess;
            const isCurrent = index === transaction.stepIndex && !isDone && !isSuccess;
            const isFailed = index === transaction.stepIndex && transaction.state === "failed";

            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3.5 py-3 sm:flex-col sm:items-start sm:gap-2",
                  isFailed
                    ? "border-bad-ink/25 bg-bad-soft"
                    : isCurrent
                      ? "border-info-ink/25 bg-info-soft"
                      : isDone
                        ? "border-ok-ink/20 bg-ok-soft"
                        : "border-line bg-surface-3",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold",
                    isFailed
                      ? "bg-bad-ink text-white"
                      : isDone
                        ? "bg-ok-ink text-white"
                        : isCurrent
                          ? "bg-info-ink text-white"
                          : "bg-line-strong text-muted",
                  )}
                >
                  {isDone ? (
                    <Icon name="check" className="h-3.5 w-3.5" />
                  ) : (
                    <span className="readout">{index + 1}</span>
                  )}
                </span>

                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[12.5px] leading-snug font-bold",
                      isFailed && "text-bad-ink",
                      isCurrent && "text-info-ink",
                      !isDone && !isCurrent && !isFailed && "text-muted",
                    )}
                  >
                    {step}
                  </span>
                  <span className="readout mt-0.5 block text-[11px] text-muted">
                    {isDone
                      ? transaction.createdAt
                      : isFailed
                        ? transaction.updatedAt
                        : isCurrent
                          ? "Sedang berjalan"
                          : "Menunggu"}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <div
          className={cn(
            "mt-4 flex items-start gap-3 rounded-xl px-4 py-3.5",
            transaction.state === "failed"
              ? "bg-bad-soft text-bad-ink"
              : isSuccess
                ? "bg-ok-soft text-ok-ink"
                : "bg-info-soft text-info-ink",
          )}
        >
          <span className="mt-0.5 shrink-0" aria-hidden="true">
            <Icon name={transaction.state === "failed" ? "alert" : "check"} className="h-[18px] w-[18px]" />
          </span>
          <p className="text-[13px] leading-relaxed">{transaction.note}</p>
        </div>

        <dl className="mt-6 grid gap-x-8 gap-y-3.5 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.label} className="min-w-0">
              <dt className="text-[10.5px] tracking-wide text-muted uppercase">{detail.label}</dt>
              <dd
                className={cn(
                  "mt-1 text-[13.5px] font-bold break-words text-ink",
                  detail.numeric && "readout font-semibold",
                )}
              >
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-2.5 border-t border-line pt-4 sm:flex-row sm:items-center">
          <Link
            href="/bantuan#kontak"
            className="cta flex min-h-[48px] items-center justify-center gap-2 px-5 text-[13.5px] sm:min-h-[44px]"
          >
            <Icon name="chat" className="h-4 w-4" />
            Transaksi bermasalah? Hubungi kami
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-line-strong px-5 text-[13.5px] font-bold text-body transition hover:border-brand hover:text-brand-ink sm:min-h-[44px]"
          >
            <Icon name="search" className="h-4 w-4" />
            Cek transaksi lain
          </button>
        </div>
      </div>
    </motion.div>
  );
}
