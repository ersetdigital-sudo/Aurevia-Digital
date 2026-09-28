import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { StructuredData } from "@/components/StructuredData";
import { termsDoc, termsMeta } from "@/data/legal";
import { heroImage, siteConfig } from "@/data/site";
import { legalStructuredData } from "@/lib/seo";

const pagePath = "/syarat-ketentuan";
const pageTitle = "Syarat & Ketentuan Aurevia Digital";
const pageDescription =
  "Syarat & Ketentuan Aurevia Digital: aturan akun, harga dan biaya, pembayaran QRIS, " +
  "status transaksi, refund, komplain, dan tanggung jawab layanan.";

export const metadata: Metadata = {
  title: termsDoc.title,
  description: pageDescription,
  alternates: { canonical: pagePath },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: pagePath,
    siteName: siteConfig.name,
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: heroImage.src,
        width: heroImage.width,
        height: heroImage.height,
        alt: heroImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [heroImage.src],
  },
  robots: { index: true, follow: true },
};

const structuredData = legalStructuredData({
  path: pagePath,
  title: pageTitle,
  description: pageDescription,
  dateModified: termsMeta.lastUpdated,
  breadcrumbLabel: termsDoc.title,
});

export default function TermsPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <LegalDocument doc={termsDoc} />
    </>
  );
}
