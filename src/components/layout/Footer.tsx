import { SITE } from "../../data/content";

export function Footer() {
  return (
    <footer className="border-t border-line-soft bg-ink-800/30" role="contentinfo">
      <div className="mx-auto max-w-shell px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-ink-700 font-mono text-[10px] tracking-widest text-accent-amber">
                AK
              </span>
              <span className="font-display text-sm font-semibold tracking-tight text-text-primary">
                Advaith Kashyap
              </span>
              <span className="font-mono text-2xs tracking-widest uppercase text-text-muted">
                © {new Date().getFullYear()}
              </span>
            </div>
            <p className="max-w-[52ch] text-sm leading-6 text-text-muted">
              Systems-minded engineer. Built in Mysuru — measured on real hardware. Portfolio foundation
              (Phase 1) — architecture, design system, and navigation. Content continues in Phase 2.
            </p>
            <p className="font-mono text-2xs tracking-widest uppercase text-text-faint">
              Laboratory × engineering notebook · Dark-dominant · Measured, not marketed
            </p>
          </div>

          <div className="flex flex-wrap gap-10 text-sm">
            <div className="space-y-2">
              <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Contact</div>
              <a
                href={`mailto:${SITE.email}`}
                className="block text-text-secondary hover:text-accent-amber transition-colors"
              >
                {SITE.email}
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-text-secondary hover:text-accent-amber transition-colors"
              >
                github.com/kadv19 ↗
              </a>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Design</div>
              <p className="text-text-secondary">
                Space Grotesk · Inter · JetBrains Mono
              </p>
              <p className="font-mono text-xs text-text-muted">
                Tailwind · Framer Motion · Canvas
              </p>
              <p className="font-mono text-2xs tracking-widest uppercase text-text-faint">
                No heavy 3D · No glass excess · Fast
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
