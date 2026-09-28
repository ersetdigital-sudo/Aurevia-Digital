import { Icon } from "@/components/Icon";
import { LogoMark } from "@/components/Logo";
import { services } from "@/data/content";

/**
 * Mockup HP untuk hero — digambar penuh pakai CSS/JSX (bukan gambar),
 * jadi brand-nya selalu "Aurevia Digital" dan bisa diubah dari kode.
 * Menggantikan foto mockup lama yang masih memuat brand NeoPay.
 * Bersifat dekoratif: aria-hidden, tidak bisa di-interaksi.
 */

const shortLabel: Record<string, string> = {
  pulsa: "Pulsa",
  pln: "PLN",
  "paket-data": "Paket Data",
  pdam: "PDAM",
  bpjs: "BPJS",
  internet: "Internet",
  "e-wallet": "E-Wallet",
  multifinance: "Multifinance",
};

/** Ambil warna teks dari token layanan (mis. `text-[#2563EB]`) untuk ikon di layar gelap. */
function iconColor(tileClassName: string) {
  return /text-\[#[0-9a-fA-F]{6}\]/.exec(tileClassName)?.[0] ?? "text-white";
}

export function HeroMockup() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] hidden lg:block">
      <div className="absolute top-10 right-[4%] xl:top-12 xl:right-[5%]">
        {/* Catatan tulis tangan + panah, gaya sama seperti mockup sebelumnya */}
        <div className="absolute -top-2 -left-[168px] hidden w-[150px] -rotate-6 text-right xl:block">
          <p className="font-display text-[18px] leading-[1.25] font-semibold italic text-ink">
            Lebih Mudah
            <br />
            Lebih Cepat
            <br />
            Untuk Kamu
          </p>
          <svg
            className="mt-1 ml-auto h-10 w-24 text-ink"
            viewBox="0 0 96 44"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6c26 2 46 12 58 26"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="m55 33 10 3 1-11"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Badan HP */}
        <div className="w-[300px] -rotate-2 rounded-[38px] bg-[#0A0B0F] p-[9px] shadow-[0_40px_80px_-28px_rgba(28,25,23,0.65)] ring-1 ring-white/10">
          <div className="overflow-hidden rounded-[30px] bg-[#111318] pb-4">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] font-bold text-white/90">
              <span className="readout">9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="flex items-end gap-[2px]" aria-hidden="true">
                  <span className="h-1 w-[3px] rounded-sm bg-white/80" />
                  <span className="h-1.5 w-[3px] rounded-sm bg-white/80" />
                  <span className="h-2 w-[3px] rounded-sm bg-white/80" />
                  <span className="h-2.5 w-[3px] rounded-sm bg-white/40" />
                </span>
                <Icon name="wifi" className="h-3 w-3 text-white/80" />
                <span className="flex h-3 w-6 items-center rounded-[3px] bg-white/80 p-[2px]">
                  <span className="h-full w-3/4 rounded-[1px] bg-[#111318]" />
                </span>
              </div>
            </div>

            {/* Brand */}
            <div className="flex items-center gap-2 px-5 pt-2">
              <LogoMark className="h-5 w-5" />
              <span className="text-[13px] font-extrabold tracking-tight text-white">
                Aurevia Digital
              </span>
              <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.07] text-white/70">
                <Icon name="bell" className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Sapaan */}
            <div className="px-5 pt-3">
              <p className="text-[15px] leading-tight font-extrabold text-white">Selamat datang!</p>
              <p className="mt-0.5 text-[10.5px] text-white/55">
                Semua pembayaran jadi lebih mudah
              </p>
            </div>

            {/* Pencarian */}
            <div className="mx-5 mt-3 flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-2.5 text-[11px] text-white/45 ring-1 ring-white/10">
              <Icon name="search" className="h-3.5 w-3.5" />
              Cari layanan…
            </div>

            {/* Grid layanan */}
            <div className="mx-5 mt-4 grid grid-cols-4 gap-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-white/[0.05] py-2.5 ring-1 ring-white/[0.06]"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] ${iconColor(service.tileClassName)}`}
                  >
                    <Icon name={service.icon} className="h-4 w-4" />
                  </span>
                  <span className="text-[8.5px] leading-none font-semibold text-white/70">
                    {shortLabel[service.id] ?? service.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="mx-5 mt-4 flex items-center justify-between">
              <p className="text-[11.5px] font-bold text-white">Promo Spesial</p>
              <span className="text-[9px] font-semibold text-white/40">Lihat Semua</span>
            </div>

            <div className="mx-5 mt-2 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#F97316] p-3.5 text-white shadow-[0_12px_24px_-12px_rgba(234,88,12,0.8)]">
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/25">
                  <Icon name="bolt" className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11.5px] leading-tight font-extrabold">
                    Transaksi Hemat Setiap Hari
                  </p>
                  <p className="mt-0.5 text-[9px] text-white/85">
                    Harga terbaik untuk semua layanan
                  </p>
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-white/25" />
          </div>
        </div>
      </div>
    </div>
  );
}
