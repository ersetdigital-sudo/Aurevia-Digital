"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/cn";

type Feedback = { status: "error" | "success"; message: string } | null;

export function HeroSearchForm() {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const digits = value.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) {
      setFeedback({
        status: "error",
        message: "Nomor HP atau ID pelanggan harus berupa 9–15 digit angka.",
      });
      return;
    }

    setFeedback({
      status: "success",
      message: `Nomor ${digits} siap dicek. Pilih layanan di bawah untuk melanjutkan.`,
    });

    document.getElementById("layanan")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const isInvalid = feedback?.status === "error";

  return (
    <div className="mt-7 max-w-xl">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-wrap items-center gap-2 rounded-full border border-white bg-white/95 p-2 shadow-[0_12px_40px_rgba(20,22,26,.10)] backdrop-blur sm:flex-nowrap"
      >
        <span className="pl-3 text-muted">
          <Icon name="phone" />
        </span>
        <label htmlFor="customer-id" className="sr-only">
          Nomor HP atau ID pelanggan
        </label>
        <input
          id="customer-id"
          name="customerId"
          type="text"
          inputMode="numeric"
          autoComplete="tel"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setFeedback(null);
          }}
          aria-invalid={isInvalid}
          aria-describedby={feedback ? "lookup-feedback" : undefined}
          placeholder="Masukkan nomor HP / ID pelanggan"
          className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-hint"
        />
        <button
          type="submit"
          className="cta flex w-full items-center justify-center gap-2 px-7 py-3 text-sm sm:w-auto"
        >
          Cek Layanan
          <Icon name="arrow" className="h-4 w-4" />
        </button>
      </form>

      <p
        id="lookup-feedback"
        role="status"
        className={cn(
          "mt-2 min-h-[18px] px-2 text-[12px]",
          isInvalid ? "text-red-600 dark:text-red-400" : "text-body",
        )}
      >
        {feedback?.message}
      </p>
    </div>
  );
}
