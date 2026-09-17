import { SECONDARY } from "../../data/projects/secondary";

export function SecondaryGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {SECONDARY.map((p) => (
        <article
          key={p.id}
          className="group rounded-xl border border-line bg-ink-800/50 p-5 md:p-6 flex flex-col hover:border-line-strong hover:bg-ink-800/70 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full border border-line bg-ink-900 px-2.5 py-1 font-mono text-2xs tracking-widest uppercase text-text-muted">
              {p.status}
            </span>
            <span className="font-mono text-2xs tracking-widest uppercase text-text-faint">{p.subtitle}</span>
          </div>

          <h3 className="mt-3 font-display text-[15px] font-semibold leading-tight text-text-primary">{p.title}</h3>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.stack.map((t) => (
              <span key={t} className="rounded-full border border-line-soft bg-ink-900/60 px-2 py-1 font-mono text-2xs tracking-wide text-text-muted">
                {t}
              </span>
            ))}
          </div>

          <p className="mt-3 text-sm leading-6 text-text-secondary">{p.summary}</p>
          <p className="mt-2 text-xs leading-5 text-text-muted">{p.detail}</p>

          <div className="mt-3 rounded-lg border border-line-soft bg-ink-900/50 px-3 py-2.5">
            <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-faint">Result</div>
            <p className="mt-1 text-xs leading-5 text-text-secondary">{p.result}</p>
          </div>

          <div className="mt-3 pt-3 border-t border-dashed border-line-soft font-mono text-2xs leading-4 text-text-faint">
            {p.ownership}
          </div>
        </article>
      ))}
    </div>
  );
}
