import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";

/** Layout khusus halaman situs publik (di luar /admin). */
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
