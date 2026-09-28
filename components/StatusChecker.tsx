"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

type Phase = "idle" | "loading" | "found" | "notfound";

const tone: Record<TransactionState, { badge: string; dot: string; icon: string }> = {
  success: { badge: "bg-ok-soft text-ok-ink", dot: "bg-[#15803d]", icon: "text-[#15803d]" },
  processing: { badge: "bg-info-soft text-info-ink", dot: "bg-[#0e7490]", icon: "text-[#0e7490]" },
  pending: { badge: "bg-warn-soft text-warn-ink", dot: "bg-[#b45309]", icon: "text-[#b45309]" },
  failed: { badge: "bg-bad-soft text-bad-ink", dot: "bg-[#b91c1c]", icon: "text-[#b91c1c]" },
};

const idMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatStamp(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getDate()} ${idMonths[date.getMonth()]} ${date.getFullYear()}, ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
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
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function lookup(rawRef: string) {
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

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const localInvoice = findInvoice(code);
      const found =
        demoTransactions.find((item) => item.ref === code) ??
        (localInvoice ? invoiceToTransaction(localInvoice) : null);
      setResult(found);
      setPhase(found ? "found" : "notfound");
    }, 700);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    lookup(value);
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
    <section id="beranda" className="border-b border-line bg-surface-2">
      <div className="wrap pt-11 pb-10 lg:pt-14">
        <p className="readout text-[11px] tracking-[0.14em] text-muted uppercase">
          Pelacakan Transaksi · 4 referensi contoh · Diperbarui 27 Sep 2026, 15:47 WIB
        </p>
        <h1 className="font-display mt-3 max-w-[15ch] text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.02em]">
          Cek Status Transaksi
        </h1>
        <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-body">
          Masukkan nomor referensi dari struk digital atau email konfirmasi untuk
          melihat tahapan transaksi secara real-time.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-7 flex max-w-2xl flex-wrap items-center gap-2 rounded-2xl border border-line-strong bg-surface p-2 shadow-[0_1px_2px_rgba(28,25,23,0.06)] transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25 sm:flex-nowrap sm:rounded-full"
        >
          <span className="pl-3 text-muted">
            <Icon name="doc" />
          </span>
          <label htmlFor="reference" className="sr-only">
            Nomor referensi transaksi
          </label>
          <input
            id="reference"
            name="reference"
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(event) => {
              setValue(event.target.value.toUpperCase());
              if (error) setError(null);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "reference-feedback" : "reference-hint"}
            placeholder="AD-8F4K2Q"
            className="readout min-w-0 flex-1 bg-transparent px-2 py-2.5 text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-hint"
          />
          <button
            type="submit"
            disabled={phase === "loading"}
            className="cta flex w-full items-center justify-center gap-2 px-7 py-3 text-sm disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {phase === "loading" ? "Menelusuri…" : "Cek Status"}
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </form>

        <p
          id={error ? "reference-feedback" : "reference-hint"}
          role={error ? "alert" : undefined}
          className={cn(
            "mt-2.5 min-h-[18px] text-[12.5px]",
            error ? "font-semibold text-bad-ink" : "text-muted",
          )}
        >
          {error ??
            "Format referensi: AD-XXXXXX. Contoh yang bisa dicoba: AD-8F4K2Q, AD-2X9M4T, AD-5R1W7B, AD-6C3J9D."}
        </p>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {phase === "idle" && !error ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="card p-6 sm:p-7"
              >
                <p className="text-[15px] font-extrabold">Di mana menemukan nomor referensi?</p>
                <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    { step: "Struk digital", text: "Muncul otomatis setelah pembayaran, berformat AD-XXXXXX." },
                    { step: "Email konfirmasi", text: "Dikirim ke email terdaftar dalam 1 menit." },
                    { step: "Menu Riwayat", text: "Buka riwayat transaksi, tap detail untuk menyalin referensi." },
                  ].map((item, index) => (
                    <li key={item.step} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[12px] font-extrabold text-brand-ink tabular-nums">
                        {index + 1}
                      </span>
                      <span>
                        <span className="block text-[13px] font-bold">{item.step}</span>
                        <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                          {item.text}
                        </span>
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
                className="card p-6"
                aria-live="polite"
              >
                <p className="text-[13px] font-bold text-body">Menelusuri referensi…</p>
                <div className="mt-5 space-y-3" aria-hidden="true">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
                  <div className="h-20 w-full animate-pulse rounded-xl bg-surface-2" />
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="card p-6 sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bad-soft text-bad-ink">
                    <Icon name="alert" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[15px] font-extrabold">
                      Referensi {value.trim().toUpperCase()} tidak ditemukan
                    </p>
                    <p className="mt-1.5 max-w-[58ch] text-[13px] leading-relaxed text-body">
                      Pastikan tidak ada spasi atau karakter yang tertukar. Referensi selalu
                      berawalan AD- dan bisa dilihat di menu Riwayat atau email konfirmasi.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  <span className="text-[12px] text-muted">Coba contoh:</span>
                  {demoTransactions.map((item) => (
                    <button
                      key={item.ref}
                      type="button"
                      onClick={() => {
                        setValue(item.ref);
                        lookup(item.ref);
                      }}
                    className="readout rounded-full border border-line-strong px-3 py-1.5 text-[12px] font-semibold transition hover:border-brand hover:text-brand-ink"
                  >
                    {item.ref}
                  </button>
                  ))}
                  <button
                    type="button"
                    onClick={reset}
                    className="ml-auto text-[12.5px] font-semibold text-brand-ink transition hover:text-brand"
                  >
                    Cari referensi lain
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

function ResultCard({
  transaction,
  copied,
  onCopy,
  onReset,
}: ResultCardProps) {
  const colors = tone[transaction.state];

  const details = [
    { label: "Layanan", value: transaction.service },
    { label: "Nomor Tujuan", value: transaction.target, numeric: true },
    { label: "Nominal", value: transaction.amount, numeric: true },
    { label: "Metode", value: transaction.method },
    { label: "Dibuat", value: transaction.createdAt, numeric: true },
    { label: "Diperbarui", value: transaction.updatedAt, numeric: true },
  ];

  return (
    <motion.div
      key={transaction.ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="card overflow-hidden"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
        <div>
          <p className="text-[12px] text-muted">Nomor Referensi</p>
          <p className="readout mt-1 text-xl font-semibold tracking-[0.04em]">
            {transaction.ref}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold",
              colors.badge,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
            {stateLabels[transaction.state]}
          </span>
          <button
            type="button"
            onClick={() => onCopy(transaction.ref)}
            className="rounded-full border border-line-strong px-3.5 py-1.5 text-[12px] font-semibold transition hover:border-brand hover:text-brand-ink"
          >
            {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-7">
        <ol className="grid gap-5 sm:grid-cols-4 sm:gap-0">
          {transactionSteps.map((step, index) => {
            const isDone =
              index < transaction.stepIndex || transaction.state === "success";
            const isCurrent = index === transaction.stepIndex && !isDone;
            const isFailed = index === transaction.stepIndex && transaction.state === "failed";
            const isLast = index === transactionSteps.length - 1;

            return (
              <li key={step} className="relative flex gap-3 sm:block">
                {isLast ? null : (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-6 left-[11px] w-px sm:top-[11px] sm:left-6 sm:h-px sm:w-full",
                      isDone ? "bg-[#15803d]/50" : "bg-line-strong",
                    )}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-white",
                    isDone && "border-[#15803d] bg-[#15803d]",
                    isCurrent && "border-[#0e7490] bg-surface",
                    isFailed && "border-[#b91c1c] bg-[#b91c1c]",
                    !isDone && !isCurrent && !isFailed && "border-line-strong bg-surface",
                  )}
                >
                  {isDone ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                      <path
                        d="m5 12.5 4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                  {isFailed ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : null}
                </span>
                <div className="sm:mt-3 sm:pr-5">
                  <p
                    className={cn(
                      "text-[12.5px] leading-tight font-bold",
                      isCurrent && "text-info-ink",
                      isFailed && "text-bad-ink",
                      !isDone && !isCurrent && !isFailed && "text-muted",
                    )}
                  >
                    {step}
                  </p>
                  {isDone || isFailed ? (
                    <p className="readout mt-0.5 text-[11px] text-muted">
                      {isFailed ? transaction.updatedAt : transaction.createdAt}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        <div
          className={cn(
            "mt-6 flex items-start gap-3 rounded-xl px-4 py-3.5",
            transaction.state === "failed"
              ? "bg-bad-soft text-bad-ink"
              : transaction.state === "success"
                ? "bg-ok-soft text-ok-ink"
                : "bg-info-soft text-info-ink",
          )}
        >
          <span className="mt-0.5 shrink-0">
            <Icon
              name={transaction.state === "failed" ? "alert" : "check"}
              className="h-[18px] w-[18px]"
            />
          </span>
          <p className="text-[13px] leading-relaxed">{transaction.note}</p>
        </div>

        <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-[11px] tracking-wide text-muted uppercase">{detail.label}</dt>
              <dd
                className={cn(
                  "mt-1 text-[13.5px] font-bold text-ink",
                  detail.numeric && "readout font-semibold",
                )}
              >
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-[12.5px]">
          <button
            type="button"
            onClick={onReset}
            className="font-semibold text-brand-ink transition hover:text-brand"
          >
            Cek transaksi lain
          </button>
          <a href="/bantuan#kontak" className="font-semibold text-body transition hover:text-ink">
            Transaksi bermasalah? Hubungi kami
          </a>
        </div>
      </div>
    </motion.div>
  );
}
