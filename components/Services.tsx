"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { CheckoutDrawer } from "@/components/CheckoutDrawer";
import type { CheckoutCategory, QrisSettings, Service } from "@/types";

type ServicesProps = {
  /** Katalog dari database (fallback data statis kalau DB kosong). */
  services: Service[];
  /** Konfigurasi kategori/produk untuk drawer checkout. */
  checkout: CheckoutCategory[];
  /** Pengaturan QRIS dari admin (null -> pakai QR contoh). */
  qris: QrisSettings | null;
};

export function Services({ services, checkout, qris }: ServicesProps) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const closeDrawer = useCallback(() => setOpenCategoryId(null), []);
  const totalItems = services.reduce((sum, service) => sum + service.items.length, 0);

  return (
    <section id="layanan" className="py-14">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow mb-2">Pilih Layanan</p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Semua Kebutuhan Pembayaran
              </h2>
              <p className="readout mt-1.5 text-[12px] text-muted">
                {services.length} kategori · {totalItems} item layanan
              </p>
            </div>
            <a href="#" className="hidden text-[13px] font-semibold text-brand-ink sm:block">
              Lihat Semua Layanan →
            </a>
          </div>
        </Reveal>

        <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <li key={service.id}>
              <Reveal delay={Math.min(index * 0.04, 0.2)} className="h-full">
                <button
                  type="button"
                  onClick={() => setOpenCategoryId(service.id)}
                  aria-label={`Pesan layanan ${service.title}`}
                  className="card h-full w-full p-5 text-left transition hover:border-line-strong hover:shadow-[0_4px_12px_rgba(28,25,23,0.08)]"
                >
                  <div className="flex items-start gap-3">
                    <span className={`tile shrink-0 text-lg ${service.tileClassName}`}>
                      <Icon name={service.icon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] leading-tight font-bold">{service.title}</p>
                      <p className="mt-1 text-[11.5px] leading-snug text-muted">
                        {service.description}
                      </p>
                    </div>
                    <Icon name="chevron" className="mt-1 h-4 w-4 shrink-0 text-faint" />
                  </div>

                  <ul className="mt-4 space-y-2 border-t border-line pt-3.5">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[12.5px] text-body">
                        <span
                          aria-hidden="true"
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[13px] font-bold transition hover:border-brand hover:text-brand-ink sm:hidden"
        >
          Lihat Semua Layanan
          <Icon name="arrow" className="h-4 w-4" />
        </a>
      </div>

      <CheckoutDrawer
        categoryId={openCategoryId}
        onClose={closeDrawer}
        checkout={checkout}
        qris={qris}
      />
    </section>
  );
}
