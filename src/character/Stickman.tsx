import { useLayoutEffect, useRef, type MutableRefObject } from 'react'
import { StickRig, type Pose } from './rig'
import { POSES, type PoseName } from './poses'

interface LayerProps {
  pose?: PoseName
  overrides?: Partial<Pose>
  /** Receives the live rig so a scene can tween `rig.pose` and call `rig.render()`. */
  rigRef?: MutableRefObject<StickRig | null>
}

/**
 * The character as a <g> to drop into any <svg>. This is what scenes use:
 * one shared SVG overlay, one figure, driven by a timeline.
 */
export function StickmanLayer({ pose = 'idle', overrides, rigRef }: LayerProps) {
  const g = useRef<SVGGElement>(null)
  useLayoutEffect(() => {
    const rig = new StickRig(g.current!, { ...POSES[pose], ...overrides })
    if (rigRef) rigRef.current = rig
    return () => {
      rig.destroy()
      if (rigRef) rigRef.current = null
    }
    // A pose change remounts via `key` on the caller side; the rig itself is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <g ref={g} />
}

interface FigureProps {
  pose: PoseName
  /** Pixels per figure unit. 1 ≈ a 125px-tall figure. */
  unit?: number
  className?: string
  overrides?: Partial<Pose>
  rigRef?: MutableRefObject<StickRig | null>
}

/** Figure-space viewport shared by standalone figures: generous enough for every pose. */
const VB = { x: -84, y: -100, w: 168, h: 182 }
const GROUND = 76

/**
 * A self-contained figure in its own <svg>, standing on a floor line at the
 * bottom edge. Used for the mobile/reduced-motion fallback, the lab, and stubs.
 */
export function StickmanFigure({ pose, unit = 1, className, overrides, rigRef }: FigureProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      width={VB.w * unit}
      height={VB.h * unit}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <StickmanLayer
        key={pose}
        pose={pose}
        rigRef={rigRef}
        overrides={{ scale: 1, x: 0, ground: GROUND, plant: 1, ...overrides }}
      />
    </svg>
  )
}

export const FIGURE_GROUND = GROUND
