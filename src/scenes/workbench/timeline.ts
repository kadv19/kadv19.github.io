import { gsap } from '../../motion/gsap'
import { POSES } from '../../character/poses'
import type { Pose, StickRig } from '../../character/rig'
import { measureStage, type StageTransform } from '../../motion/stageToWindow'
import { applyShadowPose } from '../../motion/applyShadowPose'
import { projects } from '../../data/content'
import {
  CHAR_SCALE,
  GROUND,
  SIT,
} from './frames'

/**
 * Workbench scene — one scroll-scrubbed GSAP timeline.
 *
 *  0.1  he drops in from above (full coder: glasses on, laptop on knees) and
 *        lands butt-on-bench — legs dangle lowest, so they arrive first
 *  0.8  tiny rock on impact, then still
 *  1.2  project 0 shown; laptop tap marks it
 *  2.4  cross-slide to project 1; tap
 *  3.8  cross-slide to project 2; tap
 *  5.2  stand up from the bench, props away
 *  5.8  walk off right so nothing floats over the projects list below
 *
 * He never walks here — he falls in, then the frame content moves under him.
 * Project divs are scene-local DOM crossfaded directly (deterministic under
 * scrub); only the shared rig goes through the shadow pose.
 *
 * The first frame is the Hulk scene's last frame (same frame geometry, same first card; see
 * projectFrame.ts), and the section stays hidden until this pin starts (its box overlaps the tail of
 * the Hulk scene, see motion/pinOverlap.ts), so the handoff is a cut between identical pictures.
 */

const STRIDE = 52 // stage px of travel per walk-cycle unit, per unit of character scale

export interface WorkbenchTimelineApi {
  tl: gsap.core.Timeline
  setStage: (t: StageTransform) => void
}

export function buildWorkbenchTimeline(opts: {
  root: HTMLElement
  rig: StickRig
  scrollTrigger?: ScrollTrigger.Vars
}): WorkbenchTimelineApi {
  const { root, rig, scrollTrigger } = opts
  const q = (name: string) => root.querySelector<HTMLElement>(`[data-block="${name}"]`)!
  const el = {
    cards: projects.map((p) => q(`project-${p.slug}`)),
    more: q('more'),
  }

  let stage: StageTransform = measureStage(root)

  /* ---- shadow pose: full coder dropping in from above the stage ---- */
  const S: Pose = {
    ...POSES.coder,
    x: SIT.x,
    y: -160,
    scale: CHAR_SCALE,
    dir: 1,
    ground: GROUND,
    plant: 0, // seated: explicit pelvis, feet dangle onto the frame
    lift: 0,
    weight: 1,
    span: 0,
    wa: 0,
    rw: 0,
    lw: 0,
    glasses: 1,
    laptop: 1,
  }

  const sync = () => {
    // Re-measure every frame: pinning moves the section, cached transforms go stale.
    stage = measureStage(root)
    // Visibility (both before this pin starts AND after it ends) is handled centrally by
    // pinnedScene()'s onToggle — see motion/pinnedScene.ts. This also stops the populated frame from
    // bleeding into the top of the Contact section below: once scroll passes this pin's end, this
    // whole section disappears instead of visibly scrolling away with the last project still shown.
    // Walk cycle is distance-driven (feet never skate); wa gates it to the exit walk.
    S.wp = (S.dir * S.x) / (STRIDE * S.scale)
    // Only drive the shared rig while pinned on screen (Hulk/contact share it).
    const st = tl.scrollTrigger as unknown as { isActive?: boolean } | undefined
    if (st && st.isActive === true) {
      applyShadowPose(rig, S, stage)
      rig.render()
    }
  }

  /* ---- timeline ---------------------------------------------------------------- */
  const ease = 'power2.inOut'
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger, onUpdate: sync })
  const set = (target: object, vars: gsap.TweenVars, at: number) =>
    tl.set(target, { ...vars, immediateRender: false }, at)

  // Cards: first visible, rest parked right + hidden (deterministic cross-slides below).
  // autoAlpha (not opacity): visibility:hidden takes parked cards out of hit-testing,
  // so an invisible card stacked above can never swallow clicks meant for the shown one.
  el.cards.forEach((c, i) => gsap.set(c, { autoAlpha: i === 0 ? 1 : 0, x: i === 0 ? 0 : 60 }))

  // 0.1 — drop in from above and land butt-on-bench. Legs dangle lowest, so
  // they arrive first; a tiny rock sells the impact. (Short fall: plain ease,
  // not the shared gravity — the fall is ~340px, over before physics matters.)
  tl.to(S, { y: SIT.y, duration: 0.7, ease: 'power2.in' }, 0.1)
  tl.to(S, { lean: 14, duration: 0.12 }, 0.8)
  tl.to(S, { lean: POSES.coder.lean, duration: 0.3 }, 0.92)

  // laptop taps + project cross-slides, one beat per project.
  const tap = (at: number) => {
    tl.to(S, { rel: POSES.coder.rel + 14, duration: 0.12 }, at)
    tl.to(S, { rel: POSES.coder.rel, duration: 0.18 }, at + 0.12)
  }
  tap(1.2)
  const slide = (from: number, to: number, at: number) => {
    tl.to(el.cards[from], { autoAlpha: 0, x: -60, duration: 0.6, ease }, at)
    tl.to(el.cards[to], { autoAlpha: 1, x: 0, duration: 0.6, ease }, at)
    tap(at + 0.15)
  }
  slide(0, 1, 2.4)
  slide(1, 2, 3.8)

  // the closing link fades in above the frame once the last project is shown.
  tl.to(el.more, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 4.8)

  // 5.2 — stand up from the bench: legs straighten, pelvis re-grounds
  // (plant blends y to the floor: no pop), glasses + laptop put away.
  tl.to(
    S,
    {
      lhip: -4,
      lkn: 0,
      rhip: 5,
      rkn: 0,
      lsh: -15,
      lel: 9,
      rsh: 12,
      rel: 10,
      lean: 0,
      head: 0,
      plant: 1,
      glasses: 0,
      laptop: 0,
      duration: 0.5,
      ease,
    },
    5.2,
  )

  // 5.7 — walk off right (user's right), like the intro run-off, so nothing
  // floats over the projects list below.
  tl.to(S, { wa: 1, duration: 0.15 }, 5.7)
  tl.to(S, { x: 1420, duration: 1.0, ease: 'power1.in' }, 5.8)
  tl.to(S, { wa: 0, duration: 0.15 }, 6.7)

  // hold the empty frame before the pin releases
  set({}, {}, 7.0)

  sync()

  const setStage = (t: StageTransform) => {
    stage = t
    sync()
  }

  return { tl, setStage }
}
