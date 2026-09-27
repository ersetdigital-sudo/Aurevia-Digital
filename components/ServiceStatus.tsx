import { Reveal } from "@/components/Reveal";
import { systemStateLabels, systemStatuses, type SystemState } from "@/data/status";
import { cn } from "@/lib/cn";

const stateBadge: Record<SystemState, string> = {
  operational: "bg-ok-soft text-ok-ink",
  degraded: "bg-warn-soft text-warn-ink",
  outage: "bg-bad-soft text-bad-ink",
  maintenance: "bg-info-soft text-info-ink",
};

const stateDot: Record<SystemState, string> = {
  operational: "bg-[#15803d]",
  degraded: "bg-[#b45309]",
  outage: "bg-[#b91c1c]",
  maintenance: "bg-[#0e7490]",
};

export function ServiceStatus() {
  const hasIssue = systemStatuses.some((item) => item.state !== "operational");
  const issueCount = systemStatuses.filter((item) => item.state !== "operational").length;

  return (
    <section id="status-layanan" className="pt-10 pb-6">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                Status Layanan
              </h2>
              <p className="readout mt-1.5 text-[12px] text-muted">
                Pemeriksaan otomatis tiap 60 detik · Terakhir 27 Sep 2026, 15:47 WIB
              </p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-bold",
                hasIssue ? stateBadge.degraded : stateBadge.operational,
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", hasIssue ? stateDot.degraded : stateDot.operational)} />
              {hasIssue
                ? `${issueCount} layanan berjalan terbatas`
                : "Semua sistem berjalan normal"}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="card mt-6 overflow-hidden">
            <ul>
              {systemStatuses.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-5 py-4 last:border-b-0 sm:px-6"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold">{item.name}</span>
                    <span className="mt-0.5 block text-[12px] text-muted">
                      {item.description}
                    </span>
                  </span>
                  <span className="readout hidden text-[12px] text-muted sm:block sm:w-24 sm:text-right">
                    {item.uptime}
                  </span>
                  <span className="readout hidden text-[11.5px] text-muted lg:block lg:w-24 lg:text-right">
                    {item.checked}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold",
                      stateBadge[item.state],
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", stateDot[item.state])} />
                    {systemStateLabels[item.state]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
