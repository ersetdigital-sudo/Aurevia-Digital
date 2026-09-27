import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { steps } from "@/data/content";

export function HowItWorks() {
  return (
    <section id="cara-transaksi" className="pb-14">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow mb-2">Cara Kerja</p>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">3 Langkah Mudah</h2>
        </Reveal>

        <ol className="mt-7 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.08} className="h-full">
                <div className="card flex h-full items-start gap-4 p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-extrabold text-brand">
                    {index + 1}
                  </span>
                  <div className="flex items-start gap-3">
                    <span className="text-xl text-brand">
                      <Icon name={step.icon} />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold">{step.title}</p>
                      <p className="mt-1 text-[12px] text-muted">{step.description}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
