import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { helpTopics } from "@/data/help";
import { cn } from "@/lib/cn";

type HelpTopicsProps = {
  active: string | null;
  onSelect: (topicId: string | null) => void;
};

export function HelpTopics({ active, onSelect }: HelpTopicsProps) {
  const totalArticles = helpTopics.reduce((sum, topic) => sum + topic.count, 0);

  return (
    <section id="topik" className="pt-12 pb-4">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                Jelajahi Topik
              </h2>
              <p className="readout mt-1.5 text-[12px] text-muted">
                {helpTopics.length} kategori · {totalArticles} artikel panduan
              </p>
            </div>
            {active ? (
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="text-[13px] font-semibold text-accent transition hover:text-brand-ink"
              >
                Tampilkan semua topik
              </button>
            ) : null}
          </div>
        </Reveal>

        <ul className="mt-6 border-t border-line">
          {helpTopics.map((topic, index) => {
            const isActive = active === topic.id;

            return (
              <Reveal key={topic.id} delay={Math.min(index * 0.04, 0.16)}>
                <li className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => onSelect(isActive ? null : topic.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "group flex w-full items-center gap-4 px-2 py-4 text-left transition sm:px-3",
                      isActive ? "bg-brand-soft" : "hover:bg-surface-2",
                    )}
                  >
                    <span
                      className={cn(
                        "tile shrink-0 transition",
                        isActive ? "bg-brand text-white" : "bg-accent-soft text-accent",
                      )}
                    >
                      <Icon name={topic.icon} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[14px] font-bold",
                          isActive ? "text-brand-ink" : "text-ink",
                        )}
                      >
                        {topic.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-muted">
                        {topic.description}
                      </span>
                    </span>
                    <span className="readout hidden text-[12px] text-muted sm:block">
                      {topic.count} artikel
                    </span>
                    <span
                      className={cn(
                        "text-muted transition group-hover:translate-x-1 group-hover:text-brand-ink",
                        isActive && "text-brand-ink",
                      )}
                    >
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </button>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
