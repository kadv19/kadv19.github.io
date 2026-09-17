import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { RAZORPAY } from "../../data/projects/razorpay";

function PathViz({ steps, highlightIdx = -1 }: { steps: readonly string[]; highlightIdx?: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2" role="list">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-2xs tracking-wide transition-colors ${
              i === highlightIdx
                ? "bg-accent-amber text-ink-900 border-amber-600/20"
                : s.includes("OUT OF STOCK") || s.includes("BLOCK") || s.includes("NO VALID OPTION")
                  ? "bg-red-950/30 border-red-900/30 text-red-300"
                  : s.includes("RECOVERY") || s.includes("REVALIDATE") || s.includes("ALTERNATIVE")
                    ? "bg-violet-950/20 border-violet-900/30 text-accent-violet"
                    : s.includes("CHECKOUT") || s.includes("PASS") || s.includes("SUCCESS")
                      ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-300"
                      : "bg-ink-900 border-line text-text-muted"
            }`}
          >
            {s}
          </span>
          {i < steps.length - 1 && <span className="font-mono text-text-faint" aria-hidden>→</span>}
        </li>
      ))}
    </ol>
  );
}

export function FailurePathsRazorpay() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [active, setActive] = useState<"recovery" | "block">("recovery");
  const current = RAZORPAY.failurePaths.find((p) => p.id === active)!;
  const containerRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (reduce || !running) return;
    const id = window.setInterval(() => setPhase((p) => (p + 1) % (current.steps.length + 1)), 900);
    return () => window.clearInterval(id);
  }, [reduce, running, current.steps.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setRunning(entries[0]?.isIntersecting ?? true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="rounded-xl border border-line bg-ink-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-line-soft flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-2xs tracking-[0.18em] uppercase text-text-muted">Failure paths — animated · where the safety boundary lives</span>
        <div className="flex gap-2">
          {(["recovery", "block"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActive(id);
                setPhase(0);
              }}
              aria-pressed={active === id}
              className={`rounded-full border px-3 py-1.5 font-mono text-2xs tracking-widest uppercase transition-colors ${
                active === id ? "bg-accent-amber text-ink-900 border-amber-600/20" : "bg-ink-900 border-line text-text-muted hover:bg-ink-800"
              }`}
            >
              {id === "recovery" ? "Recovery → PASS" : "Exhausted → FAIL"}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <h3 className="font-display text-[15px] font-semibold text-text-primary">{current.title}</h3>
        <PathViz steps={current.steps} highlightIdx={reduce ? -1 : phase % current.steps.length} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line-soft bg-ink-900/60 px-4 py-3">
            <div className="font-mono text-2xs tracking-[0.16em] uppercase text-emerald-300">Result</div>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{current.result}</p>
          </div>
          <div className="rounded-xl border border-line-soft bg-ink-900/60 px-4 py-3 font-mono text-xs leading-5 text-text-muted">
            <span className="text-text-faint">Audit hint:</span> {current.auditHint}
          </div>
        </div>
        <p className="font-mono text-2xs tracking-widest uppercase text-text-faint">
          {reduce ? "Reduced motion: static view" : "Auto-stepping · pauses off-screen · tap toggle to switch path"}
        </p>
      </div>
    </div>
  );
}
