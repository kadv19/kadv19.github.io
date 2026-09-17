import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * HeroNetworkCanvas — computational universe (no WebGL).
 * 8 domains: SYSTEMS (center) + AI / BACKEND / PARALLEL / EDGE / ARCHITECTURE / QUANTUM / HARDWARE.
 * Hovering a domain highlights its traces and reveals a contextual label.
 * Canvas 2D, rAF, DPR-aware, paused off-screen, respects reduced-motion.
 */

type Node = {
  id: string;
  label: string;
  longLabel: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  description: string;
};

const NODES_DEF: Array<Omit<Node, "vx" | "vy" | "r">> = [
  {
    id: "systems",
    label: "SYSTEMS",
    longLabel: "SYSTEMS · center",
    x: 0.5,
    y: 0.5,
    color: "#E8B86A",
    description: "The bus. Where constraints, interfaces, and trade-offs are decided.",
  },
  {
    id: "ai",
    label: "AI",
    longLabel: "AI · operator, not the product",
    x: 0.22,
    y: 0.28,
    color: "#3DD2CC",
    description: "RAG, embeddings, on-device Gemma — applied where it beats the baseline.",
  },
  {
    id: "backend",
    label: "BACKEND",
    longLabel: "BACKEND · ship & own",
    x: 0.78,
    y: 0.32,
    color: "#8B7CF8",
    description: "FastAPI, REST, SQLite, S3 — from schema to deploy on Hostinger/S3.",
  },
  {
    id: "parallel",
    label: "PARALLEL",
    longLabel: "PARALLEL · measured speedup",
    x: 0.18,
    y: 0.72,
    color: "#E8B86A",
    description: "pthreads, schedulers, cache curves — FCFS 3.78× at 4 workers, sublinear and honest.",
  },
  {
    id: "edge",
    label: "EDGE",
    longLabel: "EDGE · constrained",
    x: 0.82,
    y: 0.68,
    color: "#3DD2CC",
    description: "On-device inference, 2 KB SRAM → 6 GB RAM budgeting. Airplane-mode verified.",
  },
  {
    id: "arch",
    label: "ARCH",
    longLabel: "ARCHITECTURE · substrate",
    x: 0.5,
    y: 0.14,
    color: "#9AA6BE",
    description: "Pipelines, ISAs, cache — the substrate my schedulers actually run on.",
  },
  {
    id: "quantum",
    label: "QUANTUM",
    longLabel: "QUANTUM · foundational",
    x: 0.5,
    y: 0.86,
    color: "#8B7CF8",
    description: "Qiskit Aer, BB84/E91 — coursework, not a production claim.",
  },
  {
    id: "hardware",
    label: "HARDWARE",
    longLabel: "HARDWARE · longer arc",
    x: 0.32,
    y: 0.52,
    color: "#E8B86A",
    description: "Silicon and systems software converging — direction, not yet a role.",
  },
];

const EDGES: Array<[string, string]> = [
  ["systems", "ai"],
  ["systems", "backend"],
  ["systems", "parallel"],
  ["systems", "edge"],
  ["systems", "arch"],
  ["systems", "quantum"],
  ["systems", "hardware"],
  ["ai", "edge"],
  ["parallel", "arch"],
  ["backend", "edge"],
  ["quantum", "hardware"],
  ["ai", "parallel"],
];

