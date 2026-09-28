import type { Metadata } from "next";
import { HelpCenter } from "@/components/HelpCenter";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Pusat Bantuan",
  description:
    "Temukan jawaban seputar akun, metode pembayaran, transaksi bermasalah, refund, dan keamanan di Pusat Bantuan Aurevia Digital. Hubungi tim kami 07.00–23.00 WIB.",
  alternates: { canonical: "/bantuan" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/bantuan",
    siteName: siteConfig.name,
    title: "Pusat Bantuan Aurevia Digital",
    description:
      "Jawaban cepat untuk akun, pembayaran, dan transaksi yang bermasalah — plus kanal dukungan harian Aurevia Digital.",
  },
  robots: { index: true, follow: true },
};

export default function HelpPage() {
  return <HelpCenter />;
}
