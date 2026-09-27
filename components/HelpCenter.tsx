"use client";

import { useMemo, useState } from "react";
import { ContactBand } from "@/components/ContactBand";
import { FaqList } from "@/components/FaqList";
import { HelpTopics } from "@/components/HelpTopics";
import { Icon } from "@/components/Icon";
import { faqs, helpTopics, popularSearches } from "@/data/help";
import { cn } from "@/lib/cn";

export function HelpCenter() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);

  const normalized = query.trim().toLowerCase();
  const isSearching = normalized.length > 0;
  const activeTopic = helpTopics.find((item) => item.id === topic) ?? null;

  const filteredFaqs = useMemo(
    () =>
      faqs.filter((item) => {
        const matchTopic = !topic || item.topic === topic;
        const matchQuery =
          !isSearching ||
          item.question.toLowerCase().includes(normalized) ||
          item.answer.toLowerCase().includes(normalized);
        return matchTopic && matchQuery;
      }),
    [isSearching, normalized, topic],
  );

  function handleSelectTopic(topicId: string | null) {
    setTopic(topicId);
    setQuery("");
    if (topicId) {
      document.getElementById("tanya")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      <section id="beranda" className="border-b border-line bg-surface-2">
        <div className="wrap pt-11 pb-10 lg:pt-14">
          <p className="readout text-[11px] tracking-[0.14em] text-muted uppercase">
            Pusat Bantuan · {faqs.length} pertanyaan · Diperbarui 27 Sep 2026
          </p>
          <h1 className="font-display mt-3 max-w-[16ch] text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.02em]">
            Ada yang bisa kami bantu?
          </h1>
          <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-body">
            Cari jawaban seputar akun, pembayaran, dan transaksi yang tertahan. Kalau
            tidak ketemu, tim kami siap dihubungi setiap hari.
          </p>

          <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className="mt-7 flex max-w-2xl items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 shadow-[0_1px_2px_rgba(28,25,23,0.06)] transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25"
          >
            <span className="text-muted">
              <Icon name="search" />
            </span>
            <label htmlFor="help-search" className="sr-only">
              Cari pertanyaan di pusat bantuan
            </label>
            <input
              id="help-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari: refund, lupa PIN, transaksi belum masuk…"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-hint"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-full p-1.5 text-muted transition hover:bg-surface-2 hover:text-ink"
                aria-label="Kosongkan pencarian"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            ) : null}
          </form>

          <ul className="mt-4 flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  onClick={() => setQuery(term)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition",
                    query === term
                      ? "border-brand bg-brand text-white"
                      : "border-line-strong bg-surface text-body hover:border-brand hover:text-brand-ink",
                  )}
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isSearching ? null : (
        <HelpTopics active={topic} onSelect={handleSelectTopic} />
      )}

      <section id="tanya" className="pt-8 pb-4">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                {isSearching ? "Hasil Pencarian" : "Pertanyaan Umum"}
              </h2>
              <p className="readout mt-1.5 text-[12px] text-muted">
                {filteredFaqs.length} dari {faqs.length} pertanyaan
                {activeTopic ? ` · topik ${activeTopic.title}` : ""}
              </p>
            </div>

            {activeTopic ? (
              <button
                type="button"
                onClick={() => setTopic(null)}
                className="flex items-center gap-1.5 rounded-full border border-brand bg-brand-soft px-3.5 py-1.5 text-[12px] font-bold text-brand-ink transition hover:brightness-105"
              >
                {activeTopic.title}
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <div className="mt-5">
            <FaqList items={filteredFaqs} query={query.trim() || activeTopic?.title || ""} />
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
