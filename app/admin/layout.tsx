import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./admin.css";

/**
 * Layout akar /admin. CSS admin di-import di sini supaya ikut termuat juga
 * untuk /admin/login yang berada di luar route group (panel).
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
