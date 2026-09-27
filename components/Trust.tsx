import { Icon } from "@/components/Icon";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { stats } from "@/data/content";

export function Trust() {
  return (
    <section id="tentang" className="pb-16">
      <div className="wrap">
        <Reveal>
          <div className="card grid items-center gap-8 p-7 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow mb-2 flex items-center gap-1.5">
                <LogoMark className="h-4 w-4" />
                Aurevia Digital
              </p>
              <h3 className="text-xl leading-tight font-extrabold sm:text-2xl">
                Dipercaya
                <br />
                Ribuan Pengguna
              </h3>
              <p className="mt-3 max-w-xs text-[12px] text-muted">
                Transaksi aman, cepat, dan mendukung segala kebutuhan pembayaran kamu.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <li key={stat.label} className="flex items-center gap-3">
                  <span className="text-xl text-brand">
                    <Icon name={stat.icon} />
                  </span>
                  <div>
                    <p className="text-2xl font-extrabold">{stat.value}</p>
                    <p className="text-[12px] text-muted">{stat.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