export function HeroNetworkCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [activeNode, setActiveNode] = useState<string>("systems");
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });

  // accessibility: cycle when idle
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setActiveNode((prev) => {
        const idx = NODES_DEF.findIndex((n) => n.id === prev);
        return NODES_DEF[(idx + 1) % NODES_DEF.length]!.id;
      });
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduced]);

  const activeDef = NODES_DEF.find((n) => n.id === activeNode) ?? NODES_DEF[0]!;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const nodes: Node[] = NODES_DEF.map((n) => ({
      ...n,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00018,
      r: n.id === "systems" ? 7.5 : 4.2,
    }));

    let raf = 0;
    let t = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current.x = (e.clientX - rect.left) / rect.width;
      pointerRef.current.y = (e.clientY - rect.top) / rect.height;
      pointerRef.current.active = true;
      let best = nodes[0]!;
      let bestD = Infinity;
      for (const n of nodes) {
        const d = (n.x - pointerRef.current.x) ** 2 + (n.y - pointerRef.current.y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = n;
        }
      }
      if (bestD < 0.05) setActiveNode(best.id);
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    const onClick = (e: PointerEvent) => {
      // tap support for mobile
      const rect = container.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      let best = nodes[0]!;
      let bestD = Infinity;
      for (const n of nodes) {
        const d = (n.x - px) ** 2 + (n.y - py) ** 2;
        if (d < bestD) {
          bestD = d;
          best = n;
        }
      }
      if (bestD < 0.08) setActiveNode(best.id);
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("click", onClick);

    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? true;
        if (running && !reduced) loop();
      },
      { threshold: 0 }
    );
    io.observe(container);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const loop = () => {
      if (!running || reduced) {
        if (reduced) draw(0);
        return;
      }
      raf = window.requestAnimationFrame(loop);
      t += 0.016;
      draw(t);
    };

    const draw = (time: number) => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (!reduced) {
        for (const n of nodes) {
          if (n.id === "systems") continue;
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0.12 || n.x > 0.88) n.vx *= -1;
          if (n.y < 0.12 || n.y > 0.88) n.vy *= -1;
          const cx = 0.5,
            cy = 0.5;
          const dx = cx - n.x,
            dy = cy - n.y;
          n.vx += dx * 0.00002 * Math.sin(time * 0.3 + n.x * 6);
          n.vy += dy * 0.00002 * Math.cos(time * 0.3 + n.y * 6);
          n.vx = Math.max(-0.0004, Math.min(0.0004, n.vx));
          n.vy = Math.max(-0.0004, Math.min(0.0004, n.vy));
        }
      }

      for (const [aId, bId] of EDGES) {
        const a = nodes.find((n) => n.id === aId)!;
        const b = nodes.find((n) => n.id === bId)!;
        const ax = a.x * w,
          ay = a.y * h,
          bx = b.x * w,
          by = b.y * h;
        const isActive =
          activeNode === aId || activeNode === bId || (activeNode === "systems" && (aId === "systems" || bId === "systems"));

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = isActive ? "rgba(232,184,106,0.22)" : "rgba(107,122,148,0.10)";
        ctx.lineWidth = isActive ? 1.25 : 0.75;
        ctx.stroke();

        if (!reduced && isActive) {
          const p = (time * 0.18 + (a.x + b.x) * 2) % 1;
          const px = ax + (bx - ax) * p;
          const py = ay + (by - ay) * p;
          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fillStyle =
            a.color === "#E8B86A" || b.color === "#E8B86A" ? "rgba(232,184,106,0.95)" : "rgba(61,210,204,0.9)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(232,184,106,0.08)";
          ctx.fill();
        }
      }

      for (const n of nodes) {
        const x = n.x * w,
          y = n.y * h;
        const isActive = n.id === activeNode;
        const pulse = isActive ? 1 : 0.52;

        ctx.beginPath();
        ctx.arc(x, y, n.r + (isActive ? 10 : 6), 0, Math.PI * 2);
        ctx.fillStyle =
          n.color === "#E8B86A"
            ? `rgba(232,184,106,${0.08 * pulse})`
            : n.color === "#3DD2CC"
              ? `rgba(61,210,204,${0.07 * pulse})`
              : `rgba(139,124,248,${0.06 * pulse})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.95 * pulse + 0.05;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(x - n.r * 0.25, y - n.r * 0.25, n.r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, n.r + 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? "rgba(232,184,106,0.42)" : "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // label pill
        ctx.font = `500 10px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const labelAlpha = isActive ? 0.96 : 0.44;
        const ly = n.id === "systems" ? y + n.r + 14 : y + n.r + 8;
        const tw = ctx.measureText(n.label).width;
        const pad = 6;
        const rx = 4;
        const bx2 = x - tw / 2 - pad;
        const by2 = ly - 2;
        const bw = tw + pad * 2;
        const bh = 12;
        ctx.fillStyle = `rgba(15,20,30,${isActive ? 0.92 : 0.56})`;
        ctx.beginPath();
        const cr = ctx as unknown as { roundRect?: typeof ctx.roundRect };
        if (cr.roundRect) cr.roundRect(bx2, by2, bw, bh, rx);
        else {
          ctx.moveTo(bx2 + rx, by2);
          ctx.lineTo(bx2 + bw - rx, by2);
          ctx.quadraticCurveTo(bx2 + bw, by2, bx2 + bw, by2 + rx);
          ctx.lineTo(bx2 + bw, by2 + bh - rx);
          ctx.quadraticCurveTo(bx2 + bw, by2 + bh, bx2 + bw - rx, by2 + bh);
          ctx.lineTo(bx2 + rx, by2 + bh);
          ctx.quadraticCurveTo(bx2, by2 + bh, bx2, by2 + bh - rx);
          ctx.lineTo(bx2, by2 + rx);
          ctx.quadraticCurveTo(bx2, by2, bx2 + rx, by2);
          ctx.closePath();
        }
        ctx.fill();
        ctx.fillStyle = `rgba(230,234,242,${labelAlpha})`;
        ctx.fillText(n.label, x, ly + 1.5);

        if (n.id === "systems") {
          ctx.beginPath();
          ctx.arc(x + n.r - 1, y - n.r + 1, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "#3DD2CC";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + n.r - 1, y - n.r + 1, 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(61,210,204,0.18)";
          ctx.fill();
        }
      }

      if (pointerRef.current.active && !reduced) {
        const px = pointerRef.current.x * w;
        const py = pointerRef.current.y * h;
        ctx.beginPath();
        ctx.arc(px, py, 28, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(232,184,106,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    draw(0);
    if (!reduced) loop();

    return () => {
      window.cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("click", onClick);
    };
  }, [reduced, activeNode]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-line bg-ink-800/50 ${className}`}
      role="img"
      aria-label="Interactive network of eight computational domains connected to a central systems node. Hover or tap a domain to highlight its traces and read its description."
      tabIndex={0}
      onFocus={() => {
        // keyboard: allow arrow to cycle
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" aria-hidden />
      {/* overlay instrumentation */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent-cyan shadow-glow animate-pulseGlow" aria-hidden />
        <span className="font-mono text-2xs tracking-widest uppercase text-text-muted">System bus · live</span>
      </div>
      <div className="pointer-events-none absolute right-3 bottom-3 font-mono text-2xs tracking-widest uppercase text-text-faint hidden sm:block">
        8 nodes · {EDGES.length} traces · canvas
      </div>

      {/* Contextual label — the subtle reveal */}
      <div className="absolute inset-x-3 bottom-3 sm:bottom-3 rounded-lg border border-line bg-ink-900/90 backdrop-blur px-3.5 py-2.5 flex items-start gap-3">
        <span
          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: activeDef.color }}
          aria-hidden
        />
        <div className="min-w-0">
          <div className="font-mono text-2xs tracking-[0.14em] uppercase text-accent-amber">
            {activeDef.longLabel}
          </div>
          <div className="text-xs leading-5 text-text-secondary">{activeDef.description}</div>
        </div>
        <span className="hidden sm:inline-flex shrink-0 items-center rounded-full border border-line bg-ink-800 px-2 py-1 font-mono text-2xs tracking-widest uppercase text-text-faint">
          tap / hover
        </span>
      </div>
    </div>
  );
}
