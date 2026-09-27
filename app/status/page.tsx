import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { ServiceStatus } from "@/components/ServiceStatus";
import { StatusChecker } from "@/components/StatusChecker";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Cek Status Transaksi",
  description:
    "Lacak status transaksi Aurevia Digital dengan nomor referensi AD-XXXXXX dan pantau kondisi terkini seluruh sistem pembayaran secara real-time.",
  alternates: { canonical: "/status" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/status",
    siteName: siteConfig.name,
    title: "Cek Status Transaksi Aurevia Digital",
    description:
      "Lacak tahapan transaksi dan kondisi sistem Aurevia Digital hanya dengan nomor referensi.",
  },
  robots: { index: true, follow: true },
};

export default function StatusPage() {
  return (
    <>
      <StatusChecker />
      <ServiceStatus />

      <section className="pb-14 pt-4">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="max-w-[54ch] text-[13px] leading-relaxed text-body">
              Status tidak berubah juga setelah 10 menit? Sertakan nomor referensi saat
              menghubungi kami agar penelusuran lebih cepat.
            </p>
            <a
              href="/bantuan"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[13px] font-bold transition hover:border-brand hover:text-brand-ink"
            >
              Pusat Bantuan
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
