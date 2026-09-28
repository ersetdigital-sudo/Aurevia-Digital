type StructuredDataProps = {
  data: Record<string, unknown>;
};

/**
 * Renderer JSON-LD per halaman (schema.org).
 * Dipakai untuk structured data yang spesifik satu halaman — mis. breadcrumb
 * dan WebPage — supaya terpisah dari graph global di `components/JsonLd.tsx`.
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
