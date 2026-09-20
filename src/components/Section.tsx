import type { ReactNode } from 'react'

/** A normal-flow page section: consistent width, rhythm and heading. */
export function Section({
  id,
  title,
  children,
  className = '',
}: {
  id?: string
  title?: string
  children: ReactNode
  className?: string
}) {
  const headingId = id ? `${id}-heading` : undefined
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={`mx-auto w-full max-w-6xl px-6 py-24 md:px-10 md:py-32 ${className}`}>
      {title && (
        <h2 id={headingId} className="mb-12 max-w-[20ch] text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-5xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
