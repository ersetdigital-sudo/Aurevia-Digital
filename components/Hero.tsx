import Image from "next/image";
import { Icon } from "@/components/Icon";
import { HeroSearchForm } from "@/components/HeroSearchForm";
import { heroFeatures } from "@/data/content";
import { heroImage } from "@/data/site";
import { cn } from "@/lib/cn";

export function Hero() {
  return (
    <section id="beranda" className="hero relative overflow-hidden border-b border-line">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[15%_50%] lg:object-right"
      />
      <div className="hero-veil" />

      <div className="wrap relative pt-14 pb-12 lg:pt-16 lg:pb-14">
        <div className="relative z-10 lg:max-w-[600px]">
          <p className="eyebrow mb-5">Semua Pembayaran, Satu Tempat</p>

          <h1 className="text-4xl leading-[1.03] font-extrabold tracking-tight sm:text-5xl lg:text-[60px]">
            Bayar Tagihan
            <br />
            Lebih{" "}
            <span className="relative text-brand">
              Mudah
              <svg
                className="absolute -bottom-3 left-0 w-[105%]"
                height="16"
                viewBox="0 0 200 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 10.5C48 3.5 152 3 197 8.5"
                  stroke="#F97316"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-body">
            Pulsa, paket data, listrik, air, internet, BPJS, e-wallet hingga multifinance.
            <br />
            Transaksi cepat, aman, dan terpercaya.
          </p>

          <HeroSearchForm />

          <ul className="mt-9 grid grid-cols-2 gap-y-5 sm:grid-cols-4">
            {heroFeatures.map((feature, index) => (
              <li
                key={feature.title}
                className={cn(
                  "flex items-start gap-2.5",
                  index === 0
                    ? "sm:pr-5"
                    : "sm:border-l sm:border-line-strong sm:px-5",
                )}
              >
                <span className="mt-0.5 text-brand">
                  <Icon name={feature.icon} className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-[13px] leading-tight font-bold">{feature.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
