import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";

/**
 * Layout khusus halaman situs publik (di luar /admin).
 * ISR 60 detik supaya perubahan pengaturan admin (mis. link sosmed di footer)
 * ikut ter regenerate tanpa perlu deploy ulang.
 */
export const revalidate = 60;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>{children}</main>
      <Footer />
      <JsonLd />
    </MotionConfig>
  );
}
