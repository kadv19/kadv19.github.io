export function ProjectHero({
  category,
  title,
  thesis,
  badges = [],
  actions,
  visual,
  indexLabel,
}: {
  category: string;
  title: string;
  thesis: string;
  badges?: { label: string; tone?: "amber" | "cyan" | "muted" }[];
  actions?: React.ReactNode;
  visual?: React.ReactNode;
  indexLabel?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line-soft bg-ink-900">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-900/40" aria-hidden />
      <div className="relative mx-auto max-w-shell px-6 lg:px-8 pt-24 md:pt-28 pb-10 md:pb-12">
        {indexLabel && (
          <div className="mb-6 flex items-center gap-3 border-b border-dashed border-line-soft pb-3">
            <span className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">{indexLabel}</span>
            <span className="h-3 w-px bg-line" aria-hidden />
            <span className="font-mono text-2xs tracking-[0.14em] uppercase text-text-faint">Flagship · case study</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div>
            <div className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">{category}</div>
            <h1 className="mt-2 font-display text-3xl md:text-[2.6rem] lg:text-[2.9rem] font-semibold leading-[0.95] tracking-tight text-text-primary text-balance">
              {title}
            </h1>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-text-secondary max-w-[60ch] text-pretty">
              {thesis}
            </p>

            {badges.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span
                    key={b.label}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-2xs tracking-widest uppercase ${
                      b.tone === "amber"
                        ? "border-amber-900/30 bg-amber-950/25 text-accent-amber"
                        : b.tone === "cyan"
                          ? "border-cyan-900/30 bg-cyan-950/15 text-accent-cyan"
                          : "border-line bg-ink-800 text-text-muted"
                    }`}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            )}

            {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          </div>

          {visual && <div className="min-w-0">{visual}</div>}
        </div>
      </div>
    </header>
  );
}
