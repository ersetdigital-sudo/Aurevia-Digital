"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navigation } from "@/data/navigation";
import { cn } from "@/lib/cn";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

  function handleNavClick(href: string) {
    const [, anchor] = href.split("#");
    setHash(anchor ? `#${anchor}` : "");
  }

  function isActive(href: string) {
    const [path, anchor] = href.split("#");
    const basePath = path || "/";
    if (basePath !== pathname) return false;
    return anchor ? hash === `#${anchor}` : !hash;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface-2/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between">
        <Logo href="/" />

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 text-sm text-body md:flex"
        >
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "relative py-1.5 transition hover:text-brand-ink",
                  active && "font-semibold text-ink",
                )}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-brand"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:flex" />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface md:hidden"
          >
            <Icon name={isMenuOpen ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isMenuOpen ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Navigasi mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-line bg-surface-2 md:hidden"
          >
            <ul className="wrap flex flex-col py-3">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => {
                        handleNavClick(item.href);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "relative block py-2.5 text-sm text-body transition hover:text-brand-ink",
                        active && "font-semibold text-ink",
                      )}
                    >
                      {item.label}
                      {active ? (
                        <span
                          aria-hidden="true"
                          className="absolute top-1/2 -left-3 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 flex items-center justify-between border-t border-line pt-4 sm:hidden">
                <span className="text-sm text-body">Ganti tema</span>
                <ThemeToggle />
              </li>
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
