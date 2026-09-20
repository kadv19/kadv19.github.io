import type { Pose } from './rig'

/**
 * The pose library. A pose is plain data — a set of angles — so a scene can
 * tween between any two of them with GSAP, and new poses are just new objects.
 * Personality lives here: same body, different situation.
 *
 * Angles: 0 = down, 90 = forward, 180 = up, negative = behind. See rig.ts.
 */

export const BASE: Pose = {
  x: 0,
  y: 0,
  scale: 1,
  dir: 1,
  ground: 0,
  plant: 0,
  lift: 0,
  weight: 1,
  span: 0,
  lean: 0,
  head: 0,
  lsh: -15,
  lel: 9,
  rsh: 12,
  rel: 10,
  lhip: -4,
  lkn: 0,
  rhip: 5,
  rkn: 0,
  lx: 0,
  ly: 0,
  lw: 0,
  rx: 0,
  ry: 0,
  rw: 0,
  wp: 0,
  wa: 0,
  glasses: 0,
  laptop: 0,
  lapX: 12,
  lapY: -6.5,
}

const pose = (o: Partial<Pose>): Pose => ({ ...BASE, ...o })

export const POSES = {
  /** Neutral: standing, arms relaxed. The character he returns to. */
  idle: pose({}),

  /** Introduces the photo: one arm out, slight lean toward it. */
  point: pose({
    lean: 4,
    head: -3,
    rsh: 112,
    rel: 2,
    lsh: -16,
    lel: 10,
    lhip: -9,
    rhip: 11,
    rkn: -4,
  }),

  /** Leaning into a pull — used while dragging a content block. Rear arm is driven by IK. */
  pull: pose({
    lean: 16,
    head: 6,
    lsh: 24,
    lel: 20,
    lhip: -6,
    rhip: 8,
  }),

  /** Hulk: stands wide, flexes. Bigger and heavier, still the same blue figure. */
  hulk: pose({
    scale: 1.55,
    weight: 1.7,
    span: 15,
    lean: 6,
    head: 10,
    lsh: -102,
    lel: -78,
    rsh: 102,
    rel: 78,
    lhip: -20,
    lkn: 6,
    rhip: 20,
    rkn: -6,
  }),

  /** Hulk, wound up before the jump. */
  hulkCrouch: pose({
    scale: 1.55,
    weight: 1.7,
    span: 15,
    lean: 34,
    head: 14,
    lsh: -58,
    lel: -6,
    rsh: -46,
    rel: -8,
    lhip: 62,
    lkn: -68,
    rhip: 70,
    rkn: -74,
  }),

  /** Hulk, airborne: arms up, legs tucked. */
  hulkAir: pose({
    scale: 1.55,
    weight: 1.7,
    span: 15,
    lean: -3,
    head: -4,
    lsh: -158,
    lel: -12,
    rsh: 158,
    rel: 12,
    lhip: 46,
    lkn: -78,
    rhip: 22,
    rkn: -58,
  }),

  /** Hulk, landing: front knee bent, rear leg out, one fist on the ground. */
  hulkLand: pose({
    scale: 1.55,
    weight: 1.7,
    span: 15,
    lean: 55,
    head: -40,
    lsh: -72,
    lel: -10,
    rsh: 3,
    rel: 0,
    lhip: 95,
    lkn: -95,
    rhip: -62,
    rkn: 0,
  }),

  /** "Tony Stark coding": seated on an edge, laptop on knees, glasses on. */
  coder: pose({
    lean: 9,
    head: 4,
    lsh: 4,
    lel: 70,
    rsh: 0,
    rel: 78,
    lhip: 86,
    lkn: -88,
    rhip: 92,
    rkn: -84,
    glasses: 1,
    laptop: 1,
  }),

  /** Calm ending: elbow on top of the button, ankles crossed. Faces right, button is to his right. */
  lean: pose({
    lean: 12,
    head: -9,
    lsh: -12,
    lel: 12,
    rsh: 43,
    rel: 47,
    lhip: -4,
    lkn: 0,
    rhip: 14,
    rkn: -30,
  }),
} satisfies Record<string, Pose>

export type PoseName = keyof typeof POSES
