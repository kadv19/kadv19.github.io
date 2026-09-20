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
  }
}
