import { useState } from "react";

export function Disclosure({
  title,
  kicker,
  children,
  defaultOpen = false,
}: {
  title: string;
  kicker?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-line bg-ink-800/40 overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-ink-700/40 transition-colors focus-visible:outline-none"
      >
        <span>
          {kicker && <span className="block font-mono text-2xs tracking-[0.16em] uppercase text-accent-amber">{kicker}</span>}
          <span className="font-display text-[15px] font-medium text-text-primary">{title}</span>
        </span>
        <span
          aria-hidden
          className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border text-sm transition-colors ${
            open ? "bg-accent-amber text-ink-900 border-amber-600/20" : "bg-ink-900 text-text-muted border-line"
          }`}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t border-line-soft">{children}</div>}
    </div>
  );
}
