import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Section } from "../components/ui/Section";
import { CONTACT, SITE } from "../data/content";

export function Contact() {
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent("Hello Advaith — systems / edge / performance")}&body=${encodeURIComponent("Hi Advaith,\n\nI saw your portfolio (lab × notebook) and wanted to reach out about...\n\n—\n")}`;

  return (
    <Section
      id="contact"
      kicker={CONTACT.kicker}
      title={CONTACT.title}
      intro={CONTACT.blurb}
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left — contact card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent-amber/40 via-accent-cyan/20 to-transparent" aria-hidden />
          <div className="flex items-center gap-2 mb-5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulseGlow" aria-hidden />
            <span className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Response window · typically &lt; 24h</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">Email</div>
              <a
                href={mailto}
                className="mt-1 inline-flex items-center gap-2 font-display text-lg font-medium text-text-primary hover:text-accent-amber transition-colors break-all"
              >
                {SITE.email} <span aria-hidden>→</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-line-soft bg-ink-900/60 px-4 py-3">
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">Location</div>
                <div className="mt-1 text-sm text-text-primary">{SITE.location}</div>
                <div className="font-mono text-xs text-text-muted">{SITE.subtitle}</div>
              </div>
              <div className="rounded-xl border border-line-soft bg-ink-900/60 px-4 py-3">
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">GitHub</div>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-accent-cyan transition-colors"
                >
                  github.com/kadv19 <span aria-hidden>↗</span>
                </a>
                <div className="font-mono text-xs text-text-muted">68 tests · reproducible</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={mailto}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-amber px-6 py-3 font-mono text-xs tracking-widest uppercase text-ink-900 hover:bg-accent-amberSoft transition-colors shadow-[0_0_20px_-10px_rgba(232,184,106,0.6)] focus-visible:outline-none"
            >
              Email Advaith <span aria-hidden>→</span>
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-ink-800 px-6 py-3 font-mono text-xs tracking-widest uppercase text-text-primary hover:border-line-strong hover:bg-ink-700 transition-colors focus-visible:outline-none"
            >
              View GitHub
            </a>
          </div>

          <p className="mt-5 font-mono text-2xs leading-5 tracking-wide text-text-faint">
            Prefer email over DMs. Include workload/context if you want a measured answer — I’ll reply with scope,
            trade-offs, and what I can actually demonstrate.
          </p>
        </Card>

        {/* Right — availability / colophon */}
        <div className="space-y-6">
          <Card padding="tight">
            <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Availability</div>
            <ul className="mt-3 space-y-2.5 text-sm leading-6 text-text-secondary">
              <li className="flex gap-2.5">
                <span className="mt-2 h-px w-4 shrink-0 bg-accent-amber/50" aria-hidden />
                <span>
                  Seeking <span className="text-text-primary font-medium">internship / early-career systems roles</span>{" "}
                  — backend, performance, edge/on-device, architecture, hardware-software. Open to Bengaluru, Mysuru,
                  remote.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-px w-4 shrink-0 bg-line" aria-hidden />
                <span>Strongest in: C++/Python, systems under constraints, benchmarking, and writing the docs that make re-runs possible.</span>
              </li>
            </ul>
          </Card>

          <Card padding="tight" className="bg-ink-800/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Phase 1 · Foundation log</span>
              <Badge variant="muted">Runnable</Badge>
            </div>
            <div className="mt-3 space-y-2 font-mono text-xs leading-5 text-text-muted">
              <div className="flex justify-between">
                <span>Stack</span>
                <span className="text-text-secondary">Vite · React · TS · Tailwind · Motion · Canvas</span>
              </div>
              <div className="flex justify-between">
                <span>Heavy deps</span>
                <span className="text-emerald-300">None · no Three.js · no video</span>
              </div>
              <div className="flex justify-between">
                <span>Build</span>
                <span className="text-text-secondary">tsc -b && vite build</span>
              </div>
              <div className="flex justify-between">
                <span>Next</span>
                <span className="text-accent-amber">Phase 2 — case studies & plots</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
