"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { CheckoutDrawer } from "@/components/CheckoutDrawer";
import { Reveal } from "@/components/Reveal";
import { getCheckoutCategory } from "@/data/checkout";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { CheckoutCategory, CheckoutGroup, CheckoutItem, QrisSettings } from "@/types";

type PulsaSectionProps = {
  /** Konfigurasi kategori/produk untuk drawer checkout. */
  checkout: CheckoutCategory[];
  /** Pengaturan QRIS dari admin (null -> pakai QR contoh). */
  qris: QrisSettings | null;
};

/** Label produk di database berbentuk "Pulsa 10.000" -> ditampilkan sebagai nominal. */
function nominalOf(label: string): string {
  const match = label.match(/^pulsa\s*(.+)$/i);
  return match ? `Rp ${match[1]}` : label;
}

function groupId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function PulsaSection({ checkout, qris }: PulsaSectionProps) {
  const category = checkout.find((entry) => entry.id === "pulsa") ?? getCheckoutCategory("pulsa");
  const groups = useMemo(
    () => category.groups.filter((group) => group.items.length > 0),
    [category],
  );

  const [activeGroupName, setActiveGroupName] = useState(groups[0]?.name ?? "");
  const [selectedItem, setSelectedItem] = useState<CheckoutItem | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeGroup: CheckoutGroup | undefined =
    groups.find((group) => group.name === activeGroupName) ?? groups[0];

  const closeModal = useCallback(() => setSelectedItem(null), []);

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = groups.length - 1;
    let nextIndex: number;

    if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    else if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else return;

    event.preventDefault();
    setActiveGroupName(groups[nextIndex].name);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section id="transaksi" className="pb-14">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow mb-2">Produk Pulsa</p>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Pulsa Semua Operator
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                Pilih nominal dan selesaikan pembayaran dalam hitungan detik.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Pilih operator"
              className="flex flex-wrap items-center gap-2 text-[12px] font-semibold"
            >
              {groups.map((group, index) => {
                const isActive = group.name === activeGroup?.name;

                return (
                  <button
                    key={group.name}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${groupId(group.name)}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${groupId(group.name)}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveGroupName(group.name)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={cn(
                      "rounded-full px-3 py-1.5 transition",
                      isActive ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface",
                    )}
                  >
                    {isActive ? "● " : ""}
                    {group.name}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {activeGroup ? (
          <div
            id={`panel-${groupId(activeGroup.name)}`}
            role="tabpanel"
            aria-labelledby={`tab-${groupId(activeGroup.name)}`}
            className="mt-6"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={activeGroup.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
              >
                {activeGroup.items.map((item) => (
                  <li key={item.label} className="card relative p-4 text-center transition hover:shadow-md">
                    <p className="text-[15px] font-extrabold">{nominalOf(item.label)}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {item.variable ? "Sesuai tagihan" : formatRupiah(item.price)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="mt-3 w-full rounded-full border border-brand py-1.5 text-[12px] font-bold text-brand transition hover:bg-brand hover:text-white"
                    >
                      Beli
                    </button>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        ) : (
          <p className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface-2 px-4 py-6 text-center text-[13px] text-muted">
            Produk pulsa belum tersedia. Tambahkan lewat panel admin pada menu Produk.
          </p>
        )}

        <Reveal>
          <div className="card mt-3 flex items-center gap-3 bg-surface-3 p-4">
            <div className="tile bg-brand-soft text-lg text-brand">
              <Icon name="gift" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold">Nominal lainnya tersedia</p>
              <p className="text-[11px] text-muted">
                Pilih operator untuk melihat semua produk yang tersedia.
              </p>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Icon name="arrow" className="h-4 w-4" />
            </span>
          </div>
        </Reveal>
      </div>

      <CheckoutDrawer
        categoryId={selectedItem ? "pulsa" : null}
        initialGroup={selectedItem ? activeGroup?.name ?? null : null}
        initialItem={selectedItem?.label ?? null}
        onClose={closeModal}
        checkout={checkout}
        qris={qris}
      />
    </section>
  );
}
