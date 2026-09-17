import { motion, useReducedMotion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Section } from "../components/ui/Section";
import { QUANTUM } from "../data/content";

export function Quantum() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="quantum"
      indexLabel="05 / SUBSTRATE"
      annotation="Future computing — BIT → QUANTUM STATE · honest scope"
      kicker={QUANTUM.kicker}
      title={QUANTUM.title}
      intro={QUANTUM.intro}
      muted
    >
      {/* Ladder: BIT → TRANSISTOR → PROCESSOR → PARALLEL → QUANTUM */}
      <div className="mb-8 rounded-xl border border-line bg-ink-800/40 p-4 md:p-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <span className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-violet">Conceptual ladder — classical → quantum</span>
          <span className="font-mono text-2xs tracking-widest uppercase text-text-faint hidden sm:inline">
            Accurate but concise · no production claims
          </span>
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden lg:block">
          <div className="relative flex items-stretch gap-3">
            {/* rail */}
            <div className="absolute left-0 right-0 top-[26px] h-px bg-gradient-to-r from-text-muted/60 via-accent-amber/30 to-accent-violet/40" aria-hidden />
            {QUANTUM.ladder.map((step, i) => (
              <motion.div
                key={step.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.32, 0.72, 0, 1] }}
                className={`flex-1 relative rounded-xl border p-4 flex flex-col ${
                  step.status === "exploring"
                    ? "border-dashed border-violet-900/40 bg-violet-950/10"
                    : "border-line bg-ink-900/70"
                }`}
              >
                {/* node */}
                <span
                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border font-mono text-2xs font-medium ${
                    step.status === "exploring"
                      ? "bg-transparent text-accent-violet border-accent-violet/30 border-dashed"
                      : "bg-accent-amber text-ink-900 border-amber-600/20"
                  }`}
                  aria-hidden
                >
                  {String(i + 1)}
                </span>
                {/* arrow */}
                {i < QUANTUM.ladder.length - 1 && (
                  <span className="absolute -right-2 top-[26px] font-mono text-2xs text-text-faint" aria-hidden>
                    →
                  </span>
                )}

                <div className="mt-3 text-center">
                  <div
                    className={`font-display text-xs font-semibold tracking-[0.08em] uppercase ${
                      step.status === "exploring" ? "text-accent-violet" : "text-text-primary"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="mt-1 font-mono text-2xs tracking-widest uppercase text-text-muted">{step.sub}</div>
                  <p className="mt-2 text-xs leading-5 text-text-secondary">{step.detail}</p>
                  <span
                    className={`mt-3 inline-flex rounded-full border px-2 py-0.5 font-mono text-2xs tracking-widest uppercase ${
                      step.status === "exploring"
                        ? "border-violet-900/30 bg-violet-950/15 text-accent-violet border-dashed"
                        : "border-line bg-ink-800 text-text-muted"
                    }`}
                  >
                    {step.status === "exploring" ? "exploring" : "built — measured"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <ol className="lg:hidden space-y-3" role="list">
          {QUANTUM.ladder.map((step, i) => (
            <li key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-2xs ${
                    step.status === "exploring"
                      ? "bg-transparent text-accent-violet border-accent-violet/30 border-dashed"
                      : "bg-accent-amber text-ink-900 border-amber-600/20"
                  }`}
                  aria-hidden
                >
                  {String(i + 1)}
                </span>
                {i < QUANTUM.ladder.length - 1 && <span className="mt-1 h-8 w-px bg-line-soft" aria-hidden />}
              </div>
              <div className={`flex-1 rounded-xl border p-3.5 ${step.status === "exploring" ? "border-dashed border-violet-900/40 bg-violet-950/10" : "border-line bg-ink-900/60"}`}>
                <div className={`font-display text-xs font-semibold tracking-wide uppercase ${step.status === "exploring" ? "text-accent-violet" : "text-text-primary"}`}>
                  {step.label} <span className="font-mono text-2xs tracking-widest text-text-faint">· {step.sub}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-text-secondary">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="relative overflow-hidden" padding="none">
          <div
            className="absolute inset-0 opacity-[0.03]"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(rgba(139,124,248,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(139,124,248,0.8) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative p-6 md:p-7">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-accent-violet shadow-[0_0_10px_rgba(139,124,248,0.6)]" aria-hidden />
              <span className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-violet">Foundational · honest scope</span>
            </div>
            <ul className="space-y-3">
              {QUANTUM.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-6 text-text-secondary">
                  <span className="mt-2 h-px w-5 shrink-0 bg-accent-violet/40" aria-hidden />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-amber-900/30 bg-amber-950/20 px-3.5 py-3 flex gap-3">
              <span className="mt-0.5 text-amber-400" aria-hidden>
                ⚐
              </span>
              <p className="text-xs leading-5 text-amber-100/80">{QUANTUM.disclaimer}</p>
            </div>
          </div>
        </Card>

        {/* Bloch sphere visualization — unchanged but kept distinctive */}
        <Card padding="none" className="overflow-hidden flex flex-col">
          <div className="px-6 pt-6">
            <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Visualization — Bloch sphere (abstract)</div>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Not a simulator — a visual anchor for the direction. From deterministic bits to probabilistic state vectors,
              from pipelines to superposition. Hardware-aware computing, extended.
            </p>
          </div>

          <div className="relative mt-6 flex-1 min-h-[240px] bg-ink-900/60 border-y border-line-soft overflow-hidden flex items-center justify-center p-6">
            <svg
              viewBox="0 0 320 220"
              className="w-full max-w-[360px] h-auto"
              role="img"
              aria-label="Abstract Bloch sphere with equatorial and meridional traces, and a state vector."
            >
              <defs>
                <radialGradient id="qg2" cx="50%" cy="40%">
                  <stop offset="0%" stopColor="#8B7CF8" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#8B7CF8" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="ql2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B7CF8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3DD2CC" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <circle cx="160" cy="110" r="78" fill="url(#qg2)" stroke="#1E2E4A" strokeWidth="1.2" />
              <ellipse cx="160" cy="110" rx="78" ry="28" fill="none" stroke="rgba(139,124,248,0.35)" strokeWidth="1" />
              <ellipse cx="160" cy="110" rx="78" ry="28" fill="none" stroke="rgba(139,124,248,0.15)" strokeWidth="8" />
              <ellipse cx="160" cy="110" rx="28" ry="78" fill="none" stroke="rgba(61,210,204,0.25)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="160" y1="22" x2="160" y2="198" stroke="#2A3F63" strokeWidth="0.8" strokeDasharray="3 4" />
              <line x1="72" y1="110" x2="248" y2="110" stroke="#2A3F63" strokeWidth="0.8" strokeDasharray="3 4" />
              <line x1="160" y1="110" x2="205" y2="58" stroke="url(#ql2)" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="205" cy="58" r="4.5" fill="#E8B86A" stroke="#090D14" strokeWidth="1.2" />
              <circle cx="205" cy="58" r="10" fill="none" stroke="rgba(232,184,106,0.25)" strokeWidth="1" />
              <text x="160" y="18" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" letterSpacing="0.12em" fill="#4A5875">
                |0⟩
              </text>
              <text x="160" y="208" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" letterSpacing="0.12em" fill="#4A5875">
                |1⟩
              </text>
              <text x="205" y="48" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="0.08em" fill="#E8B86A">
                |ψ⟩
              </text>
            </svg>

            <div className="absolute right-3 bottom-3 font-mono text-2xs tracking-widest uppercase text-text-faint">SVG · no WebGL · fast</div>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <span className="font-mono text-2xs tracking-widest uppercase text-text-faint">
              Longer arc → semiconductor & hardware systems
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent-violet animate-pulseGlow" aria-hidden />
          </div>
        </Card>
      </div>
    </Section>
  );
}
