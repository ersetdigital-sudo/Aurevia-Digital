import type { Metadata } from "next";
import { Terms } from "@/components/Terms";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Baca Syarat & Ketentuan Aurevia Digital: aturan akun, harga dan biaya, pembayaran QRIS, proses transaksi, refund, komplain, serta pembatasan tanggung jawab layanan.",
  alternates: { canonical: "/syarat-ketentuan" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/syarat-ketentuan",
    siteName: siteConfig.name,
    title: "Syarat & Ketentuan Aurevia Digital",
    description:
      "Ketentuan penggunaan layanan Aurevia Digital — dari pendaftaran, pembayaran, hingga penyelesaian komplain.",
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <Terms />;
}
