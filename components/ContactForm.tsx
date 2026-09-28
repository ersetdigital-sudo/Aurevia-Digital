"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/cn";

type Phase = "idle" | "sending" | "sent" | "error";

const EMPTY = { name: "", contact: "", subject: "", message: "" };
const fieldClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-hint focus:border-brand focus:ring-2 focus:ring-brand/20";

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);

  function update(key: keyof typeof EMPTY, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
    if (error) setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase === "sending") return;

    setPhase("sending");
    setError(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) throw new Error(data.error ?? "Pesan gagal dikirim.");

      setForm(EMPTY);
      setPhase("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan, coba lagi sebentar lagi.");
      setPhase("error");
    }
  }

  if (phase === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-ok-soft px-4 py-4 text-ok-ink">
        <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="flex-1">
          <p className="text-[13.5px] font-bold">Pesan sudah terkirim.</p>
          <p className="mt-1 text-[12.5px] leading-relaxed">
            Tim Aurevia Digital membalas ke kontak yang kamu isi, biasanya di bawah 5 menit pada
            jam layanan 07.00–23.00 WIB.
          </p>
          <button
            type="button"
            onClick={() => setPhase("idle")}
            className="mt-3 text-[12.5px] font-bold underline decoration-from-font underline-offset-2"
          >
            Kirim pesan lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="contact-name" className="text-[12.5px] font-bold">
          Nama
        </label>
        <input
          id="contact-name"
          name="name"
          required
          maxLength={80}
          autoComplete="name"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="Nama kamu"
          className={cn(fieldClass, "mt-1.5")}
        />
      </div>

      <div>
        <label htmlFor="contact-reach" className="text-[12.5px] font-bold">
          Email / WhatsApp
        </label>
        <input
          id="contact-reach"
          name="contact"
          required
          maxLength={120}
          autoComplete="email"
          value={form.contact}
          onChange={(event) => update("contact", event.target.value)}
          placeholder="nama@email.com atau 08xxxxxxxxxx"
          className={cn(fieldClass, "mt-1.5")}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="contact-subject" className="text-[12.5px] font-bold">
          Subjek <span className="font-normal text-muted">(opsional)</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          maxLength={120}
          value={form.subject}
          onChange={(event) => update("subject", event.target.value)}
          placeholder="Contoh: Transaksi AD-8F4K2Q belum masuk"
          className={cn(fieldClass, "mt-1.5")}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="contact-message" className="text-[12.5px] font-bold">
          Pesan
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder="Tulis detail kendala, sertakan nomor referensi transaksi kalau ada."
          className={cn(fieldClass, "mt-1.5 resize-y")}
        />
        <p className="mt-1.5 text-[11px] text-hint">
          Minimal 10 karakter. Sertakan nomor referensi (AD-XXXXXX) supaya cepat ditelusuri.
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-bad-soft px-4 py-3 text-[12.5px] font-semibold text-bad-ink sm:col-span-2"
        >
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={phase === "sending"}
          className="cta flex min-h-[44px] w-full items-center justify-center gap-2 px-5 py-3 text-sm disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {phase === "sending" ? "Mengirim…" : "Kirim Pesan"}
          <Icon name="arrow" className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
