import Link from "next/link";
import { Icon } from "@/components/Icon";

export type Crumb = {
  label: string;
  href?: string;
};

/**
 * Breadcrumb tampil — dipasangkan dengan JSON-LD `BreadcrumbList`
 * di halaman yang sama supaya struktur hierarki terbaca mesin pencari.
 * Item terakhir (tanpa href) adalah halaman aktif.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-[12.5px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 ? (
                <Icon name="chevron" className="h-3 w-3 rotate-[-90deg] text-faint" />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-muted transition hover:text-brand-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-ink" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
