import { motion, useReducedMotion } from "framer-motion";
import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { JOURNEY, JOURNEY_DIRECTION } from "../data/content";

export function Journey() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="journey"
      indexLabel="03 / DIRECTION"
      annotation="Technical journey — SOFTWARE → QUANTUM / HARDWARE"
      kicker="Journey · Where the Trajectory Points"
      title="Software taught me to build. Systems taught me what to measure."
      intro="A direction, not a claim that the later stages are already achieved. Each arrow shows what was probed, what was shipped, and what remains foundational."
    >
      {/* Top — directional map: SOFTWARE → ... → QUANTUM/HARDWARE */}
      <div className="mb-10 rounded-xl border border-line bg-ink-800/40 p-4 md:p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">
            Direction of travel
          </span>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono text-2xs tracking-widest uppercase text-text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden /> built
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan ml-2" aria-hidden /> building
            <span className="h-1.5 w-1.5 rounded-full bg-accent-violet ml-2" aria-hidden /> exploring
          </span>
        </div>

        {/* Desktop: horizontal rail */}
        <div className="hidden lg:block">
          <div className="relative flex items-stretch gap-0">
            {/* continuous rail */}
            <div className="absolute left-0 right-0 top-[18px] h-px bg-gradient-to-r from-emerald-400/40 via-accent-cyan/30 to-accent-violet/25" aria-hidden />
            {JOURNEY_DIRECTION.map((step, i) => (
              <div key={step.id} className="flex-1 relative flex flex-col items-center">
                {/* node */}
                <span
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-2xs font-mono font-medium ${
                    step.status === "built"
                      ? "bg-emerald-500 text-ink-900 border-emerald-600/20"
                      : step.status === "building"
                        ? "bg-ink-700 text-accent-cyan border-accent-cyan/30"
                        : "bg-transparent text-accent-violet border-violet-900/30 border-dashed"
                  }`}
                  aria-hidden
                >
                  {String(i + 1)}
                </span>
                {/* arrow */}
                {i < JOURNEY_DIRECTION.length - 1 && (
                  <span
                    className={`absolute -right-2 top-[18px] font-mono text-2xs ${
                      step.status === "exploring" ? "text-accent-violet/50" : "text-text-faint"
                    }`}
                    aria-hidden
                  >
                    →
                  </span>
                )}
                <div className="mt-3 text-center px-2">
                  <div
                    className={`font-mono text-2xs tracking-[0.12em] uppercase ${
                      step.status === "exploring" ? "text-accent-violet" : step.status === "building" ? "text-accent-cyan" : "text-text-primary"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="mt-1 font-mono text-[10px] leading-3 text-text-muted">{step.note}</div>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-2 py-0.5 font-mono text-2xs tracking-widest uppercase ${
                      step.status === "built"
                        ? "border-emerald-900/30 bg-emerald-950/20 text-emerald-300"
                        : step.status === "building"
                          ? "border-cyan-900/30 bg-cyan-950/15 text-accent-cyan"
                          : "border-violet-900/30 bg-violet-950/20 text-accent-violet border-dashed"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stacked */}
        <ol className="lg:hidden space-y-3" role="list">
          {JOURNEY_DIRECTION.map((step, i) => (
            <li key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-2xs ${
                    step.status === "built"
                      ? "bg-emerald-500 text-ink-900 border-emerald-600/20"
                      : step.status === "building"
                        ? "bg-ink-700 text-accent-cyan border-accent-cyan/30"
                        : "bg-transparent text-accent-violet border-violet-900/30 border-dashed"
                  }`}
                  aria-hidden
                >
                  {String(i + 1)}
                </span>
                {i < JOURNEY_DIRECTION.length - 1 && <span className="mt-1 h-8 w-px bg-line-soft" aria-hidden />}
              </div>
              <div className="pb-2">
                <div className="font-mono text-2xs tracking-[0.12em] uppercase text-text-primary">{step.label}</div>
                <div className="text-xs leading-5 text-text-muted">{step.note}</div>
                <span
                  className={`mt-1 inline-flex rounded-full border px-2 py-0.5 font-mono text-2xs tracking-widest uppercase ${
                    step.status === "built"
                      ? "border-emerald-900/30 bg-emerald-950/20 text-emerald-300"
                      : step.status === "building"
                        ? "border-cyan-900/30 bg-cyan-950/15 text-accent-cyan"
                        : "border-violet-900/30 bg-violet-950/20 text-accent-violet border-dashed"
                  }`}
                >
                  {step.status}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Bottom — chronological log (kept, but secondary to direction) */}
      <div className="relative">
        <div
          className="pointer-events-none absolute left-[15px] top-2 bottom-2 hidden md:block w-px bg-gradient-to-b from-accent-amber/40 via-line to-transparent"
          aria-hidden
        />

        <ol className="space-y-4 md:space-y-0" role="list">
          {JOURNEY.map((item, idx) => (
            <motion.li
              key={item.year + item.title}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.32, 0.72, 0, 1] }}
              className="relative flex gap-4 md:gap-6 group"
            >
              <span
                className="hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-ink-800 text-text-muted group-first:bg-accent-amber group-first:text-ink-900 group-first:border-amber-600/20 mt-1"
                style={{ borderColor: item.marker === "future" ? "#2A3F63" : "#1E2E4A" }}
                aria-hidden
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    item.marker === "future"
                      ? "bg-text-faint"
                      : item.marker === "awarded" || item.marker === "shipped"
                        ? "bg-accent-amber"
                        : "bg-accent-cyan"
                  }`}
                />
              </span>

              <Card hover padding="tight" className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-2xs tracking-[0.16em] uppercase px-2 py-1 rounded-full border border-line bg-ink-900 text-text-muted">
                    {item.year}
                  </span>
                  <span
                    className={`font-mono text-2xs tracking-widest uppercase px-2 py-1 rounded-full border ${
                      item.marker === "future"
                        ? "border-dashed border-line text-text-faint bg-transparent"
                        : item.marker === "awarded"
                          ? "border-accent-amber/20 bg-accent-amber/10 text-accent-amber"
                          : "border-line bg-ink-800 text-text-muted"
                    }`}
                  >
                    {item.marker}
                  </span>
                </div>
                <div className="font-display text-[15px] font-medium text-text-primary">{item.title}</div>
                <p className="mt-1.5 text-sm leading-6 text-text-secondary">{item.detail}</p>
              </Card>
            </motion.li>
          ))}
        </ol>
      </div>

      <Card padding="tight" className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Certifications — vocabulary before claim</div>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Mathematics for ML: Linear Algebra — Imperial · Probability & Stats — DeepLearning.AI · Quantum Algorithms
            & Qiskit — NPTEL (Completed, results awaited) · Python Data Structures — Michigan
          </p>
        </div>
        <span className="shrink-0 font-mono text-2xs tracking-widest uppercase text-text-faint border border-line rounded-full px-3 py-1.5 bg-ink-900">
          Coursework — not credentials to overstate
        </span>
      </Card>
    </Section>
  );
}
