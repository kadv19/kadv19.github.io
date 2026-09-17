import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ProjectHero } from "../components/work/ProjectHero";
import { CpuCacheMemoryViz, OverviewParallelMetrics } from "../components/work/MemoryVizParallel";
import { Disclosure } from "../components/work/Disclosure";
import { ProjectNav } from "../components/work/ProjectNav";
import { PARALLEL } from "../data/projects/parallel";

export default function WorkParallel() {
  useEffect(() => {
    document.title = "Cache-Aware Parallel Scheduler — Advaith Kashyap";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Cache-aware parallel scheduler: 68 tests, 54-row benchmark matrix, 5 policies + AI burst predictor (MAE 0.040, R² 0.793). Measurement before prediction.");
  }, []);

  return (
    <div className="bg-ink-900">
      <ProjectHero
        indexLabel="FLAGSHIP 03 / 03 — SYSTEMS"
        category={PARALLEL.category}
        title={PARALLEL.title}
        thesis={PARALLEL.thesis}
        badges={[
          { label: "68 tests · zero warnings · CTest", tone: "amber" },
          { label: "C++17 · CMake · pthreads", tone: "muted" },
          { label: "Linear Regression R² 0.793", tone: "cyan" },
        ]}
        actions={
          <>
            <a href="#viz" className="inline-flex items-center gap-2 rounded-full bg-accent-amber px-6 py-3 font-mono text-xs tracking-widest uppercase text-ink-900 hover:bg-accent-amberSoft transition-colors">
              Memory visualization ↓
            </a>
            <Link to="/work/razorpay" className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-6 py-3 font-mono text-xs tracking-widest uppercase text-text-primary hover:bg-ink-700 transition-colors">
              Back to Razorpay →
            </Link>
          </>
        }
        visual={
          <div className="rounded-xl border border-line bg-ink-800/60 p-5">
            <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Core question</div>
            <p className="mt-2 text-sm leading-6 text-text-secondary">“{PARALLEL.question}”</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2 text-center">
                <div className="font-display text-sm font-semibold text-text-primary">1M</div>
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">elements</div>
              </div>
              <div className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2 text-center">
                <div className="font-display text-sm font-semibold text-text-primary">5</div>
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">schedulers</div>
              </div>
              <div className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2 text-center">
                <div className="font-display text-sm font-semibold text-emerald-300">+ AI</div>
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">predictor</div>
              </div>
            </div>
            <p className="mt-3 font-mono text-2xs leading-4 text-text-faint">Sources: ~/Desktop/PARALLEL_COMPUTING · model_metrics.json · benchmark_results.csv · analysis/plots (8)</p>
          </div>
        }
      />

      <div className="mx-auto max-w-shell px-6 lg:px-8 py-10 md:py-12 space-y-8">
        <section className="rounded-xl border border-line bg-ink-800/40 p-6 md:p-7">
          <h2 className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">PROBLEM</h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary max-w-[70ch]">
            The same data processed by the same workers can have dramatically different performance depending on memory access order. This project studies how traversal
            patterns (Sequential / Strided / Random) and scheduling policies interact with cache behavior — and whether a learned model can predict burst time to inform scheduling.
          </p>
          <p className="mt-2 font-mono text-xs leading-5 text-text-muted">Workload is an in-memory std::vector&lt;double&gt; split into disjoint [start,end) tasks — embarrassingly parallel, so effects are from locality and scheduling, not dependencies.</p>
        </section>

        <section id="viz" className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Memory & Access — educational visualization</h2>
          <CpuCacheMemoryViz />
          <p className="font-mono text-2xs text-center tracking-wide text-text-faint">Not a hardware cache trace — explanatory, based on locality_score heuristic. Tap top pills to switch pattern.</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Architecture — repository evidence</h2>
          <div className="hidden md:flex items-stretch gap-2">
            {PARALLEL.architecture.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-stretch gap-2">
                <div className={`flex-1 rounded-xl border p-3.5 ${s.role === "gate" ? "bg-amber-950/20 border-amber-900/30" : "bg-ink-900 border-line"}`}>
                  <div className="font-mono text-2xs tracking-[0.12em] uppercase text-text-faint">{String(i + 1).padStart(2, "0")} · {s.role}</div>
                  <div className="mt-1 font-display text-xs font-semibold text-text-primary">{s.label}</div>
                  <div className="font-mono text-[11px] leading-4 text-text-muted">{s.sub}</div>
                </div>
                {i < PARALLEL.architecture.length - 1 && <span className="self-center font-mono text-text-faint" aria-hidden>→</span>}
              </div>
            ))}
          </div>
          <div className="md:hidden space-y-2">
            {PARALLEL.architecture.map((s, i) => (
              <div key={s.id} className="rounded-xl border border-line bg-ink-900 px-3.5 py-3 flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-800 border border-line font-mono text-2xs text-text-muted">{String(i + 1)}</span>
                <span>
                  <span className="font-display text-sm font-semibold text-text-primary">{s.label}</span>
                  <span className="block font-mono text-xs text-text-muted">{s.sub}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-line bg-ink-800/50 px-4 py-3.5">
              <div className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Repository structure</div>
              <p className="mt-1 font-mono text-xs leading-5 text-text-secondary">{PARALLEL.repoEvidence.structure}</p>
            </div>
            <div className="rounded-xl border border-line bg-ink-800/50 px-4 py-3.5">
              <div className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-amber">Schedulers (IScheduler)</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PARALLEL.repoEvidence.schedulers.map((s) => (
                  <span key={s.id} className="rounded-full border border-line bg-ink-900 px-2.5 py-1 font-mono text-2xs tracking-wide text-text-muted">
                    {s.name} · {s.type}
                  </span>
                ))}
              </div>
              <p className="mt-2 font-mono text-2xs leading-4 text-text-faint">{PARALLEL.repoEvidence.interface}</p>
            </div>
            <div className="rounded-xl border border-line bg-ink-900 px-4 py-3.5 text-center">
              <div className="font-display text-2xl font-semibold text-text-primary">{PARALLEL.repoEvidence.tests}</div>
              <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">CTest · {PARALLEL.repoEvidence.testFramework}</div>
              <div className="mt-1 font-mono text-2xs tracking-wide text-emerald-300">{PARALLEL.repoEvidence.warnings}</div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Results — measured, not simulated</h2>
          <OverviewParallelMetrics />
          <Disclosure title="Raw benchmark details & definitions" kicker="Verified CSV · no invented metrics">
            <div className="space-y-3 font-mono text-xs leading-5 text-text-secondary">
              <div>
                <span className="text-text-faint">Workload matrix:</span> {PARALLEL.measurements.workload}
              </div>
              <div>
                <span className="text-text-faint">Dataset:</span> {PARALLEL.measurements.dataset}
              </div>
              <div className="grid gap-2 md:grid-cols-3 pt-2">
                {Object.entries(PARALLEL.measurements.metricsDef).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2">
                    <div className="font-mono text-2xs tracking-widest uppercase text-accent-amber">{k}</div>
                    <div className="mt-1 text-xs leading-4">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Disclosure>
          <Disclosure title="Selected detailed view — representative workers=4 (1M/100)" kicker="From analysis/final_comparison.csv">
            <pre className="overflow-x-auto rounded-lg border border-line bg-ink-900 p-4 font-mono text-xs leading-5 text-text-secondary">
              {`scheduler,access_pattern,median_time_ms,speedup,eff%
FCFS,sequential,8.17,2.21,55.3%  ← fastest on uniform
AI,sequential,21.26,0.85,21.2%   ← AI loses on uniform (prediction error)
AI,random,21.26,2.63,65.9%      ← AI beats FCFS 28.34 on random
FCFS,random,28.34,1.98,49.4%
FCFS,strided,6.91,3.22,80.4%    ← best overall strided
Source: analysis/final_comparison.csv (15 rows, workers 4)`}
            </pre>
          </Disclosure>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Engineering Decisions</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {PARALLEL.decisions.map((d) => (
              <div key={d.title} className="rounded-xl border border-line bg-ink-800/50 p-5">
                <div className="font-display text-sm font-semibold text-text-primary">{d.title}</div>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{d.why}</p>
                <div className="mt-2 font-mono text-2xs leading-4 text-text-faint">{d.source}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Limitations</h2>
          <ul className="space-y-2">
            {PARALLEL.limitations.map((l) => (
              <li key={l} className="flex gap-3 rounded-lg border border-line-soft bg-ink-800/30 px-4 py-3">
                <span className="mt-2 h-px w-4 shrink-0 bg-text-faint" aria-hidden />
                <span className="text-sm leading-6 text-text-secondary">{l}</span>
              </li>
            ))}
          </ul>
        </section>

        <Disclosure title="Reproduction — exact repository commands" kicker="68 tests → plots" defaultOpen>
          <pre className="overflow-x-auto rounded-lg border border-line bg-ink-900 p-4 font-mono text-xs leading-5 text-text-secondary">
            {PARALLEL.reproduction.join("\n")}
          </pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={PARALLEL.links.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-3.5 py-2 font-mono text-2xs tracking-widest uppercase text-text-primary hover:bg-ink-700">
              GitHub ↗
            </a>
            <span className="rounded-full border border-line-soft bg-ink-900 px-3 py-2 font-mono text-2xs tracking-wide text-text-muted">8 plots in analysis/plots · results_summary.txt · final_comparison.csv</span>
          </div>
        </Disclosure>
      </div>

      <ProjectNav prev={{ href: "/work/ai-ghost", label: "AI Ghost" }} next={{ href: "/work/razorpay", label: "Razorpay" }} />
    </div>
  );
}
