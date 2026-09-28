import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { StatusChecker } from "@/components/StatusChecker";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Cek Status Transaksi",
  description:
    "Lacak status transaksi Aurevia Digital dengan nomor referensi AD-XXXXXX: lihat tahapan, nominal, dan waktu pembaruan terakhirnya secara real-time.",
  alternates: { canonical: "/status" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/status",
    siteName: siteConfig.name,
    title: "Cek Status Transaksi Aurevia Digital",
    description:
      "Lacak tahapan transaksi Aurevia Digital hanya dengan nomor referensi AD-XXXXXX.",
  },
  robots: { index: true, follow: true },
};

export default function StatusPage() {
  return (
    <>
      <StatusChecker />

      <section className="py-10 sm:py-12">
        <div className="wrap">
          <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
                <Icon name="chat" className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[14.5px] font-extrabold">
                  Status tidak berubah setelah 10 menit?
                </p>
                <p className="mt-1 max-w-[54ch] text-[13px] leading-relaxed text-body">
                  Sertakan nomor referensi saat menghubungi kami agar penelusuran tidak perlu
                  bolak-balik.
                </p>
              </div>
            </div>

            <Link
              href="/bantuan"
              className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-line-strong px-5 text-[13px] font-bold transition hover:border-brand hover:text-brand-ink"
            >
              Pusat Bantuan
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
