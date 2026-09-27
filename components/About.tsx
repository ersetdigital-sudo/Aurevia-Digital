import Link from "next/link";
import { Icon } from "@/components/Icon";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";

const missionItems = [
  {
    icon: "bolt",
    title: "Sederhanakan pembayaran harian",
    description:
      "Satu alur checkout empat langkah untuk pulsa, tagihan, hingga cicilan — tanpa perlu berpindah aplikasi.",
  },
  {
    icon: "search",
    title: "Jaga transparansi",
    description:
      "Setiap transaksi punya nomor invoice sendiri, statusnya bisa dicek kapan saja tanpa perlu bertanya.",
  },
  {
    icon: "chat",
    title: "Dampingi dengan manusia",
    description:
      "Tim kami siap dihubungi setiap hari lewat WhatsApp dan email kalau ada yang perlu dibantu.",
  },
] as const;

export function About() {
  return (
    <>
      <section className="border-b border-line bg-surface-2">
        <div className="wrap pt-11 pb-10 lg:pt-14">
          <p className="eyebrow flex items-center gap-1.5">
            <LogoMark className="h-4 w-4" />
            Tentang Kami
          </p>
          <h1 className="font-display mt-3 max-w-[16ch] text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.02em]">
            Bayar apa pun, tanpa ribet.
          </h1>
          <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-body">
            Aurevia Digital lahir dari satu keluhan sederhana: membayar tagihan seharusnya tidak
            memakan waktu lebih lama daripada transaksi itu sendiri.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap grid gap-8 lg:grid-cols-[0.75fr_1.35fr]">
          <div>
            <p className="readout text-[11px] tracking-[0.14em] text-muted uppercase">
              Cerita Kami
            </p>
            <h2 className="font-display mt-3 text-2xl leading-tight font-semibold tracking-[-0.02em] sm:text-3xl">
              Dari banyak aplikasi, satu pintu pembayaran
            </h2>
          </div>
          <div className="max-w-[68ch] space-y-4 text-[15px] leading-relaxed text-body">
            <p>
              Setiap hari orang mengisi ulang pulsa, membeli token listrik, membayar air,
              internet, BPJS, sampai cicilan — sering kali lewat banyak aplikasi yang
              berbeda dan tidak ada yang benar-benar cepat. Aurevia Digital menyatukan semuanya
              dalam satu tempat: pilih layanan, periksa ringkasan, bayar lewat QRIS, lalu
              pantau statusnya.
            </p>
            <p>
              Kami membangun Aurevia Digital di sekitar transparansi. Setiap transaksi mendapat
              nomor invoice sendiri dengan format <span className="readout">AD-XXXXXX</span>
              , statusnya bisa dicek kapan saja lewat halaman Cek Status, dan pembayaran
              baru dinyatakan selesai setelah dikonfirmasi tim kami. Tidak ada transaksi
              yang menghilang begitu saja.
            </p>
            <p>
              Di belakang layar, prosesnya sengaja kami buat tetap sederhana: satu pintu
              pembayaran QRIS, pengecekan nomor otomatis, dan dukungan harian 07.00–23.00
              WIB untuk pengguna maupun merchant yang bekerja sama.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="wrap grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card flex h-full flex-col p-7">
              <p className="readout text-[11px] tracking-[0.14em] text-muted uppercase">
                Visi
              </p>
              <span className="mt-4 text-2xl text-brand">
                <Icon name="globe" />
              </span>
              <p className="font-display mt-4 text-xl leading-snug font-semibold tracking-[-0.01em] sm:text-2xl">
                Menjadi pintu pembayaran digital yang bisa dipercaya siapa pun — cepat saat
                dibutuhkan, jelas saat ditelusuri, aman tanpa terkecuali.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card flex h-full flex-col p-7">
              <p className="readout text-[11px] tracking-[0.14em] text-muted uppercase">
                Misi
              </p>
              <ul className="mt-5 space-y-5">
                {missionItems.map((item) => (
                  <li key={item.title} className="flex gap-3.5">
                    <span className="mt-0.5 shrink-0 text-brand">
                      <Icon name={item.icon} />
                    </span>
                    <div>
                      <p className="text-[15px] font-bold">{item.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-14">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="max-w-[54ch] text-[13px] leading-relaxed text-body">
              Ada pertanyaan soal Aurevia Digital atau ingin bermitra? Tim kami senang mendengar
              dari kamu.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[13px] font-bold transition hover:border-brand hover:text-brand-ink"
              >
                Beranda
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link
                href="/bantuan"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[13px] font-bold transition hover:border-brand hover:text-brand-ink"
              >
                Pusat Bantuan
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
