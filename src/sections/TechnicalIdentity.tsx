import { motion, useReducedMotion } from "framer-motion";
import { Section } from "../components/ui/Section";
import { TECH_MAP } from "../data/content";

const tierStyle: Record<string, { dot: string; pill: string; label: string }> = {
  built: { dot: "bg-emerald-400", pill: "border-emerald-900/30 bg-emerald-950/25 text-emerald-300", label: "BUILT WITH" },
  worked: { dot: "bg-accent-cyan", pill: "border-cyan-900/30 bg-cyan-950/15 text-accent-cyan", label: "WORKED WITH" },
  exploring: { dot: "bg-accent-violet", pill: "border-violet-900/30 bg-violet-950/20 text-accent-violet", label: "EXPLORING" },
};

export function TechnicalIdentity() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="systems"
      indexLabel="02 / SYSTEMS"
      annotation="Technical identity — breadth without keyword inflation"
      kicker="Technical Identity"
      title="Depth across the stack. Preference for the lower layers."
      intro="Not ‘full-stack’ as a badge wall — but comfort moving between firmware, systems, backend, and models when the problem demands it. Three tiers keep the claim honest: BUILT WITH · WORKED WITH · EXPLORING."
      muted
    >
      {/* Legend — explains the three states */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {(["built", "worked", "exploring"] as const).map((t) => (
          <span
            key={t}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-2xs tracking-widest uppercase ${tierStyle[t].pill}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tierStyle[t].dot}`} aria-hidden />
            {tierStyle[t].label}
          </span>
        ))}
        <span className="ml-auto font-mono text-2xs tracking-widest uppercase text-text-faint hidden sm:inline">
          Hover a pill for provenance · no “expert” labels
        </span>
      </div>

      {/* Visual map — 5 categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TECH_MAP.map((cat, ci) => (
          <motion.div
            key={cat.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-24px" }}
            transition={{ duration: 0.45, delay: ci * 0.06, ease: [0.32, 0.72, 0, 1] }}
            className="group relative overflow-hidden rounded-xl border border-line bg-ink-800/60 p-5 md:p-6 flex flex-col hover:border-line-strong transition-colors"
          >
            {/* top trace */}
            <div
              className={`absolute inset-x-0 top-0 h-px ${
                cat.id === "systems" ? "bg-accent-amber/30" : cat.id === "ai" ? "bg-accent-cyan/25" : "bg-line-soft"
              }`}
              aria-hidden
            />

            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-amber">{cat.label}</div>
                <div className="mt-1 text-xs leading-5 text-text-muted">{cat.caption}</div>
              </div>
              <span className="shrink-0 rounded-full border border-line bg-ink-900 px-2 py-1 font-mono text-2xs tracking-widest uppercase text-text-faint">
                {String(TECH_MAP.length).padStart(2, "0")} · {String(ci + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item.name}
                  title={
                    (item as { note?: string }).note
                      ? `${item.name} — ${(item as { note?: string }).note} — ${tierStyle[item.tier].label}`
                      : item.name
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-2xs tracking-wide cursor-default transition-colors hover:brightness-110 ${tierStyle[item.tier].pill}`}
                >
                  <span className={`h-1 w-1 rounded-full ${tierStyle[item.tier].dot}`} aria-hidden />
                  {item.name}
                </span>
              ))}
            </div>

            {/* subtle footnote for category */}
            <div className="mt-auto pt-4 border-t border-dashed border-line-soft flex items-center gap-2 font-mono text-2xs tracking-widest uppercase text-text-faint">
              <span className="h-px w-4 bg-line-soft" aria-hidden />
              {cat.items.filter((i) => i.tier === "built").length} built ·{" "}
              {cat.items.filter((i) => i.tier === "worked").length} worked ·{" "}
              {cat.items.filter((i) => i.tier === "exploring").length} exploring
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statement — one coherent engineer */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="mt-8 rounded-xl border border-line bg-ink-900/60 p-6 md:p-7 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
      >
        <p className="text-sm leading-7 text-text-secondary max-w-[68ch]">
          The point isn’t collecting logos — it’s showing where I like to live:{" "}
          <span className="text-text-primary font-medium">near the machine, with tests that actually run.</span> AI is
          the newest node on that map, not the map itself. If a scheduler can’t beat FCFS on uniform work, I write
          that down instead of hiding it.
        </p>
        <div className="shrink-0 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-amber text-ink-900 px-3 py-1.5 font-mono text-2xs tracking-widest uppercase">
            Depth over breadth
          </span>
          <span className="rounded-full border border-line bg-ink-800 px-3 py-1.5 font-mono text-2xs tracking-widest uppercase text-text-muted">
            Language-agnostic · systems-first
          </span>
        </div>
      </motion.div>

      {/* Mobile: scrollable hint is implicit via wrap — no horizontal overflow */}
      <p className="mt-4 font-mono text-2xs tracking-widest uppercase text-text-faint text-center md:hidden">
        Tap any pill to see its provenance · no horizontal scroll
      </p>
    </Section>
  );
}
