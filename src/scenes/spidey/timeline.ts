import { gsap } from '../../motion/gsap'
import { POSES } from '../../character/poses'
import { DIMS, toWorld, type Pose, type StickRig, type V } from '../../character/rig'
import { measureStage, toWindow, fromWindow, type StageTransform } from '../../motion/stageToWindow'
import { applyShadowPose } from '../../motion/applyShadowPose'
import {
  G,
  ballistic,
  catchDuration,
  contractTable,
  solveTime,
  speedAtCut,
  stretchFor,
  tauAtCut,
  tumbleAfter,
  type FallerId,
} from '../../motion/freeFall'
import { createCatch } from './catchGeometry'
import {
  ABOUT_START,
  BLOCK_LAND,
  BLOCK_START,
  CATCH_CORNER,
  CATCH_Y,
  CHAR_SCALE,
  ENTRY_TOP,
  FACTS_START,
  GROUND,
  LAND_CORNER,
  REACH_DX,
  REACH_DY_CATCH,
  SPIDEY_END,
  SPIDEY_SCREENS,
  WEB_CATCH_ANGLE,
  WEB_LENGTH,
  WEB_START_ANGLE,
} from './frames'

/**
 * Spider-Man catch — one scroll-scrubbed GSAP timeline, driven by ONE gravity (motion/freeFall.ts).
 *
 * The scene opens mid-fall. The intro's outro drops its layout out of the bottom of the screen
 * at speed v_i; here the same objects enter from above at the same speed v_i and keep accelerating
 * at the same G. He swings in and catches the intro text by its top-right corner; the rest fall
 * on out of the bottom. No fades: things leave because they fell out of view.
 *
 *  s = 0            the cut. Everything above the visible area, already falling.
 *  s = sCatch       CATCH. The text arrives at speed vCatch; his hand meets its corner.
 *  s = sCatch + R   he has decelerated it (uniformly, from vCatch to 0) over the ride and lands.
 *  then             lets go, web fades, arms return to idle, he straightens up and holds.
 *
 * `s` is scroll in viewport heights, s = tl.time() * SCREENS_PER_UNIT. Every position, speed, tumble and
 * stretch below is a pure function of `s` (or of a tweened proxy), so scrubbing is exact both ways.
 *
 * Dev: ?catchlog for a throttled trace; __spideyDiag() for the per-object table + timings;
 * __fallContract() for the seam contract the intro must meet.
 */

const SCREENS_PER_UNIT = SPIDEY_SCREENS / SPIDEY_END
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export interface SpideyTimelineApi {
  tl: gsap.core.Timeline
  setStage: (t: StageTransform) => void
}

/** Window point -> the local coordinates of the SVG that contains `el`, whatever transforms sit above it. */
function toSvgLocal(el: SVGGraphicsElement, stage: StageTransform, p: V): V {
  const svg = el.ownerSVGElement
  if (svg) {
    const layoutW = parseFloat(getComputedStyle(svg).width) // CSS px, unaffected by transforms
    if (layoutW > 0) {
      const r = svg.getBoundingClientRect()
      const k = r.width / layoutW
      return [(p[0] - r.left) / k, (p[1] - r.top) / k]
    }
  }
  return fromWindow(stage, p[0], p[1]) // assume the web SVG lives in stage space
}

