import { gsap } from '../../motion/gsap'
import { POSES, type PoseName } from '../../character/poses'
import { toWorld, type Pose, type StickRig } from '../../character/rig'
import { measureStage, fromWindow, type StageTransform } from '../../motion/stageToWindow'
import { applyShadowPose } from '../../motion/applyShadowPose'
import {
  CHAR_SCALE,
  DRAG_END_X,
  FRAME_FROM_Y,
  FRAME_REST,
  GRAB_X,
  GROUND,
  HOP_LIFT,
  HULK_BRACE,
  HULK_LAND,
  HULK_SCALE,
  HULK_SPAN,
  HULK_WEIGHT,
  HULK_X,
  JUMP_LIFT,
  LAND_X,
  PROJECTS_TITLE,
  TITLE_GRIP_DX,
  TITLE_GRIP_DY,
} from './frames'

/**
 * Hulk scene — one scroll-scrubbed GSAP timeline.
 *
 *  0.0  FLEX starts immediately: grows to hulk size (feet auto-grounded)
 *  0.8  CROUCH: winds up, holds — anticipation
 *  1.4  LAUNCH: springs to hulkAir, lift arcs him through the empty upper half
 *  2.2  FALL: apex; lift comes back down; Projects header arrives on top
 *  2.4  BRACE: arms fling out, legs stretch for the floor
 *  3.0  TOUCHDOWN: absorbs into LAND (front foot flat, rear knee down, fist planted), holds
 *  3.4  SETTLE: rises to standing hulk
 *  4.0  WALK: to under the title's middle (feet cycle on distance)
 *  4.5  HOP-GRAB: springs up, hand meets the title's bottom-middle, glued
 *  4.9  LAND with it, then DRAG-WALK left (hand-glue like the intro pull)
 *         until both exit off-screen left; populated frame rises meanwhile
 *  6.5  recover neutral (offscreen) for the handoff
 *
 * The jump uses the rig's `lift` (grounded math throughout: planted = ground - lift - bottom*scale),
 * so there is no pop at takeoff or landing. Up and down are both GSAP 'power1' (QUADRATIC = constant
 * acceleration) with equal durations, i.e. a true parabola. ('power2' is cubic: it arrives late and
 * hard, and reads as a stop rather than a landing.)
 *
 * Handoffs are cuts between identical pictures (see motion/pinOverlap.ts): this scene starts in
 * Spidey's exact final frame (idle, x 942, block at BLOCK_LAND) and ends on the frame the workbench opens
 * on. Until its own pin starts the whole section is hidden, so it never paints over the scene before it.
 */

const LIMB_KEYS = ['lean', 'head', 'lsh', 'lel', 'rsh', 'rel', 'lhip', 'lkn', 'rhip', 'rkn'] as const
const limbs = (name: PoseName): Partial<Pose> =>
  Object.fromEntries(LIMB_KEYS.map((k) => [k, POSES[name][k]]))

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const STRIDE = 52 // stage px of travel per walk-cycle unit, per unit of character scale

export interface HulkTimelineApi {
  tl: gsap.core.Timeline
  setStage: (t: StageTransform) => void
}

