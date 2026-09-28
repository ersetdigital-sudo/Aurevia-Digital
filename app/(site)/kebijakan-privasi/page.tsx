import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { StructuredData } from "@/components/StructuredData";
import { privacyDoc, privacyMeta } from "@/data/legal";
import { heroImage, siteConfig } from "@/data/site";
import { legalStructuredData } from "@/lib/seo";

const pagePath = "/kebijakan-privasi";
const pageTitle = "Kebijakan Privasi Aurevia Digital";
const pageDescription =
  "Kebijakan Privasi Aurevia Digital: data apa yang kami kumpulkan saat transaksi, cara " +
  "penggunaannya, penyimpanan di peramban, berbagi data dengan penyedia, dan hak kamu atas data.";

export const metadata: Metadata = {
  title: privacyDoc.title,
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
  dateModified: privacyMeta.lastUpdated,
  breadcrumbLabel: privacyDoc.title,
});

export default function PrivacyPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <LegalDocument doc={privacyDoc} />
    </>
  );
}
