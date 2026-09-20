import { createContext, useContext, useLayoutEffect, useRef, type ReactNode } from 'react'
import { StickRig } from '../character/rig'
import { POSES } from '../character/poses'

/**
 * One rig, mounted once, at the app root.
 *
 * The <g> that the rig draws into is a React-rendered element. We pass its ref
 * to the rig in a layout effect. We do NOT create the <g> with createElementNS
 * and append it ourselves — React must own every node in the SVG's subtree, or
 * reconciliation will crash on the next render (NotFoundError: insertBefore).
 *
 * StickRig's constructor clears its root and creates its own nested <g> inside
 * it. That nested <g> and everything below it is owned entirely by the rig;
 * React never reconciles it. The outer <g ref={gRef}> is empty from React's
 * perspective and never changes.
 *
 * The rig starts parked at (-10000, -10000). A scene claims it by writing real
 * coordinates into `rig.pose` and calling `rig.render()`.
 */

interface RigContextValue {
  rigRef: React.MutableRefObject<StickRig | null>
}

const RigContext = createContext<RigContextValue | null>(null)

export function useRig(): React.MutableRefObject<StickRig | null> {
  const ctx = useContext(RigContext)
  if (!ctx) throw new Error('useRig must be used inside <CharacterOverlay>')
  return ctx.rigRef
}

export function CharacterOverlay({ children }: { children: ReactNode }) {
  const gRef = useRef<SVGGElement>(null)
  const rigRef = useRef<StickRig | null>(null)

  useLayoutEffect(() => {
    const g = gRef.current
    if (!g) return
    const rig = new StickRig(g, {
      ...POSES.idle,
      x: -10000,
      y: -10000,
      scale: 1,
      ground: 0,
      plant: 0,
    })
    rigRef.current = rig
    return () => {
      rig.destroy()
      rigRef.current = null
    }
  }, [])

  const value: RigContextValue = { rigRef }

  return (
    <RigContext.Provider value={value}>
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none fixed inset-0 z-[40] h-full w-full"
        style={{ overflow: 'visible' }}
      >
        <g ref={gRef} />
      </svg>
      {children}
    </RigContext.Provider>
  )
}
