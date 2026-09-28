import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { contactChannels } from "@/data/help";

export function ContactBand() {
  return (
    <section id="kontak" className="py-14">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-[#1c1917] px-6 py-9 text-[#faf6f0] sm:px-9 dark:border dark:border-white/10 lg:px-11 lg:py-11">
            <div className="lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
              <div>
                <p className="readout text-[11px] tracking-[0.14em] text-[#a8a29e] uppercase">
                  Dukungan Aurevia Digital · Senin–Minggu · 07.00–23.00 WIB
                </p>
                <h2 className="font-display mt-3 text-2xl leading-tight font-semibold tracking-[-0.02em] sm:text-3xl">
                  Belum ketemu jawabannya?
                </h2>
                <p className="mt-3 max-w-[46ch] text-[13px] leading-relaxed text-[#d6d3d1]">
                  Tim kami aktif setiap hari. Sertakan nomor referensi transaksi agar
                  penelusuran tidak perlu bolak-balik.
                </p>

                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                  <div>
                    <dt className="text-[11px] text-[#a8a29e]">Rata-rata balas chat</dt>
                    <dd className="readout text-lg font-semibold">&lt; 5 menit</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#a8a29e]">Jam layanan</dt>
                    <dd className="readout text-lg font-semibold">07.00–23.00</dd>
                  </div>
                </dl>
              </div>

              <ul className="mt-8 space-y-3 lg:mt-0">
                {contactChannels.map((channel) => (
                  <li key={channel.id}>
                    <a
                      href={channel.href}
                      className="group flex items-start gap-4 rounded-xl border border-white/15 bg-white/8 px-4 py-4 transition hover:border-brand/60 hover:bg-white/12"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                        <Icon name={channel.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[13px] font-bold">{channel.title}</span>
                          <span className="readout text-[13px] text-[#fdba74]">{channel.value}</span>
                        </span>
                        <span className="mt-1 block text-[12px] leading-relaxed text-[#d6d3d1]">
                          {channel.description}
                        </span>
                      </span>
                      <span className="mt-2 hidden shrink-0 items-center gap-1.5 text-[12px] font-bold text-white transition group-hover:text-[#fdba74] sm:flex">
                        {channel.action}
                        <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="card mt-4 p-5 sm:p-7">
            <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">
              Kirim pesan ke tim kami
            </h3>
            <p className="mt-1.5 max-w-[62ch] text-[13px] leading-relaxed text-body">
              Balasan dikirim ke email atau WhatsApp yang kamu isi. Untuk kendala transaksi,
              sertakan nomor referensi agar tidak perlu bolak-balik.
            </p>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
