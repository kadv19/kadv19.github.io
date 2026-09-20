import { useLayoutEffect, type RefObject } from 'react'

/** Design canvas for pinned scenes. All scene coordinates are in these units. */
export const STAGE = { w: 1280, h: 720 } as const

/**
 * Scales the fixed 1280×720 stage to fit its container ("contain"), centred.
 *
 * Deliberately does NOT touch ScrollTrigger:
 *  - A CSS transform never changes layout, and the stage is absolutely positioned, so
 *    scaling it cannot change the height of the section ScrollTrigger measures.
 *  - It listens to `window` resize instead of observing the container with a
 *    ResizeObserver, because the container is the *pinned* element and GSAP rewrites its
 *    size while pinning/refreshing. Observing it and refreshing from the callback is a
 *    feedback loop (refresh → resize → fit → refresh).
 * ScrollTrigger already refreshes itself on window resize and load.
 */
export function useStageScale(container: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const c = container.current
    const s = stage.current
    if (!c || !s) return
    const fit = () => {
      const w = c.clientWidth
      const h = c.clientHeight
      if (!w || !h) return
      s.style.transform = `translate(-50%, -50%) scale(${Math.min(w / STAGE.w, h / STAGE.h)})`
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [container, stage])
}
