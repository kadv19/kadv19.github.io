import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Section, SectionGrid } from "../components/ui/Section";
import { PROJECTS } from "../data/content";
import { SecondaryGrid } from "../components/work/SecondaryGrid";



function hrefFor(id: string) {
  if (id === "aighost") return "/work/ai-ghost";
  if (id === "parallel") return "/work/parallel-scheduler";
  // deepfake + terrainfit are secondary — keep as work anchor but link to closest flagship demo of case-study language
  return "/work/razorpay";
}

export function Work() {
  const flagship = PROJECTS.filter((p) => p.id === "aighost" || p.id === "parallel");
  const rest = PROJECTS.filter((p) => p.id !== "aighost" && p.id !== "parallel");

  return (
    <Section
      id="work"
      indexLabel="02 — WORK"
      annotation="Selected work — scoped to demonstration"
      kicker="Selected Work"
      title="Four systems that taught me something."
      intro="Each project is scoped to what was actually built and measured. No paper claims without an artifact. Flagships have dedicated case studies — the technical archive lives at /work/*."
    >
      {/* Flagship preview — links to dedicated routes */}
      <div className="mb-4 flex items-center gap-2">
        <span className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-amber">Flagship — dedicated case studies</span>
        <span className="h-px flex-1 bg-line-soft" aria-hidden />
        <span className="font-mono text-2xs tracking-widest uppercase text-text-faint">/work/*</span>
      </div>

      <SectionGrid cols={2}>
        {[
          {
            id: "razorpay",
            badge: "built · TEST MODE",
            badgeVariant: "amber" as const,
            award: "Razorpay AI Buildathon · Track 01",
            title: "Razorpay Agentic Commerce — Transaction Integrity Agent",
            summary:
              "LLM proposes, deterministic code disposes. 5 pure validators gate every money action; bounded recovery turns near-misses into revenue — safely. TEST MODE only.",
            stack: ["Python", "LangGraph", "FastAPI", "Razorpay", "Pydantic"],
            href: "/work/razorpay",
            metrics: [
              { label: "Validators", value: "5 · 1.0 / 1.0 (180)" },
              { label: "Safety invariant", value: "0 → checkout on FAIL" },
            ],
          },
          ...flagship.map((p) => ({
            id: p.id,
            badge: p.status,
            badgeVariant: (p.status === "tested" ? "cyan" : ("amber" as const)),
            award: p.award,
            title: p.title,
            summary: p.summary,
            stack: p.stack.slice(0, 5),
            href: hrefFor(p.id),
            metrics: p.metrics,
          })),
        ].map((p) => (
          <Card key={p.id} hover className="flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <Badge variant={p.badgeVariant as any}>{p.badge}</Badge>
              <span className="font-mono text-2xs tracking-widest uppercase text-text-muted text-right">{p.award}</span>
            </div>

            <h3 className="font-display text-lg leading-tight tracking-tight text-text-primary text-balance">{p.title}</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{p.summary}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.stack.map((tech: string) => (
                <span key={tech} className="rounded-full border border-line bg-ink-900 px-2.5 py-1 font-mono text-2xs tracking-wide text-text-muted">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {p.metrics.map((m: any) => (
                <div key={m.label} className="rounded-lg border border-line-soft bg-ink-800/60 px-3 py-2.5">
                  <div className="font-mono text-2xs tracking-widest uppercase text-text-muted">{m.label}</div>
                  <div className="font-display text-sm font-medium text-text-primary mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            <Link
              to={p.href}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-accent-amber px-5 py-2.5 font-mono text-xs tracking-widest uppercase text-ink-900 hover:bg-accent-amberSoft transition-colors"
            >
              Open case study <span aria-hidden>→</span>
            </Link>
          </Card>
        ))}
      </SectionGrid>

      {/* Remainder teasers (not flagship) */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Also previewed — deeper in case studies</span>
          <span className="h-px flex-1 bg-line-soft" aria-hidden />
        </div>
        <SectionGrid cols={2}>
          {rest.map((p) => (
            <Card key={p.id} hover padding="tight" className="flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-2">
                <Badge variant={p.status === "ongoing" ? "muted" : "amber"}>{p.status}</Badge>
                <span className="font-mono text-2xs tracking-widest uppercase text-text-muted text-right">{p.award}</span>
              </div>
              <h3 className="font-display text-[15px] font-semibold leading-tight text-text-primary">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary line-clamp-3">{p.summary}</p>
              <Link to={p.id === "terrainfit" ? "/work/parallel-scheduler" : "/work/ai-ghost"} className="mt-3 inline-flex items-center gap-1 font-mono text-2xs tracking-widest uppercase text-text-muted hover:text-accent-amber transition-colors">
                View archive →
              </Link>
            </Card>
          ))}
        </SectionGrid>
      </div>

      {/* Secondary grid — full, conservative */}
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="font-mono text-2xs tracking-[0.16em] uppercase text-text-muted">Secondary — lighter entries, conservative scope</span>
          <span className="h-px flex-1 bg-line-soft" aria-hidden />
        </div>
        <SecondaryGrid />
        <p className="mt-3 text-center font-mono text-2xs tracking-widest uppercase text-text-faint">Secondary projects are documented but not inflated into flagships · team/shared ownership noted where uncertain</p>
      </div>
    </Section>
  );
}
