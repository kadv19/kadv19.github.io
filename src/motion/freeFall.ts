/**
 * One gravity for the whole site, expressed in SCROLL space.
 *
 * Why this exists: an ease is not a fall. In GSAP, `power1` is the QUADRATIC ease (constant acceleration,
 * i.e. gravity) and `power2` is CUBIC: its acceleration keeps growing, which is not what gravity does.
 * The old scenes used `power2.in`. On top of that every tween picks its own duration and distance, so
 * every object had its own "g", and nothing tied the intro's fall to the spidey scene on the other side
 * of the cut.
 *
 * Here every falling thing obeys the same law,
 *
 *      y(s) = y0 + v0·s + ½·G·s²        s = scroll distance in viewport heights ("screens")
 *
 * in BOTH scenes. Position, speed, tumble and stretch are pure functions of `s`, so scrubbing
 * either way is exact, and the two scenes join by construction: the intro releases each object so
 * that it leaves the bottom of the screen at speed v; the spidey scene starts the same object above
 * the top of the screen with the same speed v. No tuning, no fades.
 *
 * Units: stage px (1280×720 canvas) and screens. Pure module: no DOM, no GSAP.
 */

/** Gravity, stage px per screen². Bigger = snappier fall, shorter outro. See the table in the docs. */
export const G = 1500

/**
 * Stage y (top edge of an object) at which it is safely below the bottom of every desktop
 * viewport, including the letterbox under a 4:3 stage. Objects are "gone" here; nothing fades.
 */
export const EXIT_Y = 900

/** Motion cue: stretch along the fall direction, proportional to speed (px/screen), capped. */
export const STRETCH_PER_SPEED = 0.000022
export const STRETCH_MAX = 0.05

export type FallerId = 'photo' | 'heading' | 'text' | 'fact0' | 'fact1' | 'fact2'

export interface Faller {
  id: FallerId
  /** Top y of the object in the intro's settled layout (where it is released from rest). */
  restTop: number
  /** Tumble, degrees per screen of free fall. Small: it is a cue, not a spin. */
  omega: number
  /** Extra screens of fall beyond reaching EXIT_Y at the cut. Staggers exits and speeds. */
  stagger: number
}

/** The contract between the intro's outro and the spidey scene's opening. Edit here, both follow. */
export const FALLERS: Record<FallerId, Faller> = {
  photo: { id: 'photo', restTop: 112, omega: -2, stagger: 0.08 },
  heading: { id: 'heading', restTop: 214, omega: 2.5, stagger: 0.0 },
  text: { id: 'text', restTop: 392, omega: -3.2, stagger: 0.03 },
  fact0: { id: 'fact0', restTop: 376, omega: 3, stagger: 0.05 },
  fact1: { id: 'fact1', restTop: 456, omega: -3, stagger: 0.02 },
  fact2: { id: 'fact2', restTop: 536, omega: 2, stagger: 0.06 },
}

/** Screens of free fall from rest to reach EXIT_Y. */
export const fallTime = (restTop: number) => Math.sqrt((2 * Math.max(0, EXIT_Y - restTop)) / G)

/** Total screens of free fall an object has had at the moment of the cut. */
export const tauAtCut = (id: FallerId) => fallTime(FALLERS[id].restTop) + FALLERS[id].stagger

/** Speed (stage px per screen) an object has at the cut. The intro exits with it; spidey enters with it. */
export const speedAtCut = (id: FallerId) => G * tauAtCut(id)

/** Distance fallen after `tau` screens of free fall from rest. */
export const dropAfter = (tau: number) => 0.5 * G * Math.max(0, tau) ** 2

export const speedAfter = (tau: number) => G * Math.max(0, tau)

/** Tumble angle (degrees) after `tau` screens of free fall. */
export const tumbleAfter = (id: FallerId, tau: number) => FALLERS[id].omega * Math.max(0, tau)

/** scaleY for a given speed (px/screen). 1 at rest, at most 1 + STRETCH_MAX. */
export const stretchFor = (speed: number) => 1 + Math.min(STRETCH_MAX, Math.max(0, speed) * STRETCH_PER_SPEED)

/** Ballistic position: y0 + v0·s + ½·G·s². */
export const ballistic = (y0: number, v0: number, s: number) => y0 + v0 * s + 0.5 * G * s * s

/** First s ≥ 0 at which a ballistic body starting at (y0, v0) reaches `target` (target must be below y0). */
export function solveTime(y0: number, v0: number, target: number): number {
  const disc = v0 * v0 + 2 * G * (target - y0)
  return (-v0 + Math.sqrt(Math.max(0, disc))) / G
}

/**
 * A caught object decelerates uniformly from the speed it arrives with to rest over `distance`.
 * Returns how many screens that takes. This is what makes a catch a catch and not a teleport:
 * the deceleration is whatever it has to be for the speeds to match at the moment of contact.
 */
export const catchDuration = (arrivalSpeed: number, distance: number) => (2 * distance) / arrivalSpeed

/** Dev: the whole contract as a table. Call from the console in either scene. */
export function contractTable() {
  return (Object.keys(FALLERS) as FallerId[]).map((id) => ({
    id,
    restTop: FALLERS[id].restTop,
    fallScreens: +fallTime(FALLERS[id].restTop).toFixed(3),
    tauAtCut: +tauAtCut(id).toFixed(3),
    speedAtCut: +speedAtCut(id).toFixed(0),
    tumbleAtCut: +tumbleAfter(id, tauAtCut(id)).toFixed(2),
    releasedScreensBeforeCut: +tauAtCut(id).toFixed(3),
  }))
}

/**
 * The intro's side of the contract. Call it every update for each object:
 *
 *   const f = introFall('heading', sNow, INTRO_SCREENS)     // sNow = tl.time() * INTRO_SCREENS / INTRO_END_UNITS
 *   gsap.set(el, { y: restOffset + f.drop, rotation: f.rot, scaleY: f.stretch })
 *
 * The object sits still until `tau` becomes positive, then free-falls with the shared G, and reaches the
 * end of the intro at exactly `speedAtCut(id)`, below every desktop viewport. Nothing fades.
 * `sEnd` is the intro's total pin length in screens (the moment of the cut).
 * (The photo also has a scale: use scaleY: 0.56 * f.stretch so the stretch composes with it.)
 * `earlyBy` releases an object that many screens earlier. Only use it for objects that are NOT replicated in the
 * spidey scene (the photo): for the others it would break the speed match at the cut.
 */
export function introFall(id: FallerId, s: number, sEnd: number, earlyBy = 0) {
  const tau = s - (sEnd - tauAtCut(id)) + earlyBy
  return {
    /** Screens since release (0 while it is still at rest). */
    tau: Math.max(0, tau),
    /** Add to the object's rest y (px). */
    drop: dropAfter(tau),
    rot: tumbleAfter(id, tau),
    speed: speedAfter(tau),
    stretch: stretchFor(speedAfter(tau)),
    /** Screens before the cut at which this object lets go. The intro needs at least this much outro. */
    releasedAt: sEnd - tauAtCut(id) - earlyBy,
  }
}
