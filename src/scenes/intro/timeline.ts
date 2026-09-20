import { gsap } from '../../motion/gsap'
import { POSES, type PoseName } from '../../character/poses'
import { toWorld, type Pose, type StickRig } from '../../character/rig'
import { measureStage, fromWindow, type StageTransform } from '../../motion/stageToWindow'
import { applyShadowPose } from '../../motion/applyShadowPose'
import { introFall, type FallerId } from '../../motion/freeFall'
import { A, B, CHAR_SCALE, DROP_X, EXIT_X, GRAB_X, GRIP_Y, GROUND, INTRO_END, INTRO_SCREENS, START_X } from './frames'

/**
 * Intro scene choreography — one scroll-scrubbed GSAP timeline.
 *
 *  0.0  rest: he points at the photo, "This is me!"
 *  0.5  bubble goes, arm lowers, wide layout starts to break apart
 *  1.4  hop-turns and walks to the text
 *  3.3  reaches out and grabs the text block by its edge
 *  4.1  hop-turns again and pulls it across the stage; the focus items follow it out of the way
 *  8.5  lets go; block lands in its slot; the focus items stack; the section heading arrives
 *  9.5  he runs off to the right (user's right) as the layout lets go behind him
 *  then everything free-falls with the shared gravity (motion/freeFall.ts) and leaves
 *  below every viewport at exactly the cut speed the Spidey scene enters with.
 *  No fades: things leave because they fell out of view.
 *
 * Stage → window conversion goes through applyShadowPose() so that IK targets,
 * ground and lift are converted along with x / y / scale.
 */

const LIMB_KEYS = ['lean', 'head', 'lsh', 'lel', 'rsh', 'rel', 'lhip', 'lkn', 'rhip', 'rkn'] as const
const limbs = (name: PoseName): Partial<Pose> =>
  Object.fromEntries(LIMB_KEYS.map((k) => [k, POSES[name][k]]))

const STRIDE = 52 // stage px of travel per walk-cycle unit, per unit of character scale

export interface IntroTimelineApi {
  tl: gsap.core.Timeline
  setStage: (t: StageTransform) => void
}

