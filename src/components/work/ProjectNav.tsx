import { Link } from "react-router-dom";

export function ProjectNav({
  prev,
  next,
  backHref = "/#work",
  backLabel = "Back to work",
}: {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <nav aria-label="Project navigation" className="mx-auto max-w-shell px-6 lg:px-8 py-8 flex flex-wrap items-center justify-between gap-3">
      <Link
        to={backHref}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-4 py-2.5 font-mono text-2xs tracking-widest uppercase text-text-muted hover:text-text-primary hover:border-line-strong transition-colors"
      >
        ← {backLabel}
      </Link>
      <div className="flex gap-2 ml-auto">
        {prev && (
          <Link
            to={prev.href}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-800 px-4 py-2.5 font-mono text-2xs tracking-widest uppercase text-text-primary hover:bg-ink-700 transition-colors"
          >
            ← {prev.label}
          </Link>
        )}
        {next && (
          <Link
            to={next.href}
            className="inline-flex items-center gap-2 rounded-full bg-accent-amber px-4 py-2.5 font-mono text-2xs tracking-widest uppercase text-ink-900 hover:bg-accent-amberSoft transition-colors"
          >
            {next.label} →
          </Link>
        )}
      </div>
    </nav>
  );
}
