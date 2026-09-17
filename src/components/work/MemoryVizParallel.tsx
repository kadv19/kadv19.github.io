import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PARALLEL } from "../../data/projects/parallel";

export function CpuCacheMemoryViz() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<"sequential" | "strided" | "random">("sequential");
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (reduce) return;
    const loop = () => {
      setTick((t) => (t + 1) % 8);
      rafRef.current = window.setTimeout(loop, 700) as unknown as number;
    };
    const id = window.setTimeout(loop, 700) as unknown as number;
    rafRef.current = id;
    return () => window.clearTimeout(rafRef.current);
  }, [reduce]);

  // pattern to highlight indices 0-7
  const pattern: Record<string, number[]> = {
    sequential: [0, 1, 2, 3, 4, 5, 6, 7],
    strided: [0, 2, 4, 6], // stride 2 for viz clarity (real stride 8)
    random: [5, 2, 0, 7, 3],
  };

  return (
    <div className="rounded-xl border border-line bg-ink-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-line-soft flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-2xs tracking-[0.18em] uppercase text-text-muted">CPU → CACHE → MAIN MEMORY · locality matters</span>
        <div className="flex gap-1.5">
          {(["sequential", "strided", "random"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={active === p}
              onClick={() => setActive(p)}
              className={`rounded-full border px-3 py-1.5 font-mono text-2xs tracking-widest uppercase transition-colors ${
                active === p ? "bg-accent-amber text-ink-900 border-amber-600/20" : "bg-ink-900 border-line text-text-muted hover:bg-ink-800"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-start">
        {/* Left — stack */}
        <div className="space-y-3">
          {[
            { label: "CPU", sub: "4 workers · thread_pool · mutex/cv", tone: "amber" },
            { label: "CACHE", sub: "Lines hold contiguous blocks — sequential benefits most", tone: "cyan" },
            { label: "MAIN MEMORY", sub: "1M doubles · 8 bytes each · tasks are disjoint [start,end)", tone: "muted" },
          ].map((row) => (
            <div key={row.label} className="rounded-xl border border-line bg-ink-900/70 px-4 py-3.5 flex items-center gap-4">
              <span className={`h-2 w-2 rounded-full shrink-0 ${row.tone === "amber" ? "bg-accent-amber" : row.tone === "cyan" ? "bg-accent-cyan" : "bg-text-muted"}`} aria-hidden />
              <span>
                <span className="font-mono text-2xs tracking-[0.16em] uppercase text-text-primary">{row.label}</span>
                <span className="block font-mono text-2xs leading-4 text-text-muted">{row.sub}</span>
              </span>
              <span className="ml-auto font-mono text-2xs tracking-widest uppercase text-text-faint" aria-hidden>
                ↓
              </span>
            </div>
          ))}

          <div className="rounded-lg border border-amber-900/30 bg-amber-950/15 px-3 py-2.5 font-mono text-2xs leading-5 text-amber-100/80">
            {PARALLEL.memoryVizNote}
          </div>
        </div>

        {/* Right — 8 cells memory */}
        <div>
          <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted mb-3">Memory cells [0..7] — {active}</div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => {
              const hit = pattern[active]!.includes(i);
              const isTick = !reduce && hit && pattern[active]!.indexOf(i) === tick % pattern[active]!.length;
              return (
                <span
                  key={i}
                  className={`relative flex aspect-square items-center justify-center rounded-lg border font-mono text-xs font-medium transition-all ${
                    isTick
                      ? "bg-accent-amber text-ink-900 border-amber-600/20 scale-[1.02] shadow-[0_0_16px_rgba(232,184,106,0.35)]"
                      : hit
                        ? active === "sequential"
                          ? "bg-emerald-950/30 border-emerald-900/30 text-emerald-300"
                          : active === "strided"
                            ? "bg-cyan-950/30 border-cyan-900/30 text-accent-cyan"
                            : "bg-violet-950/20 border-violet-900/30 text-accent-violet"
                        : "bg-ink-900 border-line-soft text-text-faint"
                  }`}
                  aria-label={`cell ${i} ${hit ? "accessed" : "idle"}`}
                >
                  [{i + 1}]
                </span>
              );
            })}
          </div>

          <div className="mt-3 space-y-2">
            <div className="rounded-lg border border-line-soft bg-ink-900/60 px-3 py-2.5">
              <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">
                {active === "sequential" ? "SEQUENTIAL" : active === "strided" ? "STRIDED (stride 8)" : "RANDOM"} — locality {active === "sequential" ? "1.0" : active === "strided" ? "0.5" : "0.1"}
              </div>
              <p className="mt-1 text-xs leading-5 text-text-secondary">
                {active === "sequential"
                  ? "Contiguous [1][2][3]… — best prefetch, lowest latency."
                  : active === "strided"
                    ? "Skip pattern [1]·[3]·[5]… — cache lines wasted, intermediate."
                    : "Scattered [5]·[2][8]·[1] — highest stalls, worst locality."}
              </p>
            </div>
            <p className="font-mono text-2xs tracking-widest uppercase text-text-faint">{reduce ? "Reduced motion: static" : "Auto-stepping every 700 ms · tap top to switch pattern"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OverviewParallelMetrics({ minimal = false }: { minimal?: boolean }) {
  const f = PARALLEL.measurements.findings;

  if (minimal) {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-line bg-ink-800/60 px-4 py-3.5">
          <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Access pattern effect (workers=4)</div>
          <p className="mt-1 font-mono text-xs leading-5 text-text-secondary">{f.accessPattern}</p>
        </div>
        <div className="rounded-xl border border-line bg-ink-800/60 px-4 py-3.5">
          <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Scheduler contrast (sequential, 4w)</div>
          <p className="mt-1 font-mono text-xs leading-5 text-text-secondary">{f.schedulerOnSequential}</p>
        </div>
        <div className="rounded-xl border border-line bg-ink-800/60 px-4 py-3.5">
          <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Model</div>
          <p className="mt-1 font-mono text-xs leading-5 text-text-secondary">{f.modelLine}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-ink-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-line-soft">
        <span className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">Overview visualization — meaningful single overview (not 8 giant images)</span>
        <p className="mt-1 font-mono text-2xs leading-5 text-text-muted">Workload: {PARALLEL.measurements.workload}. Each point is median of 5 runs.</p>
      </div>

      <div className="p-5 grid gap-3 md:grid-cols-3">
        {[
          { k: "Access pattern", v: f.accessPattern, note: "locality ordering holds, scheduler-dependent" },
          { k: "Scheduler (seq)", v: f.schedulerOnSequential, note: f.schedulerOnRandom },
          { k: "Scaling", v: f.scalingFCFS, note: "Sublinear — bandwidth, cache, overhead" },
        ].map((card) => (
          <div key={card.k} className="rounded-xl border border-line bg-ink-900/60 px-4 py-3.5">
            <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">{card.k}</div>
            <p className="mt-1 text-xs leading-5 text-text-secondary">{card.v}</p>
            <p className="mt-2 font-mono text-2xs leading-4 text-text-faint">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mx-5 mb-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-line-soft bg-ink-900/60 px-4 py-3.5">
          <div className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-cyan">Model — why Linear Regression</div>
          <p className="mt-1 font-mono text-xs leading-5 text-text-secondary">{f.modelLine}</p>
          <p className="mt-1 font-mono text-xs leading-5 text-text-faint">{f.modelTree} · but tree not deployed.</p>
        </div>
        <div className="rounded-xl border border-dashed border-line bg-ink-900/30 px-4 py-3.5">
          <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Honest note</div>
          <p className="mt-1 text-xs leading-5 text-text-secondary">{f.nuance}</p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="rounded-lg border border-line-soft bg-ink-900/40 px-3 py-2.5 flex flex-wrap gap-2 font-mono text-2xs tracking-widest uppercase text-text-faint">
          <span>8 plots available:</span>
          {PARALLEL.measurements.plots.map((p) => (
            <span key={p} className="rounded-full border border-line bg-ink-800 px-2 py-1 text-text-muted normal-case tracking-wide">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
