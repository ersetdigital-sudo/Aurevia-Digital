import type { Metadata } from "next";
import { About } from "@/components/About";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali lebih dekat Aurevia Digital: cerita di balik satu pintu pembayaran digital untuk pulsa, tagihan, hingga cicilan, beserta visi dan misi kami.",
  alternates: { canonical: "/tentang" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/tentang",
    siteName: siteConfig.name,
    title: "Tentang Aurevia Digital",
    description:
      "Cerita, visi, dan misi Aurevia Digital — membangun pembayaran digital yang cepat, jelas, dan bisa dipercaya siapa pun.",
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return <About />;
}