export function buildIntroTimeline(opts: {
  root: HTMLElement
  rig: StickRig
  scrollTrigger?: ScrollTrigger.Vars
}): IntroTimelineApi {
  const { root, rig, scrollTrigger } = opts
  const q = (name: string) => root.querySelector<HTMLElement>(`[data-block="${name}"]`)!
  const el = {
    intro: q('intro'),
    identity: q('identity'),
    photo: q('photo'),
    bubble: q('bubble'),
    cue: q('cue'),
    about: q('about'),
    facts: [0, 1, 2].map((i) => q(`fact-${i}`)),
  }

  // The stage transform, updated by the scene after mount and on resize.
  let stage: StageTransform = measureStage(root)

  /* ---- shadow pose: stage coordinates ---------------------------------- */
  const S: Pose = {
    ...POSES.point,
    x: START_X,
    y: 0,
    scale: CHAR_SCALE,
    dir: 1,
    ground: GROUND,
    plant: 1,
    lift: 0,
    wa: 0,
    rw: 0,
  }

  gsap.set(el.about, { opacity: 0, y: 16 })
  gsap.set(el.photo, { transformOrigin: '0 0' })
  gsap.set(el.intro, { transformOrigin: '50% 0%' })
  gsap.set(el.about, { transformOrigin: '50% 0%' })
  el.facts.forEach((f) => gsap.set(f, { transformOrigin: '50% 0%' }))

  // The carried block: `base` is its layout offset from frame A; while `follow` is 1
  // it is instead glued to the character's actual hand.
  const base = { x: 0, y: 0 }
  const carry = { follow: 0 }

  const sync = () => {
    // Re-measure every frame (see spidey/timeline.ts): pinning changes the
    // section's viewport rect, so a cached transform goes stale on scroll.
    stage = measureStage(root)
    // Walk cycle is driven by distance travelled, so feet never skate when scrubbing either way.
    S.wp = (S.dir * S.x) / (STRIDE * S.scale)

    // Only drive the shared rig while this scene owns it. The spidey scene
    // shares the same rig; without this gate the scene that built last would
    // steal the character at page load (its immediate sync() runs after ours).
    const st = tl.scrollTrigger as unknown as { isActive?: boolean } | undefined
    const ownsRig = !st || st.isActive !== false
    if (ownsRig) {
      // Stage units -> window pixels for EVERY world-space field (targets, ground, lift, ...).
      applyShadowPose(rig, S, stage)
      rig.render()
    }

    // Read the hand's window position, convert back to stage units, offset the block.
    const hand = toWorld(rig.eff, rig.joints.rHand)
    const [hx, hy] = fromWindow(stage, hand[0], hand[1])
    const gx = hx - (A.intro.x + A.intro.w)
    const gy = hy - GRIP_Y - A.intro.y
    // Free-fall outro (motion/freeFall.ts): same gravity G the Spidey scene continues.
    // sI is scroll in screens since pin start; each object rests until its release, then
    // falls with shared G and exits below every viewport at exactly the cut speed Spidey
    // enters with. Neutral (drop 0, no rotation, stretch 1) before release, so the
    // scripted choreography above owns the elements until then. Nothing fades.
    const sI = Math.max(0, tl.time()) * INTRO_SCREENS / INTRO_END
    const fT = introFall('text', sI, INTRO_SCREENS)
    gsap.set(el.intro, {
      x: base.x + carry.follow * (gx - base.x),
      y: base.y + carry.follow * (gy - base.y) + fT.drop,
      rotation: fT.rot,
      scaleY: fT.stretch,
    })

    // The rest: scripted tweens own them until their release (all releases land after
    // the scripted arrivals finish), then physics takes over absolutely.
    const fH = introFall('heading', sI, INTRO_SCREENS)
    if (fH.tau > 0) gsap.set(el.about, { y: fH.drop, rotation: fH.rot, scaleY: fH.stretch, opacity: 1 })
    const factIds: FallerId[] = ['fact0', 'fact1', 'fact2']
    el.facts.forEach((f, i) => {
      const fF = introFall(factIds[i], sI, INTRO_SCREENS)
      if (fF.tau > 0) {
        gsap.set(f, {
          y: B.facts[i].y - A.facts[i].y + fF.drop,
          rotation: fF.rot,
          scaleY: fF.stretch,
          opacity: 1,
        })
      }
    })
    const fP = introFall('photo', sI, INTRO_SCREENS)
    if (fP.tau > 0) {
      gsap.set(el.photo, {
        y: B.photo.y - A.photo.y + fP.drop,
        rotation: fP.rot,
        opacity: 1,
      })
    }
  }

  /* ---- timeline --------------------------------------------------------- */
  const ease = 'power2.inOut'
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger, onUpdate: sync })
  const set = (target: object, vars: gsap.TweenVars, at: number) =>
    tl.set(target, { ...vars, immediateRender: false }, at)

  // 0 — hint and greeting leave
  tl.to(el.cue, { opacity: 0, duration: 0.5 }, 0)
  tl.to(el.bubble, { opacity: 0, y: -6, duration: 0.5 }, 0.5)

  // 1 — arm lowers; the wide layout starts to break apart (photo first, then the rest)
  tl.to(S, { ...limbs('idle'), duration: 0.8, ease }, 0.5)
  tl.to(el.identity, { opacity: 0, y: -24, duration: 1.1, ease: 'power1.out' }, 0.5)
  tl.to(
    el.photo,
    { x: B.photo.x - A.photo.x, y: B.photo.y - A.photo.y, scale: B.photo.scale, duration: 2.3, ease },
    1.2,
  )

  // 2 — turn (a small hop) and walk to the text
  tl.to(S, { lift: 14, duration: 0.25, ease: 'power2.out' }, 1.4)
  set(S, { dir: -1 }, 1.65)
  tl.to(S, { lift: 0, duration: 0.25, ease: 'power2.in' }, 1.65)
  tl.to(S, { wa: 1, duration: 0.15 }, 1.95)
  tl.to(S, { x: GRAB_X, duration: 1.3 }, 2.0)
  tl.to(S, { wa: 0, duration: 0.15 }, 3.2)

  // 3 — reach and grab the block by its right edge
  set(S, { rx: A.intro.x + A.intro.w, ry: A.intro.y + GRIP_Y }, 3.3)
  tl.to(S, { rw: 1, lean: 8, duration: 0.7, ease }, 3.3)
  set(carry, { follow: 1 }, 4.0)

  // 4 — turn again, still holding on, then pull it across while the layout settles
  tl.to(S, { lift: 14, duration: 0.25, ease: 'power2.out' }, 4.1)
  set(S, { dir: 1 }, 4.35)
  tl.to(S, { lift: 0, duration: 0.25, ease: 'power2.in' }, 4.35)
  tl.to(S, { lean: POSES.pull.lean, head: POSES.pull.head, lsh: POSES.pull.lsh, lel: POSES.pull.lel, duration: 0.5, ease }, 4.1)
  tl.to(S, { wa: 1, duration: 0.15 }, 4.65)
  tl.to(S, { x: DROP_X, duration: 3.8, ease: 'power1.inOut' }, 4.7)
  tl.to(S, { rx: DROP_X - (GRAB_X - (A.intro.x + A.intro.w)), duration: 3.8, ease: 'power1.inOut' }, 4.7)
  tl.to(S, { wa: 0, duration: 0.15 }, 8.35)

  // the three focus items break apart and stack — but only once the carried block has
  // cleared their column, so nothing ever passes through anything else
  el.facts.forEach((f, i) => {
    tl.to(f, { x: B.facts[i].x - A.facts[i].x, y: B.facts[i].y - A.facts[i].y, duration: 1.6, ease }, 7.3 + i * 0.2)
  })

  // 5 — let go: block settles into its slot, heading arrives, he relaxes
  set(base, { x: B.intro.x - A.intro.x, y: B.intro.y - A.intro.y }, 8.5)
  tl.to(carry, { follow: 0, duration: 0.4 }, 8.55)
  tl.to(S, { rw: 0, ...limbs('idle'), duration: 0.9, ease }, 8.6)
  tl.to(el.about, { opacity: 1, y: 0, duration: 0.9, ease: 'power1.out' }, 8.6)

  // 6 — run off to the right: walk cycle on (footsteps derived from distance),
  // leaning forward, exiting past the stage edge. Behind him the layout lets go
  // object by object (see sync(): shared gravity, no tweens) and falls out below.
  tl.to(S, { wa: 1, duration: 0.15 }, 9.4)
  tl.to(S, { x: EXIT_X, lean: 12, duration: 1.3, ease: 'power1.in' }, 9.5)
  tl.to(S, { wa: 0, duration: 0.15 }, 10.65)

  // hold to the cut: by INTRO_END every object is below every viewport, each
  // leaving at exactly the speed the Spidey scene enters it with (see freeFall).
  set({}, {}, INTRO_END)

  sync()

  const setStage = (t: StageTransform) => {
    stage = t
    sync()
  }

  return { tl, setStage }
}
