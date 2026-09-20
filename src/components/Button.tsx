import type { AnchorHTMLAttributes } from 'react'

/** The one primary action style. Solid accent, generous target. */
export function ButtonLink({ className = '', children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`inline-flex items-center justify-center rounded-full bg-blue px-8 text-lg font-medium text-white transition-colors hover:bg-[#1f47e0] ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
