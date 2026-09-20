import { DIMS, effectiveY, type Pose, type V } from '../../character/rig'
import { BASE } from '../../character/poses'

/**
 * Pure geometry for the "swing in, catch, ride down, land" beat.
 * No GSAP, no React, no DOM: numbers in, numbers out, all in STAGE units.
 * The scene's timeline tweens a few 0..1 proxies and calls `frame()` each update.
 *
 * Everything that has to touch is solved, not tuned:
 *
 *   SWING  His web hand is the bob of a pendulum whose anchor is chosen so the arc passes
 *          through the catch pose. The web is taut (constant length) for the whole swing.
 *   CATCH  His shoulder is `reachDx` right of and `reachDyCatch` above the block's top-right
 *          corner: closer than one arm length, so the reach always succeeds.
 *   RIDE   The block corner travels from the catch point to the rest point. His shoulder stays
 *          at a offset from it that eases from the catch offset to the offset he will have when
 *          he is standing on the ground. So at ride = 1 he is exactly where the rig's own
 *          grounding puts a standing figure, and the block corner is exactly on `landCorner`.
 *          (Landing height is decided by the character, not by a constant: this is why the rest
 *          position is an INPUT here and the shoulder offset is derived from it.)
 *   SETTLE Arms release to idle; legs and lean already reached idle at ride = 1.
 *
 * He faces left (dir -1). Arm roles: `l` = web arm (IK to the web hand), `r` = catching arm (IK to the corner).
 *
 * Landing hand-off: `frame()` returns `plant: 1, lift: 0` once ride reaches 1 and `plant: 0` before, so the
 * shared pose switches to rig grounding at the instant the two agree.
 */

const rad = (d: number) => (d * Math.PI) / 180
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpV = (a: V, b: V, t: number): V => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]

export interface CatchConfig {
  scale: number
  ground: number
  /** Block's top-right corner at the moment he catches it. */
  catchCorner: V
  /** Block's top-right corner when it comes to rest. */
  landCorner: V
  /** Shoulder is this far right of the corner (constant through the ride). */
  reachDx?: number
  /** Shoulder height relative to the corner at the catch (negative = shoulder above the corner). */
  reachDyCatch?: number
  webLength?: number
  /** Web angle from vertical at the catch, degrees (positive = he is right of the anchor). */
  catchAngle?: number
  /** Swing start angle, degrees. Large enough to start offstage right. */
  startAngle?: number
}

export interface CatchInput {
  /** 0 = offstage right, 1 = at the catch. */
  swing: number
  /** 0 = just caught, 1 = landed. */
  ride: number
  /** 0 = still holding on, 1 = released and idle. */
  settle: number
  /** Where the falling block's corner is right now. Only used before the catch. */
  corner: V
}

export interface CatchFrame {
  pose: Partial<Pose>
  anchor: V
  /** Where the web attaches to his hand (target of the web arm). */
  webHand: V
  webLength: number
  /** Where the catching hand is aiming. */
  corner: V
  /** Shoulder-to-corner distance vs arm length, for diagnostics. */
  reach: { distance: number; max: number }
}

const LEGS_TRAILING = { lhip: -40, lkn: -8, rhip: -22, rkn: -28 }
const IDLE = { lsh: -15, lel: 9, rsh: 12, rel: 10, lhip: -4, lkn: 0, rhip: 5, rkn: 0, head: 0, lean: 0 }

