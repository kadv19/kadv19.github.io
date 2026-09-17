import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ProjectHero } from "../components/work/ProjectHero";
import { ArchitectureRazorpay, FiveChecksRazorpay } from "../components/work/ArchitectureRazorpay";
import { FailurePathsRazorpay } from "../components/work/FailurePathsRazorpay";
import { Disclosure } from "../components/work/Disclosure";
import { ProjectNav } from "../components/work/ProjectNav";
import { RAZORPAY } from "../data/projects/razorpay";

export default function WorkRazorpay() {
  useEffect(() => {
    document.title = "Razorpay Agentic Commerce — Advaith Kashyap";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Deterministic financial gate for agentic commerce — 5 validators, bounded recovery, TEST MODE. Probabilistic AI recommends, deterministic systems decide.");
  }, []);

  return (
    <div className="bg-ink-900">
      <ProjectHero
        indexLabel="FLAGSHIP 01 / 03 — AGENTIC COMMERCE"
        category={RAZORPAY.category}
        title={RAZORPAY.title}
        thesis={RAZORPAY.thesis}
        badges={[
          { label: RAZORPAY.track, tone: "muted" },
          { label: "Razorpay TEST MODE", tone: "amber" },
          { label: "Deterministic gate", tone: "cyan" },
        ]}
        actions={
          <>
            <a href="#architecture" className="inline-flex items-center gap-2 rounded-full bg-accent-amber px-6 py-3 font-mono text-xs tracking-widest uppercase text-ink-900 hover:bg-accent-amberSoft transition-colors">
              Architecture → gate
            </a>
            <Link to="/work/ai-ghost" className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-6 py-3 font-mono text-xs tracking-widest uppercase text-text-primary hover:bg-ink-700 transition-colors">
              Next: AI Ghost →
            </Link>
          </>
        }
        visual={
          <div className="rounded-xl border border-line bg-ink-800/60 p-5">
            <div className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-amber">One-line thesis</div>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{RAZORPAY.oneLiner}</p>
            <div className="mt-4 rounded-lg border border-amber-900/30 bg-amber-950/15 px-3 py-2.5 font-mono text-2xs leading-5 text-amber-100/80">
              {RAZORPAY.testMode}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2 text-center">
                <div className="font-display text-sm font-semibold text-text-primary">5</div>
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">checks</div>
              </div>
              <div className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2 text-center">
                <div className="font-display text-sm font-semibold text-text-primary">MAX 3</div>
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">loops</div>
              </div>
              <div className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2 text-center">
                <div className="font-display text-sm font-semibold text-emerald-300">Gated</div>
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">not guessed</div>
              </div>
            </div>
          </div>
        }
      />

      {/* PROBLEM → CONSTRAINT → ... progressive sections */}
      <div className="mx-auto max-w-shell px-6 lg:px-8 py-10 md:py-12 space-y-8">
        {/* PROBLEM */}
        <section aria-labelledby="problem" className="rounded-xl border border-line bg-ink-800/40 p-6 md:p-7">
          <h2 id="problem" className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">PROBLEM</h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary max-w-[70ch]">
            Normal agentic commerce lets an LLM decide to charge. That creates financial risk and kills user agency — a blind agent on the payment path means an LLM outage becomes a payment outage. Most teams demo a generic chatbot; this project gates money with deterministic code.
          </p>
          <div className="mt-3 rounded-lg border border-line-soft bg-ink-900/60 px-4 py-3 font-mono text-xs leading-5 text-text-muted">
            Hook from README: “Three days ago, Claude, ChatGPT and Grok — all went down at once. If an AI needs one of those to decide whether it’s safe to charge your card, that outage becomes a broken checkout. We built something that doesn’t have that problem.”
          </div>
        </section>

        <section id="architecture" className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Architecture</h2>
          <ArchitectureRazorpay />
          <FiveChecksRazorpay />
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Failure / Edge Cases — the safety boundary</h2>
          <FailurePathsRazorpay />
          <div className="rounded-xl border border-line-soft bg-ink-900/40 px-4 py-3 font-mono text-2xs leading-5 text-text-muted">
            Source: <span className="text-text-secondary">src/graph.py:19 StateGraph wiring · src/recovery_agent.py:14 bounded loop · src/state.py:122 core law</span> — every transition is{" "}
            <span className="text-accent-cyan">append_audit</span>’d; audit_trail is the product.
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Measurement — three separate claims</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { m: RAZORPAY.metrics.validationBenchmark, tone: "amber" },
              { m: RAZORPAY.metrics.recovery, tone: "violet" },
              { m: RAZORPAY.metrics.structural, tone: "emerald" },
            ].map(({ m, tone }) => (
              <div key={m.label} className="rounded-xl border border-line bg-ink-800/60 p-5 flex flex-col">
                <span
                  className={`inline-flex self-start rounded-full border px-2.5 py-1 font-mono text-2xs tracking-widest uppercase ${
                    tone === "amber"
                      ? "border-amber-900/30 bg-amber-950/20 text-accent-amber"
                      : tone === "violet"
                        ? "border-violet-900/30 bg-violet-950/20 text-accent-violet"
                        : "border-emerald-900/30 bg-emerald-950/15 text-emerald-300"
                  }`}
                >
                  {m.label}
                </span>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{m.detail}</p>
                <div className="mt-3 rounded-lg border border-line-soft bg-ink-900 px-3 py-2.5 font-mono text-xs leading-5 text-text-primary">
                  {"numbers" in m && "precision" in (m.numbers as any) && (
                    <>
                      Precision {(m.numbers as any).precision} · Recall {(m.numbers as any).recall} · invalidMarkedPass {(m.numbers as any).invalidMarkedPass}
                    </>
                  )}
                  {"recovered" in (m.numbers as any) && <>{(m.numbers as any).recovered}/{(m.numbers as any).outOf} recovered · bounded loops</>}
                  {"invalidReachedCheckout" in (m.numbers as any) && (
                    <>invalid→checkout 0 · FAIL→checkout 0 · {String((m.numbers as any).amountConversionCorrect)} · PASS {(m.numbers as any).totalPass} / FAIL {(m.numbers as any).totalFail}</>
                  )}
                </div>
                <div className="mt-3 rounded-lg border border-line bg-ink-900/70 px-3 py-2">
                  <div className="font-mono text-2xs tracking-[0.14em] uppercase text-emerald-300">Proves</div>
                  <p className="text-xs leading-5 text-text-muted">{m.doesProve}</p>
                </div>
                <div className="mt-2 rounded-lg border border-amber-900/20 bg-amber-950/10 px-3 py-2">
                  <div className="font-mono text-2xs tracking-[0.14em] uppercase text-amber-300">Does not prove</div>
                  <p className="text-xs leading-5 text-amber-100/70">{m.doesNotProve}</p>
                </div>
                <div className="mt-2 font-mono text-2xs leading-4 text-text-faint">{m.source}</div>
              </div>
            ))}
          </div>
          <p className="font-mono text-2xs tracking-widest uppercase text-text-faint text-center">
            Do not blend into “100% safe” · each claim is labeled separately per source verification
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Engineering Decisions</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {RAZORPAY.decisions.map((d) => (
              <div key={d.title} className="rounded-xl border border-line bg-ink-800/50 p-5">
                <div className="font-display text-sm font-semibold text-text-primary">{d.title}</div>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{d.why}</p>
                <div className="mt-2 font-mono text-2xs leading-4 text-text-faint">{d.source}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Limitations · what this prototype does not prove</h2>
          <ul className="space-y-2">
            {RAZORPAY.limitations.map((l) => (
              <li key={l} className="flex gap-3 rounded-lg border border-line-soft bg-ink-800/30 px-4 py-3">
                <span className="mt-2 h-px w-4 shrink-0 bg-text-faint" aria-hidden />
                <span className="text-sm leading-6 text-text-secondary">{l}</span>
              </li>
            ))}
          </ul>
        </section>

        <Disclosure title="Reproduction — verified commands" kicker="GitHub + local run">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <a
                href={RAZORPAY.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-3.5 py-2 font-mono text-2xs tracking-widest uppercase text-text-primary hover:bg-ink-700"
              >
                GitHub ↗
              </a>
              <span className="rounded-full border border-line-soft bg-ink-900 px-3 py-2 font-mono text-2xs tracking-wide text-text-muted">{RAZORPAY.links.apiDocs}</span>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-line bg-ink-900 p-4 font-mono text-xs leading-5 text-text-secondary">
              {RAZORPAY.reproduction.join("\n")}
            </pre>
            <p className="font-mono text-2xs leading-4 text-text-faint">
              All commands from README “Quick Start” + benchmarks/run_full_benchmark.py. Env .env is gitignored; missing keys → stub (never masks as live, logged in audit_trail).
            </p>
          </div>
        </Disclosure>

        <Disclosure title="What was not shipped — held back intentionally" kicker="Honest scope">
          <p className="text-sm leading-6 text-text-secondary">
            Trust Dashboard + opportunity network (cross-merchant, strict consent) were prototyped on{" "}
            <span className="font-mono text-xs text-text-primary">feature/phase10-trust-dashboard</span> but not merged to keep the submission fully
            verified. No Agent Studio or NPCI UAP integration claimed — descriptor at{" "}
            <span className="font-mono text-xs">GET /.well-known/agent.json</span> exposes only what exists (catalog_discovery, bounded_transaction, audit_trail).
          </p>
        </Disclosure>
      </div>

      <ProjectNav prev={{ href: "/work/parallel-scheduler", label: "Parallel" }} next={{ href: "/work/ai-ghost", label: "AI Ghost" }} />
    </div>
  );
}
