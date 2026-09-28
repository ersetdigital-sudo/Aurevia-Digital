import { siteConfig } from "@/data/site";

type LegalStructuredDataArgs = {
  /** Path halaman, mis. "/syarat-ketentuan" */
  path: string;
  title: string;
  description: string;
  /** Tanggal konten (YYYY-MM-DD) — ikut sitemap & meta dateModified */
  dateModified: string;
  /** Label breadcrumb sesuai teks yang tampil (default: title) */
  breadcrumbLabel?: string;
};

/**
 * JSON-LD untuk halaman legal: WebPage + BreadcrumbList yang
 * dicocokkan dengan breadcrumb visible di components/Breadcrumbs.tsx.
 */
export function legalStructuredData({
  path,
  title,
  description,
  dateModified,
  breadcrumbLabel,
}: LegalStructuredDataArgs) {
  const pageUrl = `${siteConfig.url}${path}`;
  const crumbName = breadcrumbLabel ?? title;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: "id-ID",
        dateModified,
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
            name: crumbName,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
