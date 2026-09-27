"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { CheckoutDrawer } from "@/components/CheckoutDrawer";
import { Reveal } from "@/components/Reveal";
import { operators } from "@/data/operators";
import type { PulsaPackage } from "@/types";
import { cn } from "@/lib/cn";

export function PulsaSection() {
  const [activeOperatorId, setActiveOperatorId] = useState(operators[0].id);
  const [selectedPackage, setSelectedPackage] = useState<PulsaPackage | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeOperator = useMemo(
    () => operators.find((operator) => operator.id === activeOperatorId) ?? operators[0],
    [activeOperatorId],
  );

  const closeModal = useCallback(() => setSelectedPackage(null), []);

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = operators.length - 1;
    let nextIndex: number;

    if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    else if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else return;

    event.preventDefault();
    setActiveOperatorId(operators[nextIndex].id);
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
              {operators.map((operator, index) => {
                const isActive = operator.id === activeOperatorId;

                return (
                  <button
                    key={operator.id}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${operator.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${operator.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveOperatorId(operator.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={cn(
                      "rounded-full px-3 py-1.5 transition",
                      isActive ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface",
                    )}
                  >
                    {isActive ? "● " : ""}
                    {operator.name}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div
          id={`panel-${activeOperator.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeOperator.id}`}
          className="mt-6"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={activeOperator.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            >
              {activeOperator.packages.map((pkg) => (
                <li key={pkg.nominal} className="card relative p-4 text-center transition hover:shadow-md">
                  {pkg.badge ? (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold text-white">
                      {pkg.badge}
                    </span>
                  ) : null}
                  <p className="text-[15px] font-extrabold">{pkg.nominal}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{pkg.price}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className="mt-3 w-full rounded-full border border-brand py-1.5 text-[12px] font-bold text-brand transition hover:bg-brand hover:text-white"
                  >
                    Beli
                  </button>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

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
        categoryId={selectedPackage ? "pulsa" : null}
        initialGroup={selectedPackage ? activeOperator.name : null}
        initialItem={
          selectedPackage ? `Pulsa ${selectedPackage.nominal.replace(/^Rp\s*/, "")}` : null
        }
        onClose={closeModal}
      />
    </section>
  );
}