export function createCatch(cfg: CatchConfig) {
  const s = cfg.scale
  const arm = (DIMS.upper + DIMS.fore) * s
  const dx = cfg.reachDx ?? 46
  const dyC = cfg.reachDyCatch ?? -22
  const L = cfg.webLength ?? 560
  const phiC = rad(cfg.catchAngle ?? 8)
  const phi0 = rad(cfg.startAngle ?? 64)
  const leanC = -28 // torso trails behind him (negative = backward)
  const leanStart = -46
  const armWeb = arm * 0.94

  // shoulder relative to pelvis (dir -1, span 0)
  const shoulderRel = (lean: number): V => [-Math.sin(rad(lean)) * DIMS.torso * 0.9 * s, -Math.cos(rad(lean)) * DIMS.torso * 0.9 * s]

  // --- landing: where a standing figure's pelvis is, straight from the rig's own grounding
  const standing: Pose = { ...BASE, ...IDLE, scale: s, ground: cfg.ground, plant: 1, lift: 0, dir: -1, weight: 1 }
  const pelvisLandY = effectiveY(standing)
  const shoulderLandY = pelvisLandY + shoulderRel(0)[1]
  const offCatch: V = [dx, dyC]
  const offLand: V = [dx, shoulderLandY - cfg.landCorner[1]]

  // --- catch pose -> pendulum anchor
  const S_c: V = [cfg.catchCorner[0] + offCatch[0], cfg.catchCorner[1] + offCatch[1]]
  const uC: V = [-Math.sin(phiC), -Math.cos(phiC)] // hand -> anchor at the catch
  const bobC: V = [S_c[0] + uC[0] * armWeb, S_c[1] + uC[1] * armWeb]
  const anchor: V = [bobC[0] + uC[0] * L, bobC[1] + uC[1] * L]
  const bobAt = (phi: number): V => [anchor[0] + Math.sin(phi) * L, anchor[1] + Math.cos(phi) * L]

  function frame(inp: CatchInput): CatchFrame {
    const swing = Math.min(1, Math.max(0, inp.swing))
    const ride = Math.min(1, Math.max(0, inp.ride))
    const settle = Math.min(1, Math.max(0, inp.settle))

    let corner: V
    let shoulder: V
    let bob: V
    if (ride > 0 || swing >= 1) {
      corner = lerpV(cfg.catchCorner, cfg.landCorner, ride)
      const off = lerpV(offCatch, offLand, ride)
      shoulder = [corner[0] + off[0], corner[1] + off[1]]
      const ux = anchor[0] - shoulder[0]
      const uy = anchor[1] - shoulder[1]
      const ul = Math.hypot(ux, uy)
      bob = [shoulder[0] + (ux / ul) * armWeb, shoulder[1] + (uy / ul) * armWeb]
    } else {
      corner = inp.corner
      bob = bobAt(lerp(phi0, phiC, swing))
      const ux = anchor[0] - bob[0]
      const uy = anchor[1] - bob[1]
      const ul = Math.hypot(ux, uy)
      shoulder = [bob[0] - (ux / ul) * armWeb, bob[1] - (uy / ul) * armWeb]
    }

    const lean = lerp(lerp(leanStart, leanC, swing), IDLE.lean, ride)
    const rel = shoulderRel(lean)
    const pelvis: V = [shoulder[0] - rel[0], shoulder[1] - rel[1]]
    const legK = ride * ride // legs straighten late, so his feet never dip below the floor early
    const reachW = 1 - settle

    const pose: Partial<Pose> = {
      x: pelvis[0],
      y: pelvis[1],
      plant: ride >= 1 ? 1 : 0,
      lift: 0,
      ground: cfg.ground,
      dir: -1,
      scale: s,
      weight: 1,
      span: 0,
      lean,
      head: lerp(-6, 0, Math.max(ride, settle)),
      lhip: lerp(LEGS_TRAILING.lhip, IDLE.lhip, legK),
      lkn: lerp(LEGS_TRAILING.lkn, IDLE.lkn, legK),
      rhip: lerp(LEGS_TRAILING.rhip, IDLE.rhip, legK),
      rkn: lerp(LEGS_TRAILING.rkn, IDLE.rkn, legK),
      // FK values the arms return to as the IK weights fall to 0
      lsh: IDLE.lsh,
      lel: IDLE.lel,
      rsh: IDLE.rsh,
      rel: IDLE.rel,
      lx: bob[0],
      ly: bob[1],
      lw: reachW,
      rx: corner[0],
      ry: corner[1],
      rw: reachW,
      wp: 0,
      wa: 0,
    }
    return {
      pose,
      anchor,
      webHand: bob,
      webLength: Math.hypot(anchor[0] - bob[0], anchor[1] - bob[1]),
      corner,
      reach: { distance: Math.hypot(corner[0] - shoulder[0], corner[1] - shoulder[1]), max: arm },
    }
  }

  return {
    frame,
    anchor,
    /** Shoulder offset from the corner at landing (derived). Useful to log. */
    landOffset: offLand,
    /** Pelvis y when standing on the ground (derived from the rig). */
    pelvisLandY,
  }
}
