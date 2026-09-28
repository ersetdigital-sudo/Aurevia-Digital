"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { LogoMark } from "@/components/Logo";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: "chart" },
  { href: "/admin/produk", label: "Produk & Kategori", icon: "tag" },
  { href: "/admin/pesanan", label: "Pesanan", icon: "doc" },
  { href: "/admin/kontak", label: "Kontak Masuk", icon: "chat" },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: "lock" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="admin admin-shell" data-drawer={open ? "open" : "closed"}>
      <div
        className="adm-scrim"
        hidden={!open}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className="adm-side" id="admin-sidebar">
        <div className="adm-brand">
          <LogoMark className="h-8 w-8" />
          <span>
            <span className="adm-brand-name block">
              Aurevia <span style={{ color: "var(--mute)" }}>Digital</span>
            </span>
            <span className="adm-brand-sub">Panel Admin</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Navigasi admin">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="adm-link"
                aria-current={active ? "page" : undefined}
              >
                <Icon name={item.icon} className="h-[17px] w-[17px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="adm-side-foot">
          <Link href="/" className="adm-link">
            <Icon name="arrow" className="h-[17px] w-[17px]" />
            Lihat Situs
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="adm-link w-full"
            style={{ color: "var(--bad)" }}
          >
            <Icon name="close" className="h-[17px] w-[17px]" />
            {loggingOut ? "Keluar…" : "Keluar"}
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <button
            type="button"
            className="btn btn-ghost btn-sm adm-menu-btn"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="admin-sidebar"
          >
            <Icon name={open ? "close" : "menu"} className="h-4 w-4" />
            Menu
          </button>
          <span className="adm-eyebrow">Aurevia Digital · Panel Admin</span>
        </header>

        <div className="adm-content">{children}</div>
      </div>
    </div>
  );
}
