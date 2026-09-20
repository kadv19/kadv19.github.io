import type { RefObject } from 'react'
import { focus, profile, site } from '../../data/content'

/** The text block he catches. Same words as the intro's intro paragraph. */
export function FallingBlock({ className = '' }: { className?: string }) {
  return <p className={`text-[21px] leading-[1.6] text-ink-soft ${className}`}>{profile.intro}</p>
}

/** The about heading replica — falls with everything else, nobody catches it. */
export function FallingAbout({ className = '' }: { className?: string }) {
  return <h2 className={`font-semibold tracking-[-0.03em] text-ink ${className}`}>{site.aboutHeading}</h2>
}

/** A focus-item replica — falls with everything else, nobody catches it. */
export function FallingFact({ id }: { id: string }) {
  const f = focus.find((x) => x.id === id)!
  return (
    <div className="border-t border-line pt-3">
      <p className="text-[18px] font-semibold text-ink">{f.title}</p>
      <p className="mt-0.5 text-[16px] text-ink-mute">{f.detail}</p>
    </div>
  )
}

/**
 * A dashed web line drawn inside a full-stage SVG. Its endpoints are set by the
 * timeline via setAttribute('d', ...). The parent passes a ref to the <path>
 * so the timeline can hold it directly, avoiding a querySelector round trip.
 */
export function WebLine({ pathRef }: { pathRef: RefObject<SVGPathElement | null> }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-block="web-svg"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ overflow: 'visible' }}
    >
      <path
        ref={pathRef}
        data-block="web"
        d="M0 0"
        stroke="var(--color-ink-mute)"
        strokeWidth="1.2"
        strokeDasharray="4 5"
        fill="none"
        opacity="0"
      />
    </svg>
  )
}
