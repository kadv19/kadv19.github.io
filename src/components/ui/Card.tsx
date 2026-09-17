import { cn } from "../../lib/cn";

export function Card({
  children,
  className,
  hover = false,
  padding = "default",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "default" | "none" | "tight";
}) {
  return (
    <div
      className={cn(
        "surface-lab rounded-xl overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-lab-hover hover:border-line-strong hover:-translate-y-[1px]",
        padding === "default" && "p-6 md:p-7",
        padding === "tight" && "p-5",
        padding === "none" && "p-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-3", className)}>
      {children}
    </div>
  );
}

export function CardMeta({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-2xs tracking-widest uppercase text-text-muted">
      {children}
    </span>
  );
}