export function buildSpideyTimeline(opts: {
  root: HTMLElement
  block: HTMLElement
  web: SVGPathElement
  rig: StickRig
  scrollTrigger?: ScrollTrigger.Vars
}): SpideyTimelineApi {
  const { root, block, web, rig, scrollTrigger } = opts
  const q = (name: string) => root.querySelector<HTMLElement>(`[data-block="${name}"]`)
  const el = {
    about: q('about')!,
    facts: [0, 1, 2].map((i) => q(`fact-${i}`)!),
  }

  let stage: StageTransform = measureStage(root)

  /* ---- the physics of the catch, solved once ------------------------------------------- */
  const vText0 = speedAtCut('text') // it enters with the speed the intro exited with
  const sCatch = solveTime(ENTRY_TOP.text, vText0, CATCH_Y) // screens after the cut when it reaches the catch point
  const vCatch = vText0 + G * sCatch // arrival speed
  const rideDistance = BLOCK_LAND.y - CATCH_Y
  const sRide = catchDuration(vCatch, rideDistance) // uniform deceleration to rest over the ride
  const tCatch = sCatch / SCREENS_PER_UNIT
  const tRide = sRide / SCREENS_PER_UNIT
  const tLand = tCatch + tRide

  const cat = createCatch({
    scale: CHAR_SCALE,
    ground: GROUND,
    catchCorner: CATCH_CORNER,
    landCorner: LAND_CORNER,
    reachDx: REACH_DX,
    reachDyCatch: REACH_DY_CATCH,
    webLength: WEB_LENGTH,
    catchAngle: WEB_CATCH_ANGLE,
    startAngle: WEB_START_ANGLE,
  })

  /* ---- the web: a taut solid line, styled here so the scene is self-contained ---- */
  web.style.stroke = 'var(--color-ink)'
  web.style.strokeWidth = '2'
  web.style.strokeDasharray = 'none'
  web.style.strokeLinecap = 'round'
  gsap.set(block, { transformOrigin: '100% 0%' }) // tips about the corner he will catch
  gsap.set(el.about, { transformOrigin: '50% 0%' })
  el.facts.forEach((f) => gsap.set(f, { transformOrigin: '50% 0%' }))

  /* ---- shadow pose (stage units); catchGeometry fills it every update ---- */
  const S: Pose = { ...POSES.idle, x: 0, y: 0, scale: CHAR_SCALE, ground: GROUND, plant: 0, lift: 0, dir: -1 }

  /** Everything the timeline tweens. Plain numbers, so scrubbing is deterministic. */
  const P = { swing: 0, ride: 0, settle: 0, held: 0, landed: 0 }

  const replicas: { id: FallerId; el: HTMLElement; startY: number; rest: { x: number; y: number } }[] = [
    { id: 'heading', el: el.about, startY: ENTRY_TOP.heading, rest: ABOUT_START },
    { id: 'fact0', el: el.facts[0], startY: ENTRY_TOP.fact0, rest: FACTS_START[0] },
    { id: 'fact1', el: el.facts[1], startY: ENTRY_TOP.fact1, rest: FACTS_START[1] },
    { id: 'fact2', el: el.facts[2], startY: ENTRY_TOP.fact2, rest: FACTS_START[2] },
  ]

  const feetStageY = () => {
    const lf = fromWindow(stage, ...toWorld(rig.eff, rig.joints.lFoot))
    const rf = fromWindow(stage, ...toWorld(rig.eff, rig.joints.rFoot))
    return Math.max(lf[1], rf[1]) + ((DIMS.limb * rig.eff.weight) / 2 + DIMS.outline) * (rig.eff.scale / stage.scale)
  }

  const LOG = new URLSearchParams(window.location.search).has('catchlog')
  let lastLog = 0
  let warnedScreens = false
  let latest: Record<string, unknown>[] = []

  const sync = () => {
    // Re-measure every frame: getBoundingClientRect is viewport-relative, and pinning moves the
    // section to the viewport top. A cached transform would draw the fixed-overlay character wrong.
    stage = measureStage(root)

    // s: scroll in viewport heights since the cut. The single clock every object below reads.
    const s = Math.max(0, tl.time()) * SCREENS_PER_UNIT
    const started = tl.progress() > 0
    // Hidden until the pin actually starts: this section overlaps the intro's tail on purpose (see the
    // App wrapper), so it must not paint over the intro's outro. Deterministic in progress.
    root.style.visibility = started ? 'visible' : 'hidden'

    if (!warnedScreens && scrollTrigger) {
      const st = tl.scrollTrigger as unknown as { start: number; end: number } | undefined
      if (st && st.end - st.start > 1) {
        const actual = (st.end - st.start) / window.innerHeight
        if (Math.abs(actual - SPIDEY_SCREENS) > 0.03 * SPIDEY_SCREENS) {
          warnedScreens = true
          console.warn(`[spidey] pin is ${actual.toFixed(2)} screens but SPIDEY_SCREENS is ${SPIDEY_SCREENS}. Gravity is defined in scroll space: pass screens: SPIDEY_SCREENS to pinnedScene().`)
        }
      }
    }

    /* ---- the caught text block -------------------------------------------------------- */
    const sFall = Math.min(s, sCatch) // ballistic until the catch, then it is his
    const fallTop = ballistic(ENTRY_TOP.text, vText0, sFall)
    const vFall = vText0 + G * sFall
    // after the catch its speed is the uniform deceleration: v = vCatch * sqrt(1 - ride) for an ease-out ride
    const vText = s < sCatch ? vFall : vCatch * Math.sqrt(Math.max(0, 1 - P.ride))

    const f = cat.frame({ swing: P.swing, ride: P.ride, settle: P.settle, corner: [CATCH_CORNER[0], fallTop] })
    Object.assign(S, f.pose)
    // Only drive the shared rig while this scene is pinned on screen (the intro shares the rig).
    const st2 = tl.scrollTrigger as unknown as { isActive?: boolean } | undefined
    if (st2 && st2.isActive === true) {
      applyShadowPose(rig, S, stage) // converts x / y / IK targets / ground / lift / scale
      rig.render()
    }

    const handW = toWorld(rig.eff, rig.joints.rHand)
    const hand = fromWindow(stage, handW[0], handW[1])
    const baseLeft = P.landed ? BLOCK_LAND.x : CATCH_CORNER[0] - BLOCK_START.w
    const baseTop = P.landed ? BLOCK_LAND.y : fallTop
    const left = lerp(baseLeft, hand[0] - BLOCK_START.w, P.held)
    const top = lerp(baseTop, hand[1], P.held)
    // tumble carries on from the intro, settling to level as he brakes it
    const tilt = tumbleAfter('text', tauAtCut('text') + sFall) * (1 - P.ride)
    gsap.set(block, { x: left - BLOCK_START.x, y: top - BLOCK_START.y, rotation: tilt, scaleY: stretchFor(vText) })

    /* ---- the rest: same gravity, faster or slower only by the speed they arrived with ---- */
    const rows: Record<string, unknown>[] = []
    for (const r of replicas) {
      const v0 = speedAtCut(r.id)
      const top2 = ballistic(r.startY, v0, s)
      const v = v0 + G * s
      gsap.set(r.el, {
        y: top2 - r.rest.y,
        rotation: tumbleAfter(r.id, tauAtCut(r.id) + s),
        scaleY: stretchFor(v),
      })
      rows.push({ id: r.id, top: +top2.toFixed(1), speed: +v.toFixed(0) })
    }
    rows.unshift({ id: 'text', top: +top.toFixed(1), speed: +vText.toFixed(0) })

    // the web: anchor -> the web hand's actual position, in the SVG's own coordinates
    const a = toSvgLocal(web, stage, toWindow(stage, f.anchor[0], f.anchor[1]))
    const h = toSvgLocal(web, stage, toWorld(rig.eff, rig.joints.lHand))
    web.setAttribute('d', `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${h[0].toFixed(1)} ${h[1].toFixed(1)}`)

    latest = rows
    if (LOG) {
      const now = performance.now()
      if (now - lastLog > 250) {
        lastLog = now
        console.log('[spidey]', {
          t: +tl.time().toFixed(2),
          s: +s.toFixed(3),
          swing: +P.swing.toFixed(3),
          ride: +P.ride.toFixed(3),
          held: P.held,
          textSpeed: +vText.toFixed(0),
          reach: `${f.reach.distance.toFixed(1)}/${f.reach.max.toFixed(1)}`,
          handToBlockCorner: +Math.hypot(hand[0] - (left + BLOCK_START.w), hand[1] - top).toFixed(2),
          web: +f.webLength.toFixed(1),
          feetMinusGround: +(feetStageY() - GROUND).toFixed(1),
        })
      }
    }
  }

  /* ---- timeline ---------------------------------------------------------------------- */
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger, onUpdate: sync })
  const set = (target: object, vars: gsap.TweenVars, at: number) => tl.set(target, { ...vars, immediateRender: false }, at)

  // he swings in on a taut web from the cut; the swing ends exactly when the block arrives
  tl.to(web, { opacity: 1, duration: 0.3 }, 0)
  tl.to(P, { swing: 1, duration: tCatch, ease: 'sine.in' }, 0)

  // catch: from here the block follows his hand exactly
  set(P, { held: 1 }, tCatch)

  // he brakes it: GSAP's 'power1.out' is the QUADRATIC ease-out, i.e. uniform deceleration (careful: power2 is
  // cubic, power3 quartic). Its duration was solved so its opening speed equals the arrival speed (vCatch),
  // so there is no velocity jump at the catch.
  tl.to(P, { ride: 1, duration: tRide, ease: 'power1.out' }, tCatch)

  // landed: block is at BLOCK_LAND (his hand is exactly there). Let go, web fades, he straightens up.
  set(P, { landed: 1 }, tLand)
  tl.to(web, { opacity: 0, duration: 0.5 }, tLand)
  tl.to(P, { held: 0, duration: 0.2 }, tLand + 0.12)
  tl.to(P, { settle: 1, duration: 0.9, ease: 'power2.inOut' }, tLand + 0.12)

  // hold the finished frame for a beat before the pin releases
  set({}, {}, SPIDEY_END)

  sync()

  const w = window as unknown as Record<string, unknown>
  w.__fallContract = () => console.table(contractTable())
  w.__spideyDiag = () => {
    console.table(latest)
    console.table([
      {
        SCREENS: SPIDEY_SCREENS,
        G,
        vEntryText: +vText0.toFixed(0),
        sCatch: +sCatch.toFixed(3),
        vCatch: +vCatch.toFixed(0),
        rideDistance,
        rideScreens: +sRide.toFixed(3),
        tCatch: +tCatch.toFixed(2),
        tLand: +tLand.toFixed(2),
        end: SPIDEY_END,
      },
    ])
  }

  const setStage = (t: StageTransform) => {
    stage = t
    sync()
  }

  return { tl, setStage }
}
