"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "neopay-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);

    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // localStorage bisa diblokir (mode privat), abaikan saja.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-pressed={isDark}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-faint transition hover:bg-surface hover:text-brand",
        className,
      )}
    >
      <Icon name={isDark ? "moon" : "sun"} className="h-5 w-5" />
    </button>
  );
}
