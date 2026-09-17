import { useState } from "react";
import { AI_GHOST } from "../../data/projects/aiGhost";

export function ArchitectureAiGhost() {
  const [active, setActive] = useState<string>("memory");

  return (
    <div className="rounded-xl border border-line bg-ink-800/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-line-soft flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-2xs tracking-[0.18em] uppercase text-text-muted">Architecture — Preparation | Device · cloud / device boundary</span>
        <span className="rounded-full border border-accent-cyan/30 bg-cyan-950/15 px-2.5 py-1 font-mono text-2xs tracking-widest uppercase text-accent-cyan">Offline is the point</span>
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-0">
        {/* Preparation */}
        <div className="p-5 bg-ink-900/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-accent-amber" aria-hidden />
            <span className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-amber">PREPARATION — Cloud (heavy, once)</span>
          </div>

          <div className="space-y-2">
            {AI_GHOST.architecture.preparation.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                aria-pressed={active === s.id}
                className={`w-full text-left rounded-xl border px-3.5 py-3 flex items-start gap-3 transition-colors ${active === s.id ? "bg-accent-amber text-ink-900 border-amber-600/20" : "bg-ink-800 border-line text-text-primary hover:bg-ink-700"}`}
              >
                <span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-2xs ${active === s.id ? "bg-ink-900/10 border-ink-900/20 text-ink-900" : "bg-ink-900 border-line text-text-muted"}`}>{String(i + 1)}</span>
                <span>
                  <span className="font-display text-sm font-semibold leading-tight">{s.label}</span>
                  <span className={`block font-mono text-2xs leading-4 ${active === s.id ? "text-ink-900/60" : "text-text-muted"}`}>{s.sub}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Boundary */}
        <div className="hidden md:flex flex-col items-center justify-center px-4 bg-ink-900/50 border-x border-dashed border-line-soft">
          <span className="font-mono text-2xs tracking-[0.18em] uppercase text-text-faint">— boundary —</span>
          <div className="mt-2 h-16 w-px bg-gradient-to-b from-accent-amber/40 via-accent-cyan/30 to-accent-violet/25" aria-hidden />
          <span className="mt-2 rounded-full border border-line bg-ink-800 px-2 py-1 font-mono text-2xs tracking-widest uppercase text-text-muted">S3 URLs</span>
          <span className="mt-2 font-mono text-2xs tracking-widest uppercase text-text-faint">or P2P Wi-Fi</span>
        </div>
        <div className="md:hidden flex items-center justify-center gap-2 py-3 border-y border-dashed border-line-soft bg-ink-900/30">
          <span className="h-px w-12 bg-line" aria-hidden />
          <span className="font-mono text-2xs tracking-[0.16em] uppercase text-text-faint">delivery → device</span>
          <span className="h-px w-12 bg-line" aria-hidden />
        </div>

        {/* Device */}
        <div className="p-5 bg-cyan-950/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(61,210,204,0.5)]" aria-hidden />
            <span className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-cyan">DEVICE — On-device (daily, private)</span>
          </div>

          <div className="space-y-2">
            {AI_GHOST.architecture.device.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                aria-pressed={active === s.id}
                className={`w-full text-left rounded-xl border px-3.5 py-3 flex items-start gap-3 transition-colors ${active === s.id ? "bg-accent-cyan text-ink-900 border-cyan-600/20" : "bg-ink-800 border-line text-text-primary hover:bg-ink-700"}`}
              >
                <span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-2xs ${active === s.id ? "bg-ink-900/10 border-ink-900/20 text-ink-900" : "bg-ink-900 border-line text-text-muted"}`}>{String(i + 1)}</span>
                <span>
                  <span className="font-display text-sm font-semibold leading-tight">{s.label}</span>
                  <span className={`block font-mono text-2xs leading-4 ${active === s.id ? "text-ink-900/60" : "text-text-muted"}`}>{s.sub}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-cyan-900/30 bg-cyan-950/20 px-3 py-2.5 flex gap-2">
            <span className="text-accent-cyan mt-0.5" aria-hidden>✦</span>
            <p className="font-mono text-2xs leading-5 text-cyan-100/80">{AI_GHOST.architecture.cloudBoundaryNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RetrievalDisclosureAiGhost() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-line bg-ink-800/40 overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-ink-700/30 transition-colors"
      >
        <span>
          <span className="font-mono text-2xs tracking-[0.16em] uppercase text-accent-cyan">How retrieval works — expand</span>
          <span className="block font-display text-[15px] font-medium text-text-primary">Query → embedding → similarity → top results → generation</span>
        </span>
        <span className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${open ? "bg-accent-cyan text-ink-900 border-cyan-600/20" : "bg-ink-900 text-text-muted border-line"}`}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 border-t border-line-soft space-y-3">
          <ol className="space-y-2" role="list">
            {AI_GHOST.details.retrievalLoop.map((step, i) => (
              <li key={step} className="flex gap-3 rounded-lg border border-line-soft bg-ink-900/60 px-3.5 py-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-800 border border-line font-mono text-2xs text-text-muted">{String(i + 1)}</span>
                <span className="text-sm leading-6 text-text-secondary">{step}</span>
              </li>
            ))}
          </ol>
          <p className="font-mono text-2xs tracking-widest uppercase text-text-faint">Embeddings are 384-d · normalized · dot-product on device · no cloud call after delivery</p>
        </div>
      )}
    </div>
  );
}