export function buildHulkTimeline(opts: {
  root: HTMLElement
  block: HTMLElement
  title: HTMLElement
  frame: HTMLElement
  rig: StickRig
  scrollTrigger?: ScrollTrigger.Vars
}): HulkTimelineApi {
  const { root, block, title, frame, rig, scrollTrigger } = opts

  let stage: StageTransform = measureStage(root)
  gsap.set(title, { transformOrigin: '50% 50%' })

  /* ---- shadow pose: starts as Spidey's end pose (idle beside the block) ---- */
  const S: Pose = {
    ...POSES.idle,
    x: HULK_X,
    y: 0,
    scale: CHAR_SCALE,
    dir: -1,
    ground: GROUND,
    plant: 1,
    lift: 0,
    wa: 0,
    rw: 0,
    lw: 0,
  }

  /** Scene-local proxies. Plain numbers, so scrubbing is deterministic. */
  const P = { blockOut: 0, titleIn: 0, follow: 0, frameUp: 0 }

  const sync = () => {
    // Re-measure every frame: pinning moves the section, cached transforms go stale.
    stage = measureStage(root)
    // Walk cycle is distance-driven (feet never skate); wa gates it to the walks.
    S.wp = (S.dir * S.x) / (STRIDE * S.scale)
    // Only drive the shared rig while pinned on screen (Spidey/workbench share it).
    const st = tl.scrollTrigger as unknown as { isActive?: boolean } | undefined
    if (st && st.isActive === true) {
      applyShadowPose(rig, S, stage)
      rig.render()
    }

    // The whole section stays hidden until this pin starts. Its box overlaps the tail of Spidey's
    // (pinOverlap.ts), so it must not paint over Spidey's landing; and at the instant it starts it is
    // pixel-identical to Spidey's last frame, so the cut is invisible. Deterministic in progress.
    const started = tl.progress() > 0 ? 1 : 0
    root.style.visibility = started ? 'visible' : 'hidden'

    // the block: rests at BLOCK_REST (= Spidey's BLOCK_LAND), then sinks past the floor and fades only once mostly out.
    gsap.set(block, {
      y: P.blockOut * 420,
      rotation: -3 * P.blockOut,
      opacity: 1 - clamp01((P.blockOut - 0.65) / 0.35),
    })
    // the header: arrives on top as he falls; once grabbed it follows his
    // hand rigidly (same hand-glue as the intro pull: exact, no snap).
    const handW = toWorld(rig.eff, rig.joints.rHand)
    const hand = fromWindow(stage, handW[0], handW[1])
    const baseTop = PROJECTS_TITLE.y + (1 - P.titleIn) * 60
    gsap.set(title, {
      x: lerp(0, hand[0] - TITLE_GRIP_DX - PROJECTS_TITLE.x, P.follow),
      y: lerp(baseTop - PROJECTS_TITLE.y, hand[1] - TITLE_GRIP_DY - PROJECTS_TITLE.y, P.follow),
      opacity: started * P.titleIn,
    })
    // the populated frame: rises from below during the drag, settling on the shared project-frame
    // geometry so the handoff to the workbench reads as one continuous window.
    gsap.set(frame, {
      y: lerp(FRAME_FROM_Y, FRAME_REST.y, P.frameUp) - FRAME_REST.y,
      opacity: started,
    })
  }

  /* ---- timeline ---------------------------------------------------------------- */
  const ease = 'power2.inOut'
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger, onUpdate: sync })
  const set = (target: object, vars: gsap.TweenVars, at: number) =>
    tl.set(target, { ...vars, immediateRender: false }, at)

  // 0.0 — flex starts immediately: grow into hulk (limbs + build together).
  // No idle hold: the moment this pin starts, he is already transforming.
  tl.to(S, { ...limbs('hulk'), scale: HULK_SCALE, weight: HULK_WEIGHT, span: HULK_SPAN, duration: 0.8, ease }, 0)

  // 0.8 — wind up
  tl.to(S, { ...limbs('hulkCrouch'), duration: 0.3, ease }, 0.8)
  // (holds the crouch 1.1–1.4: anticipation)

  // 1.4 — launch: airborne silhouette, lift arcs up, drifts toward the mark.
  // The block drops out at the same time.
  tl.to(S, { ...limbs('hulkAir'), duration: 0.4, ease }, 1.4)
  tl.to(S, { lift: JUMP_LIFT, duration: 0.8, ease: 'power1.out' }, 1.4) // decelerating climb
  tl.to(S, { x: LAND_X, duration: 1.6, ease: 'power1.inOut' }, 1.4)
  tl.to(P, { blockOut: 1, duration: 0.8, ease: 'power2.in' }, 1.4)

  // 2.2 — fall: apex, then lift comes back with equal duration (a true parabola); header arrives on top.
  tl.to(S, { lift: 0, duration: 0.8, ease: 'power1.in' }, 2.2)
  tl.to(P, { titleIn: 1, duration: 1.2, ease: 'power1.out' }, 2.2)

  // 2.4 — brace: arms fling out and legs stretch for the floor while the last of the fall is left.
  // (Feet stay grounded-math: as the legs lengthen the pelvis rides up, so there is no pop.)
  tl.to(S, { ...HULK_BRACE, duration: 0.55, ease: 'power1.inOut' }, 2.4)

  // 3.0 — touchdown: lift reaches 0 exactly here. He absorbs the impact into the landing crouch over a
  // short compress (not a pop), then holds it.
  tl.to(S, { ...HULK_LAND, duration: 0.16, ease: 'power2.out' }, 3.0)

  // 3.4 — settle: rises to standing hulk.
  tl.to(S, { ...limbs('hulk'), duration: 0.6, ease }, 3.4)

  // 4.0 — walk to under the title's middle (feet cycle on distance).
  tl.to(S, { wa: 1, duration: 0.15 }, 4.0)
  tl.to(S, { x: GRAB_X, duration: 0.5, ease: 'power1.inOut' }, 4.0)
  tl.to(S, { wa: 0, duration: 0.15 }, 4.45)

  // 4.5 — hop-grab: springs up, hand meets the title's bottom-middle.
  // follow=1 at the apex glues the title to his actual hand from here.
  // The IK target + rw land the hand exactly (verified gap 0.00), no snap.
  tl.to(S, { ...limbs('hulkAir'), duration: 0.25, ease }, 4.5)
  tl.to(S, { lift: HOP_LIFT, duration: 0.4, ease: 'power2.out' }, 4.5)
  set(S, { rx: PROJECTS_TITLE.x + TITLE_GRIP_DX, ry: PROJECTS_TITLE.y + TITLE_GRIP_DY }, 4.5)
  tl.to(S, { rw: 1, duration: 0.4, ease }, 4.5)
  set(P, { follow: 1 }, 4.9)

  // 4.9 — land with it, then drag-walk left: the title follows his hand exactly
  // (same hand-glue as the intro pull) until both exit off-screen left.
  tl.to(S, { lift: 0, duration: 0.4, ease: 'power2.in' }, 4.9)
  tl.to(S, { ...limbs('hulk'), duration: 0.4, ease }, 4.9)
  tl.to(S, { wa: 1, duration: 0.15 }, 5.25)
  tl.to(S, { x: DRAG_END_X, duration: 1.6, ease: 'power1.inOut' }, 5.3)
  tl.to(S, { wa: 0, duration: 0.15 }, 6.75)

  // 4.9–6.3 — the populated frame rises from below while he drags.
  tl.to(P, { frameUp: 1, duration: 1.4, ease: 'power1.out' }, 4.9)

  // 6.5 — recover neutral (offscreen) for the handoff.
  tl.to(S, { ...limbs('hulk'), rw: 0, duration: 0.3, ease }, 6.5)

  // hold the finished frame (frame up, title gone) before release
  set({}, {}, 7.4)

  sync()

  const setStage = (t: StageTransform) => {
    stage = t
    sync()
  }

  return { tl, setStage }
}
