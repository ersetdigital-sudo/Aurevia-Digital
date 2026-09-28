import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { termsIntro, termsMeta, termsSections } from "@/data/legal";

function number(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function Terms() {
  return (
    <>
      <section className="border-b border-line bg-surface-2">
        <div className="wrap pt-11 pb-10 lg:pt-14">
          <Breadcrumbs
            items={[
              { label: "Beranda", href: "/" },
              { label: "Syarat & Ketentuan" },
            ]}
          />
          <p className="eyebrow flex items-center gap-1.5">
            <LogoMark className="h-4 w-4" />
            Legal
          </p>
          <h1 className="font-display mt-3 max-w-[16ch] text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.02em]">
            Syarat &amp; Ketentuan
          </h1>
          <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-body">{termsIntro}</p>
          <p className="readout mt-5 text-[11px] tracking-[0.12em] text-muted uppercase">
            Berlaku sejak {termsMeta.effectiveDate} · Versi {termsMeta.version}
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <p className="readout text-[11px] tracking-[0.14em] text-muted uppercase">
                Daftar Isi
              </p>
              <ol className="mt-3 space-y-1.5">
                {termsSections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-2.5 text-[13px] leading-snug text-body transition hover:text-brand-ink"
                    >
                      <span className="readout text-faint">{number(index)}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-line-strong bg-surface-3 p-5">
              <p className="text-[13px] leading-relaxed text-body">
                Ada pertanyaan soal ketentuan ini? Tim kami siap membantu setiap hari
                07.00–23.00 WIB.
              </p>
              <Link
                href="/bantuan"
                className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold text-brand-ink transition hover:underline"
              >
                Pusat Bantuan
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <div className="max-w-[72ch]">
            <ul className="space-y-10">
              {termsSections.map((section, index) => (
                <li key={section.id} id={section.id} className="scroll-mt-24">
                  <Reveal>
                    <p className="readout text-[11px] tracking-[0.14em] text-faint uppercase">
                      Bab {number(index)}
                    </p>
                    <h2 className="font-display mt-1.5 text-xl leading-tight font-semibold tracking-[-0.01em] sm:text-2xl">
                      {section.title}
                    </h2>

                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="mt-3.5 text-[15px] leading-relaxed text-body">
                        {paragraph}
                      </p>
                    ))}

                    {section.items?.length ? (
                      <ul className="mt-4 space-y-2.5">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-[14px] text-body">
                            <span
                              aria-hidden="true"
                              className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-accent"
                            />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="max-w-[54ch] text-[13px] leading-relaxed text-body">
              Dengan menggunakan Aurevia Digital, kamu menyetujui seluruh ketentuan di atas.
              Terima kasih sudah mempercayakan pembayaran harianmu kepada kami.
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
