import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "../components/ui/Badge";
import { HeroNetworkCanvas } from "../components/viz/HeroNetworkCanvas";
import { GridOverlay, Vignette } from "../components/viz/GridOverlay";
import { SITE } from "../data/content";
import { scrollToId } from "../lib/scroll";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-line-soft bg-ink-900"
    >
      <GridOverlay />
      <Vignette />
      <div
        className="absolute inset-x-0 top-[72px] h-px bg-gradient-to-r from-transparent via-accent-amber/20 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-shell px-6 lg:px-8 pt-28 md:pt-32 pb-12 md:pb-16">
        {/* Transition rail — 00 / HERO */}
        <div className="mb-6 flex items-center gap-3 border-b border-dashed border-line-soft pb-3">
          <span className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">00 — HERO</span>
          <span className="h-3 w-px bg-line" aria-hidden />
          <span className="font-mono text-2xs tracking-[0.14em] uppercase text-text-faint">
            systems · edge · architecture
          </span>
        </div>

        <div className="grid gap-10 lg:gap-8 lg:grid-cols-[1.06fr_0.94fr] items-start">
          {/* Left — WHO / HOW / WHAT */}
          <div className="min-w-0 pt-1">
            {/* WHO */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-wrap items-center gap-2.5 mb-5"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-3 py-1.5 font-mono text-2xs tracking-[0.14em] uppercase text-text-muted">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                  aria-hidden
                />
                Available for internships · 2026
              </span>
              <Badge variant="muted">NIE Mysuru · Apr 2027 · CGPA 8.01</Badge>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.06, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber mb-3">
                WHO — Advaith Kashyap · Mysuru
              </div>
              <h1
                id="hero-heading"
                className="font-display text-[2.05rem] md:text-[2.7rem] lg:text-[3.05rem] font-semibold leading-[0.95] tracking-tight text-text-primary text-balance"
              >
                Systems-minded
                <br />
                engineer who
                <br />
                <span className="text-accent-amber">reads beneath</span>
                <br />
                the abstraction.
              </h1>
            </motion.div>

            {/* HOW */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.32, 0.72, 0, 1] }}
              className="mt-6 rounded-xl border border-line bg-ink-800/50 px-4 py-3.5"
            >
              <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">HOW — engineering stance</div>
              <p className="mt-1.5 text-[14.5px] leading-6 text-text-secondary">
                Break the system into components. Understand the constraints. Reason about interfaces.
                <span className="text-text-primary"> Measure before you claim.</span> Design the failure path first.
              </p>
            </motion.div>

            {/* WHAT */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.32, 0.72, 0, 1] }}
              className="mt-4 text-[15px] leading-7 text-text-secondary text-pretty"
            >
              <span className="font-mono text-2xs tracking-[0.14em] uppercase text-text-faint">WHAT I BUILD — </span>
              {SITE.heroWhat} I treat AI as <span className="text-text-primary font-medium">one of the tools</span>, not the identity.
            </motion.p>

            {/* Proof strip — honest */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.32, 0.72, 0, 1] }}
              className="mt-7 grid grid-cols-3 gap-3 max-w-[560px]"
              role="list"
              aria-label="Proof points"
            >
              {[
                { k: "68 tests", v: "zero warnings · CTest", sub: "PARALLEL · pthreads" },
                { k: "1st Place", v: "TerrainFit · IoT", sub: "Live hardware demo" },
                { k: "Offline", v: "AI Ghost · on-device", sub: "Airplane-mode verified" },
              ].map((s) => (
                <div key={s.k} role="listitem" className="rounded-xl border border-line bg-ink-800/70 px-3.5 py-3.5">
                  <div className="font-display text-sm font-semibold text-text-primary">{s.k}</div>
                  <div className="font-mono text-2xs tracking-widest uppercase text-text-muted mt-1">{s.v}</div>
                  <div className="font-mono text-[10px] leading-3 tracking-wide text-text-faint mt-1">{s.sub}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("work");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent-amber px-6 py-3 font-mono text-xs tracking-widest uppercase text-ink-900 hover:bg-accent-amberSoft transition-colors shadow-[0_0_24px_-10px_rgba(232,184,106,0.5)] focus-visible:outline-none"
              >
                View selected work <span aria-hidden>→</span>
              </a>
              <button
                type="button"
                onClick={() => scrollToId("about")}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-6 py-3 font-mono text-xs tracking-widest uppercase text-text-primary hover:border-line-strong hover:bg-ink-700 transition-colors focus-visible:outline-none"
              >
                How I think
              </button>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-text-muted hover:text-text-primary transition-colors px-2 py-2"
              >
                GitHub ↗
              </a>
            </motion.div>

            <p className="mt-6 font-mono text-2xs tracking-widest uppercase text-text-faint">
              Not an “AI developer” portfolio. A systems notebook that happens to use AI well.
            </p>
          </div>

          {/* Right — computational universe */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.32, 0.72, 0, 1] }}
            className="min-w-0"
          >
            <HeroNetworkCanvas className="h-[420px] sm:h-[460px] md:h-[480px] lg:h-[520px]" />

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-line-soft bg-ink-800/50 px-4 py-3">
                <div className="font-mono text-2xs tracking-widest uppercase text-accent-amber">What moves</div>
                <div className="mt-1 text-sm leading-6 text-text-secondary">
                  Eight domains, one bus. Edges are traces; pulses are scheduled work. Center holds — peripherals drift.
                </div>
              </div>
              <div className="rounded-xl border border-line-soft bg-ink-800/50 px-4 py-3">
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">What it means</div>
                <div className="mt-1 text-sm leading-6 text-text-secondary">
                  Systems is the graph. AI is a node on it. Hover or tap a domain to reveal its role.
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-2xs tracking-widest uppercase text-text-faint">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-text-faint" aria-hidden />
                Canvas 2D · rAF · DPR-aware
              </span>
              <span aria-hidden>·</span>
              <span>Pause when off-screen</span>
              <span aria-hidden>·</span>
              <span>Respects reduced-motion</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
