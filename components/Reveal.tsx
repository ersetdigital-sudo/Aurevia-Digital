"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Scroll-reveal wrapper.
 *
 * Penting: komponen ini harus merender elemen yang SAMA di server dan client
 * (selalu `motion.div`). Dulu ada cabang `useReducedMotion()` yang bikin server
 * render `motion.div` (opacity:0) sedangkan client render `<div>` biasa saat
 * sistem aktifkan "reduce motion" -> hydration mismatch -> style opacity:0
 * menempel selamanya dan konten tak pernah muncul (halaman kosong).
 * Preferensi reduced motion kini ditangani global lewat `MotionConfig`
 * di `app/layout.tsx`.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
