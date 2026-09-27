import Image from "next/image";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { bandFeatures } from "@/data/content";
import { bandImage } from "@/data/site";

export function ValueBand() {
  return (
    <section className="pb-14">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl text-white">
            <Image
              src={bandImage.src}
              alt={bandImage.alt}
              fill
              sizes="(min-width: 1160px) 1120px, 100vw"
              className="object-cover object-center"
            />
            <div className="band-veil" />

            <div className="relative grid items-center gap-6 p-8 lg:grid-cols-[1.1fr_.7fr_.9fr] lg:p-10">
              <div>
                <p className="eyebrow mb-3 text-[#C6C9CE]">Transaksi Lebih Hemat</p>
                <h2 className="text-2xl leading-tight font-extrabold sm:text-[32px]">
                  Bayar Semua Tagihan
                  <br />
                  Kapan Saja, <span className="text-brand">Di Mana Saja</span>
                </h2>
                <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-[#C6C9CE]">
                  Dari kebutuhan harian hingga tagihan rutin, semua bisa kamu selesaikan dengan cepat
                  dan aman di Aurevia Digital.
                </p>
              </div>

              <div className="hidden justify-center lg:flex">
                <div className="w-[150px] rounded-[22px] border-4 border-[#0B0C0E] bg-white p-2.5 text-[#14161A]">
                  <p className="text-[9px] font-extrabold">Aurevia Digital</p>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-6 rounded bg-[#FFF3E9]" />
                    <div className="h-6 rounded bg-[#F3F4F6]" />
                    <div className="h-6 rounded bg-[#F3F4F6]" />
                    <div className="h-6 rounded bg-[#F3F4F6]" />
                  </div>
                  <div className="mt-2 h-6 rounded-full bg-brand" />
                </div>
              </div>

              <ul className="space-y-2.5">
                {bandFeatures.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-[13px]"
                  >
                    <span className="text-brand">
                      <Icon name={feature.icon} className="h-[18px] w-[18px]" />
                    </span>
                    {feature.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
