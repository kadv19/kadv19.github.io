import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ProjectHero } from "../components/work/ProjectHero";
import { ArchitectureAiGhost, RetrievalDisclosureAiGhost } from "../components/work/ArchitectureAiGhost";
import { Disclosure } from "../components/work/Disclosure";
import { ProjectNav } from "../components/work/ProjectNav";
import { AI_GHOST } from "../data/projects/aiGhost";

export default function WorkAiGhost() {
  useEffect(() => {
    document.title = "AI Ghost — Sovereign Memory Transfer — Advaith Kashyap";
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", "Sovereign memory transfer: hybrid cloud-edge RAG, 384-d embeddings, on-device Gemma 3 INT4 via MediaPipe — airplane-mode verified. Privacy by local inference.");
  }, []);

  return (
    <div className="bg-ink-900">
      <ProjectHero
        indexLabel="FLAGSHIP 02 / 03 — SOVEREIGN MEMORY"
        category={AI_GHOST.category}
        title={AI_GHOST.title}
        thesis={AI_GHOST.thesis}
        badges={[
          { label: "Privacy-first", tone: "cyan" },
          { label: "Hybrid Cloud-Edge RAG", tone: "amber" },
          { label: "Airplane-mode verified goal", tone: "muted" },
        ]}
        actions={
          <>
            <a href="#architecture" className="inline-flex items-center gap-2 rounded-full bg-accent-cyan px-6 py-3 font-mono text-xs tracking-widest uppercase text-ink-900 hover:bg-cyan-200 transition-colors">
              Architecture → device
            </a>
            <Link to="/work/parallel-scheduler" className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-6 py-3 font-mono text-xs tracking-widest uppercase text-text-primary hover:bg-ink-700 transition-colors">
              Next: Parallel →
            </Link>
          </>
        }
        visual={
          <div className="rounded-xl border border-line bg-ink-800/60 p-5">
            <div className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-cyan">One-line thesis</div>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{AI_GHOST.oneLiner}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2 text-center">
                <div className="font-display text-sm font-semibold text-text-primary">384-d</div>
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">MiniLM</div>
              </div>
              <div className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2 text-center">
                <div className="font-display text-sm font-semibold text-text-primary">169</div>
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">chunks demo</div>
              </div>
              <div className="rounded-lg border border-line-soft bg-ink-900 px-3 py-2 text-center">
                <div className="font-display text-sm font-semibold text-emerald-300">Offline</div>
                <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">Gemma INT4</div>
              </div>
            </div>
            <p className="mt-3 font-mono text-2xs leading-4 text-text-faint">Sources: ppt.md · ai-ghost.html · claude.txt — team project, contribution boundaries below</p>
          </div>
        }
      />

      <div className="mx-auto max-w-shell px-6 lg:px-8 py-10 md:py-12 space-y-8">
        <section className="rounded-xl border border-line bg-ink-800/40 p-6 md:p-7">
          <h2 className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">PROBLEM</h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary max-w-[70ch]">{AI_GHOST.problem}</p>
          <p className="mt-3 text-sm leading-7 text-text-secondary max-w-[70ch]">{AI_GHOST.story}</p>
        </section>

        <section id="architecture" className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Architecture</h2>
          <ArchitectureAiGhost />
          <RetrievalDisclosureAiGhost />
          <div className="rounded-lg border border-line-soft bg-ink-900/40 px-4 py-3 font-mono text-2xs leading-5 text-text-muted">
            Source: <span className="text-text-secondary">ppt.md Process Flow + claude.txt Technical Workflow (Hybrid RAG) + ai-ghost.html Architecture</span>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Implementation</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Disclosure title="Ingestion — how the brain is built" kicker="Factory · one-time heavy" defaultOpen>
              <ul className="space-y-2">
                {AI_GHOST.details.ingestion.map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm leading-6 text-text-secondary">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-accent-amber/50" aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>
            <Disclosure title="Delivery — how it moves" kicker="S3 as async bus">
              <ul className="space-y-2">
                {AI_GHOST.details.delivery.map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm leading-6 text-text-secondary">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-accent-cyan/50" aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-lg border border-line-soft bg-ink-900 px-3 py-2 font-mono text-xs leading-5 text-text-muted">No server, no socket, no shared backend — S3 is the message bus (ai-ghost.html Architecture)</div>
            </Disclosure>
          </div>
          <Disclosure title="On-device inference — MediaPipe specifics" kicker="Android · Java">
            <ul className="space-y-2">
              {AI_GHOST.details.inference.map((t) => (
                <li key={t} className="flex gap-2.5 text-sm leading-6 text-text-secondary">
                  <span className="mt-2.5 h-px w-4 shrink-0 bg-text-muted/50" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Disclosure>
        </section>

        <section className="rounded-xl border border-line bg-ink-800/50 p-6 md:p-7">
          <h2 className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-cyan">OWNERSHIP — what I built</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{AI_GHOST.ownership.statement}</p>
          <ul className="mt-4 space-y-2">
            {AI_GHOST.ownership.built.map((b) => (
              <li key={b} className="flex gap-2.5 text-sm leading-6 text-text-secondary">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent-cyan" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-amber-900/20 bg-amber-950/10 px-3.5 py-3">
            <p className="text-xs leading-5 text-amber-100/80">{AI_GHOST.ownership.teamContext}</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary">Engineering Decisions</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {AI_GHOST.decisions.map((d) => (
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
            {AI_GHOST.limitations.map((l) => (
              <li key={l} className="flex gap-3 rounded-lg border border-line-soft bg-ink-800/30 px-4 py-3">
                <span className="mt-2 h-px w-4 shrink-0 bg-text-faint" aria-hidden />
                <span className="text-sm leading-6 text-text-secondary">{l}</span>
              </li>
            ))}
          </ul>
        </section>

        <Disclosure title="Reproduction" kicker="Factory + Device">
          <pre className="overflow-x-auto rounded-lg border border-line bg-ink-900 p-4 font-mono text-xs leading-5 text-text-secondary">
            {AI_GHOST.reproduction.join("\n")}
          </pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={AI_GHOST.links.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-3.5 py-2 font-mono text-2xs tracking-widest uppercase text-text-primary hover:bg-ink-700">
              GitHub ↗
            </a>
            <span className="rounded-full border border-line-soft bg-ink-900 px-3 py-2 font-mono text-2xs tracking-wide text-text-muted">{AI_GHOST.links.tech}</span>
          </div>
        </Disclosure>
      </div>

      <ProjectNav prev={{ href: "/work/razorpay", label: "Razorpay" }} next={{ href: "/work/parallel-scheduler", label: "Parallel" }} />
    </div>
  );
}
