import { motion, useReducedMotion } from "framer-motion";
import { Section } from "../components/ui/Section";
import { PHILOSOPHY, PRINCIPLES } from "../data/content";

export function About() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="about"
      indexLabel="01 / SYSTEM"
      annotation="How I think — engineering observations, not slogans"
      kicker={PHILOSOPHY.kicker}
      title={PHILOSOPHY.title}
      intro={PHILOSOPHY.paragraphs.join(" ")}
    >
      {/* Editorial pull — who is behind the projects */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="mb-8 rounded-xl border border-line bg-ink-800/40 px-6 py-5 md:px-7 md:py-6 flex flex-col md:flex-row gap-5 md:items-center"
      >
        <div className="shrink-0 font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">
          Person behind<br className="hidden md:block" /> the systems
        </div>
        <p className="text-[15px] leading-7 text-text-secondary max-w-[70ch]">
          I enjoy taking a tangled system — two gyros on a backpack, a video pipeline that drops frames, a thread pool
          that scales poorly — and making the hidden cost visible. I break it into pieces, name the interfaces, test
          the failure modes first, then shape the design around what was measured. The pages that follow are my attempt
          to keep that process legible.
        </p>
      </motion.div>

      {/* 6 principles — distinctive visual treatment */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map((p, i) => (
          <motion.article
            key={p.n}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-24px" }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
            className="group relative overflow-hidden rounded-xl border border-line bg-ink-800/60 p-5 md:p-6 flex flex-col hover:border-line-strong hover:bg-ink-800 transition-colors"
          >
            {/* top rule — amber for odd, cyan for even, violet for 06 */}
            <div
              className={`absolute inset-x-0 top-0 h-px ${
                p.n === "06"
                  ? "bg-accent-violet/40"
                  : i % 2 === 0
                    ? "bg-accent-amber/40"
                    : "bg-accent-cyan/30"
              }`}
              aria-hidden
            />
            {/* number */}
            <div className="flex items-start justify-between">
              <span className="font-mono text-2xs tracking-[0.18em] uppercase text-text-faint">{p.n}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full mt-1 ${p.n === "06" ? "bg-accent-violet" : i % 2 === 0 ? "bg-accent-amber" : "bg-accent-cyan"}`}
                aria-hidden
              />
            </div>

            <h3 className="mt-3 font-display text-[13px] font-semibold tracking-[0.08em] uppercase leading-tight text-text-primary">
              {p.title}
            </h3>

            <p className="mt-2.5 text-sm leading-6 text-text-secondary flex-1">{p.detail}</p>

            <div className="mt-4 pt-3 border-t border-dashed border-line-soft">
              <span className="font-mono text-2xs tracking-[0.14em] uppercase text-text-faint">
                — {p.note}
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Lab notebook excerpt — keeps measurement honesty */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start"
      >
        <div className="rounded-xl border border-line bg-ink-900/70 p-6 md:p-7 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.04]" aria-hidden />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-2xs tracking-[0.18em] uppercase text-text-muted">Lab notebook · excerpt</span>
              <span className="font-mono text-2xs tracking-widest uppercase text-text-faint">p. 02</span>
            </div>
            <div className="space-y-3 font-mono text-xs leading-6 text-text-secondary">
              <p>
                <span className="text-accent-amber">Hypothesis:</span> Strided access will degrade with workers faster than
                sequential — cache lines wasted, bus pressure linear.
              </p>
              <p>
                <span className="text-accent-cyan">Method:</span> 1M array, 100 tasks, repeat=5, 3 patterns × 3 worker
                counts × 6 schedulers → 54-row matrix. Each cell measured, not estimated.
              </p>
              <p>
                <span className="text-text-primary">Result:</span> Sequential 12.1 ms · Strided 16.1 ms · Random 22.3 ms
                (workers=4, avg). FCFS 4.78 ms (speedup 3.78×) — sublinear, as expected.
              </p>
              <p className="text-text-muted">
                Note: AI wins only on random (20.45 vs 23.86). Uniform tasks favor static. Prediction error (R² 0.793)
                explains the gap. Kept.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-line bg-ink-800 px-2.5 py-1 font-mono text-2xs tracking-widest uppercase text-text-muted">
                worker_count ∈ {"{1,2,4}"}
              </span>
              <span className="rounded-full border border-line bg-ink-800 px-2.5 py-1 font-mono text-2xs tracking-widest uppercase text-text-muted">
                measured · not simulated
              </span>
              <span className="rounded-full border border-accent-amber/20 bg-accent-amber/10 px-2.5 py-1 font-mono text-2xs tracking-widest uppercase text-accent-amber">
                honesty over hype
              </span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-accent-amber/30 via-line to-transparent" aria-hidden />
          <div className="relative mt-6 flex items-center justify-between pt-3 border-t border-line-soft">
            <span className="font-mono text-2xs tracking-widest uppercase text-text-faint">
              Source: benchmark_results.csv · model_metrics.json
            </span>
            <span className="font-mono text-2xs tracking-widest uppercase text-text-faint">Phase 7 — Final</span>
          </div>
        </div>

        {/* Companion — what scoping really means */}
        <div className="rounded-xl border border-dashed border-line bg-ink-800/20 p-6 md:p-7">
          <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Why scoping matters</div>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            Every project here stops where evidence stops. TerrainFit stops at geometry — no medical claim. AI Ghost
            stops at demonstrable on-device RAG — no AMD NPU claim. The parallel study stops at a 1M/100 workload —
            no data-center claim. The boundary is part of the design.
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Break the system into testable pieces.",
              "Measure under the same constraints you’ll demo under.",
              "Write the trade-off next to the feature.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5 text-sm leading-6 text-text-secondary">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-accent-amber/50" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Section>
  );
}
