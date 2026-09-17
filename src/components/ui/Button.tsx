import { cn } from "../../lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-mono text-xs tracking-widest uppercase font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary:
      "bg-accent-amber text-ink-900 hover:bg-accent-amberSoft border border-amber-600/20 shadow-[0_0_20px_-8px_rgba(232,184,106,0.5)]",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-ink-700 border border-transparent",
    outline:
      "bg-transparent text-text-primary border border-line hover:border-line-strong hover:bg-ink-800",
  };
  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-2xs",
    md: "px-6 py-3",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  external,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Props["variant"];
  external?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-mono text-xs tracking-widest uppercase font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-amber focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900";
  const variants: Record<string, string> = {
    primary:
      "bg-accent-amber text-ink-900 hover:bg-accent-amberSoft border border-amber-600/20 shadow-[0_0_20px_-8px_rgba(232,184,106,0.5)]",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary",
    outline:
      "bg-transparent text-text-primary border border-line hover:border-line-strong hover:bg-ink-800",
  };
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(base, variants[variant!], "px-6 py-3", className)}
    >
      {children}
    </a>
  );
}
