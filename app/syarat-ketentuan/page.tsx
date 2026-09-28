import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { Terms } from "@/components/Terms";
import { termsMeta } from "@/data/legal";
import { heroImage, siteConfig } from "@/data/site";

const pagePath = "/syarat-ketentuan";
const pageUrl = `${siteConfig.url}${pagePath}`;
const pageTitle = "Syarat & Ketentuan Aurevia Digital";
const pageDescription =
  "Syarat & Ketentuan Aurevia Digital: aturan akun, harga dan biaya, pembayaran QRIS, " +
  "status transaksi, refund, komplain, dan tanggung jawab layanan.";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: pageTitle,
      description: pageDescription,
      inLanguage: "id-ID",
      dateModified: termsMeta.lastUpdated,
      isPartOf: { "@id": `${siteConfig.url}#website` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${siteConfig.url}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Syarat & Ketentuan",
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <Terms />
    </>
  );
}
