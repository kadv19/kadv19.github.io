/**
 * The one place a pinned, scrubbed scene's ScrollTrigger is configured.
 * Both scenes call this instead of hand-writing the object, so they cannot drift apart.
 *
 *   scrollTrigger: pinnedScene({ id: 'intro', trigger: el, screens: 2.4, order: 0 })
 *
 * What each field is for:
 *
 * - `end` is a pixel distance computed from the window and re-evaluated on refresh
 *   (`invalidateOnRefresh`). It has no dependency on any element's size, so there is nothing
 *   left to "measure too early". (A "+=240%" string also resolves against the viewport, not
 *   the trigger, so this is not the cause of the bug it was introduced alongside; it simply
 *   removes one variable and makes the length obvious in the diagnostic table.)
 * - `pinSpacing: true` is GSAP's default; it is explicit so nobody turns it off by accident.
 * - `refreshPriority` makes earlier scenes refresh first. A later scene's `start` depends on the
 *   earlier scene's pin-spacer already existing; refreshed in the wrong order, the later scene
 *   measures a page that is too short and its start/end land too early (diagnostic case E).
 * - `id` lets the diagnostic (and ScrollTrigger.getById) name each scene.
 * - `onToggle` hides the section the instant scroll leaves its active range, in EITHER direction,
 *   not just before it starts. Without this, a scene that has finished (scrolled past its `end`)
 *   keeps rendering its last frame while it un-pins and resumes normal document flow — so as the
 *   page keeps scrolling, that finished frame visibly slides up and off, as a "duplicate" of
 *   whatever the next (overlapped, see pinOverlap.ts) scene is now showing in the same spot. Every
 *   scene after the first is also hidden synchronously here, before ScrollTrigger has measured
 *   anything, so there's no flash of it in its rest position at (0,0) on first paint.
 */
export function pinnedScene(opts: {
  id: string
  trigger: HTMLElement
  /** Scroll length of the scene, in viewport heights. */
  screens: number
  /** 0 for the first pinned scene on the page, 1 for the next, and so on (DOM order). */
  order: number
  scrub?: number
}): ScrollTrigger.Vars {
  if (opts.order > 0) opts.trigger.style.visibility = 'hidden'
  return {
    id: opts.id,
    trigger: opts.trigger,
    start: 'top top',
    end: () => `+=${Math.round(window.innerHeight * opts.screens)}`,
    pin: true,
    pinSpacing: true,
    scrub: opts.scrub ?? 0.6,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    refreshPriority: 100 - opts.order,
    onToggle: (self) => {
      opts.trigger.style.visibility = self.isActive ? 'visible' : 'hidden'
    },
  }
}
