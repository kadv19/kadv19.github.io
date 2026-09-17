import { cn } from "../../lib/cn";
import { Kicker } from "./Badge";

type SectionProps = {
  id: string;
  kicker?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  muted?: boolean;
  /** e.g. "01 / SYSTEM" */
  indexLabel?: string;
  /** small technical annotation for the header rail */
  annotation?: string;
};

export function Section({
  id,
  kicker,
  title,
  intro,
  children,
  className,
  titleClassName,
  muted = false,
  indexLabel,
  annotation,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        "relative scroll-mt-20 py-16 md:py-24 lg:py-28",
        muted && "bg-ink-800/40 border-y border-line-soft",
        className
      )}
    >
      {/* Laboratory transition language — hairline + numbered rail */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent opacity-60"
        aria-hidden
      />
      {/* left index rail — visible md+ */}
      {indexLabel && (
        <div
          className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-accent-amber/35 via-line/60 to-transparent lg:block"
          aria-hidden
        />
      )}

      <div className="mx-auto max-w-shell px-6 lg:px-8">
        {/* Transition header row */}
        {(indexLabel || annotation) && (
          <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-dashed border-line-soft pb-4">
            {indexLabel && (
              <span className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">
                {indexLabel}
              </span>
            )}
            {indexLabel && annotation && (
              <span className="h-3 w-px bg-line" aria-hidden />
            )}
            {annotation && (
              <span className="font-mono text-2xs tracking-[0.14em] uppercase text-text-faint">
                {annotation}
              </span>
            )}
            <span className="ml-auto hidden items-center gap-2 font-mono text-2xs tracking-widest uppercase text-text-faint sm:flex" aria-hidden>
              <span className="h-1 w-1 rounded-full bg-text-faint" />
              lab notebook — phase 2
            </span>
          </div>
        )}

        <header className="max-w-prose mb-10 md:mb-14">
          {kicker && <Kicker>{kicker}</Kicker>}
          <h2
            id={`${id}-heading`}
            className={cn(
              "font-display text-3xl md:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-tight text-text-primary text-balance",
              titleClassName
            )}
          >
            {title}
          </h2>
          {intro && (
            <p className="mt-4 text-[15px] leading-7 text-text-secondary text-pretty">
              {intro}
            </p>
          )}
        </header>

        {children}
      </div>
    </section>
  );
}

export function SectionGrid({
  children,
  cols = 2,
  className,
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}) {
  const colMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };
  return <div className={cn("grid gap-6 md:gap-7", colMap[cols], className)}>{children}</div>;
}
