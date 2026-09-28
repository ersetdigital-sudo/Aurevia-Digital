"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import type { FaqItem } from "@/data/help";
import { cn } from "@/lib/cn";

type FaqListProps = {
  items: FaqItem[];
  query: string;
};

export function FaqList({ items, query }: FaqListProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) {
    return (
      <div className="card px-6 py-10 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Icon name="search" />
        </span>
        <p className="mt-4 text-[15px] font-bold">
          Tidak ada jawaban untuk “{query || "topik ini"}”
        </p>
        <p className="mx-auto mt-2 max-w-[46ch] text-[13px] leading-relaxed text-muted">
          Coba kata kunci lain, atau langsung tanyakan ke tim kami lewat WhatsApp —
          rata-rata balasan di bawah 5 menit.
        </p>
        <a
          href="#kontak"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[13px] font-bold text-white transition hover:brightness-105"
        >
          Hubungi Kami
          <Icon name="arrow" className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <ul className="border-t border-line">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <li key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-${item.id}`}
                className="flex w-full items-start justify-between gap-4 py-4 text-left transition hover:text-brand-ink"
              >
                <span className="text-[14px] leading-snug font-bold sm:text-[15px]">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-muted transition",
                    isOpen && "rotate-180 border-brand-ink bg-brand-soft text-brand-ink",
                  )}
                >
                  <Icon name="chevron" className="h-4 w-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`faq-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[72ch] pr-8 pb-5 text-[13.5px] leading-relaxed text-body">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
