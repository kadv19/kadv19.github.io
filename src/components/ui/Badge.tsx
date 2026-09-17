import { cn } from "../../lib/cn";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "amber" | "cyan" | "muted";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-2xs font-medium tracking-widest uppercase font-mono";
  const variants: Record<string, string> = {
    default: "border-line bg-ink-800 text-text-secondary",
    amber: "border-amber-900/30 bg-amber-950/30 text-accent-amber",
    cyan: "border-cyan-900/30 bg-cyan-950/20 text-accent-cyan",
    muted: "border-line-soft bg-ink-800/60 text-text-muted",
  };
  return <span className={cn(base, variants[variant], className)}>{children}</span>;
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="h-px w-8 bg-accent-amber/60" aria-hidden />
      <span className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">
        {children}
      </span>
    </div>
  );
}
