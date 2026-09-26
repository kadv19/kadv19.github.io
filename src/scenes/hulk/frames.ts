import type { Pose } from '../../character/rig'
import { PROJECT_FRAME } from '../projectFrame'

/**
 * Layout frames for the Hulk scene, in stage units (1280×720).
 *
 * He starts where Spidey left him (idle, normal size, beside the caught block), grows in place,
 * jumps through the upper half Spidey emptied, and lands where the workbench will be. The caught
 * block drops away during the flight; the Projects header arrives as he lands.
 */

export const GROUND = 620
export const CHAR_SCALE = 1.5

/** Where he stands when the scene starts (Spidey's end pose, idle). */
export const HULK_X = 942

/** Where he stands after landing (left of the title, inside arm's reach of its edge). */
export const LAND_X = 715

/** How high the jump goes (hop height via the rig's lift — feet stay grounded-math, no pop). */
export const JUMP_LIFT = 260

/**
 * The caught block, resting exactly where Spidey left it. MUST equal spidey/frames.ts BLOCK_LAND
 * (416, 500): the Spidey → Hulk handoff is a cut, and a block that is 40 px off jumps.
 */
export const BLOCK_REST = { x: 416, y: 500, w: 480 }

/** The Projects header: rests on top; he hop-grabs its bottom-middle and drags it off left. */
export const PROJECTS_TITLE = { x: 240, y: 150, w: 800 }

/** Grip point on the title, relative to its top-left (bottom-middle). */
export const TITLE_GRIP_DX = 400
export const TITLE_GRIP_DY = 40

/** Where he walks to grab it (under the grip), and how high the hop goes. */
export const GRAB_X = 650
export const HOP_LIFT = 260

/** Where the drag ends: him and the 800-wide title fully off-screen left. */
export const DRAG_END_X = -500

/** The project frame: rises during the drag, settling on the workbench geometry (shared, see projectFrame.ts). */
export const FRAME_REST = PROJECT_FRAME
export const FRAME_FROM_Y = 900

/* ---- hulk build (mirrors poses.ts hulk*) ---- */
export const HULK_SCALE = 1.55
export const HULK_WEIGHT = 1.7
export const HULK_SPAN = 15

/* ---- the landing, as two poses of its own ------------------------------------------------
 * Angles only (facing-relative, see rig.ts), so they mirror with dir. They live here instead of
 * poses.ts because they are specific to this beat and to the Hulk build (weight 1.7 is thick enough
 * that limbs merge into a slab unless there is daylight between them).
 *
 * BRACE  Last moment of the fall: legs stretching for the floor, arms flung out, torso still fairly upright.
 * LAND   Impact: front foot flat, rear knee down with the shin along the floor, torso hunched, head up,
 *        fist planted ahead of the front foot, other arm thrown back for balance.
 *
 * LAND's fist (rsh 20°, straight arm) meets the floor to within 0.5 px on the Hulk build; front foot and
 * rear shin are both on the floor (the rig's grounding puts the pelvis where that is true). The old
 * hulkLand (lean 55, thigh 95°, rear leg 62° back) left the fist ~17 px in the air and made a horizontal slab.
 */
type Angles = Pick<Pose, 'lean' | 'head' | 'lsh' | 'lel' | 'rsh' | 'rel' | 'lhip' | 'lkn' | 'rhip' | 'rkn'>

export const HULK_BRACE: Angles = {
  lean: 30,
  head: -34,
  lsh: -100,
  lel: -18,
  rsh: 38,
  rel: 6,
  lhip: 58,
  lkn: -46,
  rhip: -22,
  rkn: -28,
}

export const HULK_LAND: Angles = {
  lean: 64,
  head: -54,
  lsh: -112,
  lel: -25,
  rsh: 20,
  rel: 0,
  lhip: 104,
  lkn: -104,
  rhip: -26,
  rkn: -72,
}
