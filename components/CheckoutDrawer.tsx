"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { QrisCode } from "@/components/QrisCode";
import { getCheckoutCategory } from "@/data/checkout";
import { services } from "@/data/content";
import { createTrxRef, detectOperator, saveInvoice } from "@/lib/checkout";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { CheckoutItem } from "@/types";

type Step = 1 | 2 | 3 | 4;

type CheckoutDrawerProps = {
  categoryId: string | null;
  initialGroup?: string | null;
  initialItem?: string | null;
  onClose: () => void;
};

const stepMeta: Record<Exclude<Step, 1>, { title: string; subtitle: string }> = {
  2: { title: "Ringkasan Transaksi", subtitle: "Periksa kembali rincian pesanan Anda" },
  3: { title: "Pembayaran QRIS", subtitle: "Pindai kode lewat m-Banking atau E-Wallet" },
  4: { title: "Menunggu Konfirmasi", subtitle: "Pembayaran diterima, transaksi diproses admin" },
};

const paymentChannels = ["BCA", "BRI", "MANDIRI", "BNI", "GOPAY", "OVO", "DANA", "SHOPEEPAY"];

export function CheckoutDrawer({ categoryId, initialGroup, initialItem, onClose }: CheckoutDrawerProps) {
  const isOpen = categoryId !== null;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {categoryId ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4"
        >
          <button
            type="button"
            onClick={onClose}
            tabIndex={-1}
            aria-label="Tutup dialog"
            className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
          />

          <CheckoutPanel
            key={categoryId}
            categoryId={categoryId}
            initialGroup={initialGroup ?? null}
            initialItem={initialItem ?? null}
            onClose={onClose}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type CheckoutPanelProps = {
  categoryId: string;
  initialGroup: string | null;
  initialItem: string | null;
  onClose: () => void;
};

function CheckoutPanel({ categoryId, initialGroup, initialItem, onClose }: CheckoutPanelProps) {
  const category = getCheckoutCategory(categoryId);
  const service = services.find((entry) => entry.id === categoryId) ?? services[0];
  const initialGroupIndex = (() => {
    if (!initialGroup) return 0;
    const found = category.groups.findIndex((group) => group.name === initialGroup);
    return found >= 0 ? found : 0;
  })();

  const [step, setStep] = useState<Step>(1);
  const [stepDirection, setStepDirection] = useState<1 | -1>(1);
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [selectedItem, setSelectedItem] = useState<CheckoutItem | null>(() => {
    if (!initialItem) return null;
    return (
      category.groups[initialGroupIndex]?.items.find((item) => item.label === initialItem) ?? null
    );
  });
  const [targetNumber, setTargetNumber] = useState("");
  const [variableAmount, setVariableAmount] = useState(0);
  const [trxRef, setTrxRef] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorTarget, setErrorTarget] = useState(false);
  const [errorItem, setErrorItem] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (step !== 3 || secondsLeft <= 0) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [step, secondsLeft]);

  const activeGroup = category.groups[groupIndex] ?? category.groups[0];
  const detectedOperator =
    category.id === "pulsa" || category.id === "paket-data" ? detectOperator(targetNumber) : null;

  const baseAmount = selectedItem
    ? selectedItem.variable
      ? variableAmount
      : selectedItem.price - category.admin
    : 0;
  const totalAmount = baseAmount + category.admin;

  function handleSelectGroup(index: number) {
    setGroupIndex(index);
    setSelectedItem(null);
    setErrorItem(false);
  }

  function handleNextToSummary() {
    const digits = targetNumber.replace(/\D/g, "");
    let isValid = true;

    if (digits.length < 6) {
      setErrorTarget(true);
      isValid = false;
    }
    if (!selectedItem) {
      setErrorItem(true);
      isValid = false;
    }
    if (selectedItem?.variable && variableAmount < 10000) {
      setErrorItem(true);
      isValid = false;
    }
    if (!isValid) return;

    setTrxRef(createTrxRef());
    setStepDirection(1);
    setStep(2);
  }

  function handleConfirmPayment() {
    setIsVerifying(true);
    window.setTimeout(() => {
      saveInvoice({
        ref: trxRef,
        service: service.title,
        product: selectedItem?.label ?? "-",
        target: targetNumber,
        targetLabel: category.field.label,
        amount: totalAmount,
        createdAt: Date.now(),
      });
      setIsVerifying(false);
      setStepDirection(1);
      setStep(4);
    }, 1200);
  }

  function handleTransactAgain() {
    setStepDirection(-1);
    setStep(1);
    setSelectedItem(null);
    setTargetNumber("");
    setVariableAmount(0);
    setSecondsLeft(15 * 60);
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const headerMeta =
    step === 1 ? { title: service.title, subtitle: service.description } : stepMeta[step];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="card relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden sm:rounded-2xl"
    >
      <header className="shrink-0 border-b border-line bg-page px-4 pt-3.5 pb-2.5 sm:px-5">
        <div className="flex items-center gap-3">
          <span className={`tile h-11 w-11 shrink-0 text-base ${service.tileClassName}`}>
            <Icon name={service.icon} />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="checkout-title"
              className="truncate font-display text-[17px] leading-tight font-extrabold tracking-[-0.01em]"
            >
              {headerMeta.title}
            </h2>
            <p className="mt-0.5 truncate text-[11.5px] text-muted">{headerMeta.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface-3 hover:text-ink"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <div
          role="progressbar"
          aria-label="Progres checkout"
          aria-valuemin={1}
          aria-valuemax={4}
          aria-valuenow={step}
          aria-valuetext={`Langkah ${step} dari 4`}
          className="mt-3 flex gap-1"
        >
          {([1, 2, 3, 4] as const).map((index) => (
            <span
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-300",
                index <= step ? "bg-brand" : "bg-line",
              )}
            />
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : stepDirection * 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prefersReducedMotion ? 0 : stepDirection * -12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 1 ? (
              <StepProductForm
                category={category}
                service={service}
                groupIndex={groupIndex}
                activeGroup={activeGroup}
                selectedItem={selectedItem}
                targetNumber={targetNumber}
                variableAmount={variableAmount}
                detectedOperator={detectedOperator}
                errorTarget={errorTarget}
                errorItem={errorItem}
                inputRef={inputRef}
                onGroupChange={handleSelectGroup}
                onItemChange={(item) => {
                  setSelectedItem(item);
                  setErrorItem(false);
                }}
                onNumberChange={(value) => {
                  setTargetNumber(value);
                  setErrorTarget(false);
                }}
                onAmountChange={(value) => {
                  setVariableAmount(value);
                  setErrorItem(false);
                }}
              />
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div className="space-y-2.5 rounded-2xl border border-line bg-surface-3 p-4 text-[13.5px] sm:p-5">
                  <SummaryRow label="Kategori Layanan" value={service.title} />
                  <SummaryRow label="Produk / Nominal" value={selectedItem?.label ?? "-"} />
                  <SummaryRow label={category.field.label} value={targetNumber} mono />
                  <SummaryRow label="No. Invoice" value={trxRef} mono accent />
                  <div className="border-t border-dashed border-line-strong" />
                  <SummaryRow label="Harga Pokok" value={formatRupiah(baseAmount)} mono />
                  <SummaryRow
                    label="Biaya Layanan & Admin"
                    value={category.admin > 0 ? formatRupiah(category.admin) : "Gratis"}
                    mono
                  />
                  <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2.5">
                    <span className="text-[15px] font-bold">Total Bayar</span>
                    <span className="readout text-xl font-extrabold text-brand">
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>
                </div>

                <p className="text-center text-[11.5px] text-muted">
                  Periksa kembali data nomor tujuan Anda. Pembayaran diverifikasi otomatis via QRIS.
                </p>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStepDirection(-1);
                      setStep(1);
                    }}
                    className="min-h-[44px] shrink-0 rounded-full border border-line-strong px-5 text-[13px] font-bold text-body transition hover:bg-surface-3"
                  >
                    Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStepDirection(1);
                      setStep(3);
                    }}
                    className="cta flex min-h-[44px] flex-1 items-center justify-center gap-2 px-4 py-3 text-sm"
                  >
                    Bayar dengan QRIS
                    <Icon name="qr" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4 text-center">
                <div>
                  <p className="text-[13px] text-muted">
                    Pindai kode QRIS menggunakan m-Banking atau E-Wallet:
                  </p>
                  <p className="readout mt-1 text-3xl font-extrabold text-brand">
                    {formatRupiah(totalAmount)}
                  </p>
                  <p className="mt-2.5 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-line-strong bg-surface-3 px-4 py-1.5 text-[12.5px] font-bold text-muted">
                    No. Invoice
                    <span className="readout text-[14px] font-extrabold text-ink">{trxRef}</span>
                  </p>
                </div>

                <div className="relative mx-auto h-[200px] w-[200px] overflow-hidden rounded-2xl border border-line-strong bg-surface p-3 text-ink shadow-[0_4px_12px_rgba(28,25,23,0.08)]">
                  <QrisCode className="h-full w-full" />
                  <span aria-hidden="true" className="qris-scan pointer-events-none absolute inset-x-3 h-9" />
                </div>

                <p className="readout text-[11px] text-faint">
                  NMID: ID1000000000001 · Merchant: AUREVIA DIGITAL PPOB
                </p>

                <p className="inline-flex items-center gap-1.5 rounded-full border border-warn-ink/25 bg-warn-soft px-3.5 py-1.5 text-[12px] font-bold text-warn-ink">
                  <Icon name="clock" className="h-4 w-4" />
                  Sisa Waktu Bayar:{" "}
                  <span className="readout">
                    {minutes}:{seconds}
                  </span>
                </p>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {paymentChannels.map((channel) => (
                    <span
                      key={channel}
                      className="readout rounded border border-line bg-surface-3 px-2 py-1 text-[10px] font-bold text-muted"
                    >
                      {channel}
                    </span>
                  ))}
                </div>

                <p className="text-[11px] text-hint">
                  Tampilan QRIS contoh — sambungkan ke payment gateway sebelum dipakai di produksi.
                </p>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStepDirection(-1);
                      setStep(2);
                    }}
                    className="min-h-[44px] shrink-0 rounded-full border border-line-strong px-5 text-[13px] font-bold text-body transition hover:bg-surface-3"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={isVerifying}
                    className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-[#15803d] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#166534] disabled:opacity-60"
                  >
                    {isVerifying ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Memverifikasi Mutasi…
                      </>
                    ) : (
                      <>
                        <Icon name="check" className="h-4 w-4" />
                        Saya Sudah Bayar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-4 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warn-soft text-warn-ink">
                  <Icon name="clock" className="h-8 w-8" />
                </span>

                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-warn-ink/25 bg-warn-soft px-3 py-1 text-[11.5px] font-bold text-warn-ink">
                    <span className="status-pulse h-1.5 w-1.5 rounded-full bg-warn-ink" aria-hidden="true" />
                    Sedang Diproses
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em]">
                    Pembayaran Diterima
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted">
                    Pembayaran QRIS sudah kami terima. Transaksi menunggu konfirmasi admin Aurevia Digital
                    sebelum diteruskan ke penyedia — pantau statusnya lewat nomor invoice di bawah.
                  </p>
                </div>

                <dl className="space-y-2 rounded-2xl border border-dashed border-line-strong bg-surface-3 p-4 text-left text-[13px] sm:p-5">
                  <ReceiptRow label="No. Invoice" value={trxRef} mono />
                  <ReceiptRow label="Status" value="Menunggu Konfirmasi Admin" />
                  <ReceiptRow label="Kategori" value={service.title} />
                  <ReceiptRow label="Produk" value={selectedItem?.label ?? "-"} />
                  <ReceiptRow label={category.field.label} value={targetNumber} mono />
                  <div className="border-t border-dashed border-line-strong" />
                  <div className="flex items-baseline justify-between gap-4 pt-0.5">
                    <dt className="text-[14px] font-bold">Total Pembayaran</dt>
                    <dd className="readout text-[15px] font-extrabold text-brand">
                      {formatRupiah(totalAmount)}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                  <Link
                    href="/status"
                    onClick={onClose}
                    className="cta flex min-h-[44px] flex-1 items-center justify-center gap-2 px-4 py-3 text-[13px]"
                  >
                    <Icon name="search" className="h-4 w-4" />
                    Lacak di Cek Status
                  </Link>
                  <button
                    type="button"
                    onClick={handleTransactAgain}
                    className="min-h-[44px] shrink-0 rounded-full border border-line-strong px-5 text-[13px] font-bold text-body transition hover:bg-surface-3"
                  >
                    Transaksi Lagi
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {step === 1 ? (
        <div className="shrink-0 border-t border-line bg-surface px-4 py-3.5 sm:px-5">
          <button
            type="button"
            onClick={handleNextToSummary}
            className="cta flex min-h-[48px] w-full items-center justify-center gap-2 px-4 py-3.5 text-sm"
          >
            Lanjut ke Ringkasan
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </motion.div>
  );
}

type StepProductFormProps = {
  category: ReturnType<typeof getCheckoutCategory>;
  service: (typeof services)[number];
  groupIndex: number;
  activeGroup: ReturnType<typeof getCheckoutCategory>["groups"][number];
  selectedItem: CheckoutItem | null;
  targetNumber: string;
  variableAmount: number;
  detectedOperator: { name: string } | null;
  errorTarget: boolean;
  errorItem: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onGroupChange: (index: number) => void;
  onItemChange: (item: CheckoutItem) => void;
  onNumberChange: (value: string) => void;
  onAmountChange: (value: number) => void;
};

function StepProductForm({
  category,
  service,
  groupIndex,
  activeGroup,
  selectedItem,
  targetNumber,
  variableAmount,
  detectedOperator,
  errorTarget,
  errorItem,
  inputRef,
  onGroupChange,
  onItemChange,
  onNumberChange,
  onAmountChange,
}: StepProductFormProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="checkout-target" className="text-[13px] font-bold">
            {category.field.label}
          </label>
          {detectedOperator ? (
            <span className="readout rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">
              {detectedOperator.name}
            </span>
          ) : null}
        </div>
        <div className="relative">
          <Icon
            name={service.icon}
            className="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-faint"
          />
          <input
            ref={inputRef}
            id="checkout-target"
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            value={targetNumber}
            onChange={(event) => onNumberChange(event.target.value)}
            aria-invalid={errorTarget}
            aria-describedby={errorTarget ? "checkout-target-error" : undefined}
            placeholder={category.field.placeholder}
            className="w-full rounded-xl border border-line bg-surface py-3 pr-4 pl-11 font-mono text-sm font-bold text-ink transition placeholder:font-sans placeholder:font-normal placeholder:text-hint focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
          />
        </div>
        <p className="text-[11px] text-hint">{category.field.hint}</p>
        {errorTarget ? (
          <p
            id="checkout-target-error"
            role="alert"
            className="flex items-center gap-1.5 text-[12px] font-bold text-bad-ink"
          >
            <Icon name="alert" className="h-4 w-4" />
            Nomor tujuan wajib diisi minimal 6 digit angka.
          </p>
        ) : null}
      </div>

      {category.groups.length > 1 ? (
        <div
          role="tablist"
          aria-label="Pilih jenis produk"
          className="flex gap-2 overflow-x-auto border-b border-line pb-2"
        >
          {category.groups.map((group, index) => (
            <button
              key={group.name}
              type="button"
              role="tab"
              aria-selected={groupIndex === index}
              onClick={() => onGroupChange(index)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition",
                groupIndex === index
                  ? "bg-brand-soft text-brand"
                  : "text-muted hover:bg-surface-3 hover:text-ink",
              )}
            >
              {group.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="space-y-2.5">
        <h3 className="text-[13.5px] font-bold">{category.nominalTitle}</h3>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {activeGroup.items.map((item) => {
            const isSelected = selectedItem?.label === item.label;
            return (
              <button
                key={item.label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onItemChange(item)}
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border p-3.5 text-left transition duration-200 hover:-translate-y-0.5",
                  isSelected
                    ? "translate-y-0 border-brand bg-surface ring-2 ring-brand/20"
                    : "border-line bg-surface-3 hover:border-line-strong hover:bg-surface",
                )}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block text-[13.5px] leading-snug font-bold">{item.label}</span>
                    <span className="mt-0.5 block text-[11.5px] leading-normal text-muted">
                      {item.detail}
                    </span>
                  </span>
                  {isSelected ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                </span>
                <span className="readout block border-t border-line pt-2 text-[13px] font-extrabold text-brand">
                  {item.variable ? "Sesuai Tagihan" : formatRupiah(item.price)}
                </span>
              </button>
            );
          })}
        </div>

        {errorItem ? (
          <p
            role="alert"
            className="flex items-center gap-1.5 pt-1 text-[12px] font-bold text-bad-ink"
          >
            <Icon name="alert" className="h-4 w-4" />
            {selectedItem?.variable && variableAmount < 10000
              ? "Nominal tagihan minimal Rp10.000."
              : "Pilih salah satu produk terlebih dahulu."}
          </p>
        ) : null}
      </div>

      {selectedItem?.variable ? (
        <div className="space-y-1.5 rounded-2xl border border-line bg-surface-3 p-3.5">
          <label htmlFor="checkout-amount" className="text-[12.5px] font-bold">
            Nominal Tagihan (Rp)
          </label>
          <input
            id="checkout-amount"
            type="number"
            min={10000}
            step={1000}
            placeholder="Contoh: 150000"
            value={variableAmount || ""}
            onChange={(event) => onAmountChange(Number(event.target.value))}
            className="readout w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-bold text-ink focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
          />
          <p className="text-[11px] text-hint">Minimal pembayaran Rp10.000</p>
        </div>
      ) : null}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span
        className={cn(
          "min-w-0 truncate text-right font-bold",
          mono && "readout font-semibold",
          accent ? "text-brand" : "text-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function ReceiptRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={cn("min-w-0 truncate font-bold text-ink", mono && "readout font-semibold")}>
        {value}
      </dd>
    </div>
  );
}
