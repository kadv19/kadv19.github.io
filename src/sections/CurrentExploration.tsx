import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Section } from "../components/ui/Section";
import { EXPLORATION } from "../data/content";

export function CurrentExploration() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>(EXPLORATION.items[0]!.id);
  const activeItem = EXPLORATION.items.find((i) => i.id === active) ?? EXPLORATION.items[0]!;

  return (
    <Section
      id="exploration"
      indexLabel="04 / LABORATORY"
      annotation="Active exploration — interconnected, measurable"
      kicker={EXPLORATION.kicker}
      title={EXPLORATION.title}
      intro={EXPLORATION.intro}
    >
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr] items-start">
        {/* Left — interconnected grid (acts like a lab bench) */}
        <div className="rounded-xl border border-line bg-ink-800/40 p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Probe map — hover or tap</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-2xs tracking-widest uppercase text-text-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulseGlow" aria-hidden />
              8 topics · linked
            </span>
          </div>

          {/* Grid 2×4 on desktop, 2 cols on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EXPLORATION.items.map((item, idx) => {
              const isActive = item.id === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActive(item.id)}
                  onFocus={() => setActive(item.id)}
                  onClick={() => setActive(item.id)}
                  aria-pressed={isActive}
                  aria-label={`${item.title}: ${item.why}`}
                  className={`group relative text-left rounded-xl border p-3.5 md:p-4 transition-all focus-visible:outline-none  ${
                    isActive
                      ? "bg-accent-amber text-ink-900 border-amber-600/20 shadow-[0_0_18px_-10px_rgba(232,184,106,0.5)]"
                      : item.tier === "built"
                        ? "bg-ink-800 border-line hover:border-line-strong text-text-primary hover:bg-ink-700"
                        : item.tier === "worked"
                          ? "bg-ink-900 border-line-soft hover:border-line text-text-secondary hover:bg-ink-800"
                          : "bg-transparent border-dashed border-line hover:border-line-strong text-text-muted hover:bg-ink-800/40"
                  }`}
                >
                  {/* trace dot */}
                  <span
                    className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${
                      isActive
                        ? "bg-ink-900/30"
                        : item.tier === "built"
                          ? "bg-emerald-400"
                          : item.tier === "worked"
                            ? "bg-accent-cyan"
                            : "bg-accent-violet"
                    }`}
                    aria-hidden
                  />
                  <div className="font-mono text-2xs tracking-widest uppercase opacity-60">
                    {String(idx + 1).padStart(2, "0")} · {item.tier}
                  </div>
                  <div className="mt-1 font-display text-sm font-medium leading-tight">{item.title}</div>
                  {/* tiny connector hint */}
                  <div className={`mt-2 h-px ${isActive ? "bg-ink-900/15" : "bg-line-soft group-hover:bg-line"} transition-colors`} aria-hidden />
                  <div className={`mt-2 font-mono text-2xs leading-4 ${isActive ? "text-ink-900/70" : "text-text-faint"}`}>
                    {isActive ? "active" : "probe"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Subtle connection SVG overlay hint — purely decorative */}
          <div className="mt-4 rounded-lg border border-dashed border-line-soft bg-ink-900/40 px-3 py-2.5 flex flex-wrap items-center gap-2 font-mono text-2xs tracking-widest uppercase text-text-faint">
            <span className="h-px w-6 bg-line-soft" aria-hidden />
            Interconnected: edge ↔ distributed, cache ↔ parallel ↔ arch, quantum ↔ hardware — edges matter more than nodes
          </div>

          {/* Benches */}
          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            {EXPLORATION.benches.map((b) => (
              <div key={b.label} className="rounded-lg border border-line-soft bg-ink-900/60 px-3.5 py-3">
                <div className="font-mono text-2xs tracking-widest uppercase text-accent-amber">{b.label}</div>
                <div className="mt-1.5 font-mono text-xs leading-5 text-text-secondary">{b.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — active detail (reveals WHY / WHAT) */}
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="sticky top-[84px]"
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent-amber/40 via-accent-cyan/20 to-transparent" aria-hidden />
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulseGlow" aria-hidden />
              <span className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-cyan">Active probe</span>
              <span className="ml-auto rounded-full border border-line bg-ink-900 px-2 py-1 font-mono text-2xs tracking-widest uppercase text-text-muted">
                {activeItem.tier}
              </span>
            </div>

            <h3 className="font-display text-xl leading-tight tracking-tight text-text-primary">{activeItem.title}</h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-line-soft bg-ink-900/50 px-4 py-3.5">
                <div className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-amber">WHY IT INTERESTS ME</div>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{activeItem.why}</p>
              </div>

              <div className="rounded-xl border border-line-soft bg-ink-800/50 px-4 py-3.5">
                <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">WHAT I’M LEARNING</div>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{activeItem.learning}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-dashed border-line-soft flex items-center gap-2 font-mono text-2xs tracking-widest uppercase text-text-faint">
              <span>{EXPLORATION.items.findIndex((i) => i.id === active) + 1} / 8</span>
              <span className="h-px flex-1 bg-line-soft" aria-hidden />
              <span className="hidden sm:inline">Hover neighboring topic to move</span>
              <span className="sm:hidden">Tap to move</span>
            </div>
          </Card>

          <p className="mt-3 text-center font-mono text-2xs tracking-widest uppercase text-text-faint">
            All descriptions grounded in existing source material — no invented claims
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
