import { useState } from "react";
import { RAZORPAY } from "../../data/projects/razorpay";

export function ArchitectureRazorpay() {
  const [active, setActive] = useState<string>("auditor");
  const activeStep = RAZORPAY.architecture.find((s) => s.id === active);

  return (
    <div className="rounded-xl border border-line bg-ink-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-line-soft flex items-center justify-between">
        <span className="font-mono text-2xs tracking-[0.18em] uppercase text-text-muted">Architecture — User → Checkout · the gate matters</span>
        <span className="font-mono text-2xs tracking-widest uppercase text-accent-amber">5 checks · gated</span>
      </div>

      {/* Mobile vertical, desktop horizontal */}
      <div className="p-5">
        {/* Flow */}
        <div className="hidden md:flex items-stretch gap-2">
          {RAZORPAY.architecture.map((step, i) => (
            <div key={step.id} className="flex flex-1 items-stretch gap-2">
              <button
                type="button"
                onClick={() => setActive(step.id)}
                aria-pressed={active === step.id}
                className={`flex-1 relative text-left rounded-xl border p-3.5 transition-colors focus-visible:outline-none ${
                  step.role === "gate"
                    ? active === step.id
                      ? "bg-amber-500 text-ink-900 border-amber-600/20 shadow-[0_0_18px_-10px_rgba(232,184,106,0.5)]"
                      : "bg-amber-950/20 border-amber-900/30 text-accent-amber hover:bg-amber-900/20"
                    : active === step.id
                      ? "bg-accent-amber text-ink-900 border-amber-600/20"
                      : "bg-ink-900 border-line text-text-primary hover:bg-ink-800"
                }`}
              >
                {step.role === "gate" && (
                  <span className="absolute -top-1.5 right-2 rounded-full bg-amber-500 px-1.5 py-0.5 font-mono text-[10px] tracking-widest uppercase text-ink-900">GATE</span>
                )}
                <div className="font-mono text-2xs tracking-[0.12em] uppercase opacity-70">{String(i + 1).padStart(2, "0")}</div>
                <div className={`mt-1 font-display text-xs font-semibold leading-tight ${step.role === "gate" && active !== step.id ? "text-accent-amber" : ""}`}>
                  {step.label}
                </div>
                <div className={`mt-1 font-mono text-[11px] leading-4 ${active === step.id ? "text-ink-900/70" : "text-text-muted"}`}>{step.sub}</div>
              </button>
              {i < RAZORPAY.architecture.length - 1 && (
                <span className="self-center font-mono text-text-faint" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Mobile stack */}
        <div className="md:hidden space-y-2">
          {RAZORPAY.architecture.map((step, i) => (
            <div key={step.id} className="flex gap-2">
              <button
                type="button"
                onClick={() => setActive(step.id)}
                aria-pressed={active === step.id}
                className={`flex-1 text-left rounded-xl border p-3.5 transition-colors ${
                  step.role === "gate"
                    ? active === step.id
                      ? "bg-amber-500 text-ink-900 border-amber-600/20"
                      : "bg-amber-950/20 border-amber-900/30 text-accent-amber"
                    : active === step.id
                      ? "bg-accent-amber text-ink-900 border-amber-600/20"
                      : "bg-ink-900 border-line text-text-primary"
                }`}
              >
                <div className="font-mono text-2xs tracking-widest uppercase opacity-60">{String(i + 1).padStart(2, "0")} · {step.role}</div>
                <div className="font-display text-sm font-semibold">{step.label}</div>
                <div className="font-mono text-xs opacity-70">{step.sub}</div>
              </button>
            </div>
          ))}
        </div>

        {/* Detail for active */}
        <div className="mt-4 rounded-xl border border-line-soft bg-ink-900/70 px-4 py-3.5">
          <div className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-amber">{activeStep?.label} — detail</div>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{activeStep?.sub}</p>
          {active === "auditor" && (
            <p className="mt-2 font-mono text-xs leading-5 text-text-muted">
              Visually distinct as a gate. Only if all 5 pass does{" "}
              <span className="text-text-primary">generate_checkout</span> mint a TEST{" "}
              <span className="text-accent-cyan">short_url</span>. Otherwise → recovery or FAIL.
            </p>
          )}
        </div>

        {/* Explored → Simplified */}
        <div className="mt-5 rounded-xl border border-dashed border-line bg-ink-900/40 px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="font-mono text-2xs tracking-widest uppercase text-text-faint">
            Explored: {RAZORPAY.exploredSimplified.explored.join(" · ")} → Shipped:{" "}
            <span className="text-text-primary">{RAZORPAY.exploredSimplified.shipped.join(" · ")}</span>
          </div>
          <span className="shrink-0 rounded-full border border-line bg-ink-800 px-2.5 py-1 font-mono text-2xs tracking-widest uppercase text-text-muted">Scope evolution</span>
        </div>
      </div>
    </div>
  );
}

export function FiveChecksRazorpay() {
  const [active, setActive] = useState<string>(RAZORPAY.validators[0]!.id);
  const v = RAZORPAY.validators.find((x) => x.id === active)!;

  return (
    <div className="rounded-xl border border-line bg-ink-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-line-soft">
        <span className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">5 Deterministic Validators — inspect each</span>
        <p className="mt-1 font-mono text-2xs tracking-wide text-text-muted">Pure functions, no LLM, no network. Hover or tap to inspect.</p>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        {RAZORPAY.validators.map((val, i) => (
          <button
            key={val.id}
            type="button"
            onMouseEnter={() => setActive(val.id)}
            onFocus={() => setActive(val.id)}
            onClick={() => setActive(val.id)}
            aria-pressed={active === val.id}
            className={`text-left rounded-xl border p-3.5 transition-colors focus-visible:outline-none ${
              active === val.id
                ? "bg-accent-amber text-ink-900 border-amber-600/20"
                : "bg-ink-900 border-line text-text-primary hover:bg-ink-800"
            }`}
          >
            <div className={`font-mono text-2xs tracking-widest uppercase ${active === val.id ? "text-ink-900/60" : "text-text-faint"}`}>0{i + 1} · {val.fn}</div>
            <div className="mt-1 font-display text-sm font-semibold leading-tight">{val.name}</div>
            <div className={`mt-1 font-mono text-2xs leading-4 ${active === val.id ? "text-ink-900/70" : "text-text-muted"}`}>{val.question}</div>
          </button>
        ))}
      </div>

      <div className="mx-4 mb-4 rounded-xl border border-line-soft bg-ink-900/70 px-4 py-3.5">
        <div className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-cyan">{v.fn} — {v.name}</div>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{v.detail}</p>
        <div className="mt-2 rounded-lg bg-ink-800 px-3 py-2 font-mono text-xs text-text-muted">
          <span className="text-text-faint">Fail example: </span>
          {v.failExample}
        </div>
      </div>
    </div>
  );
}
