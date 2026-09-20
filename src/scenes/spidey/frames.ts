/**
 * Layout frames for the Spider-Man catch scene, in stage units (1280×720).
 *
 * The scene opens already mid-fall: the intro's outro drops its layout out of the bottom of the
 * screen, and these same objects enter here from above at the SAME speed (see motion/freeFall.ts).
 * Nothing rests, nothing fades. He catches the intro text; the rest fall out of the bottom.
 *
 * Vertical order that must hold:  ENTRY_TOP.text < CATCH_Y < BLOCK_LAND.y
 */

export const GROUND = 620

/** Figure scale multiplier. Character is ~1.5× the base unit. */
export const CHAR_SCALE = 1.5

/**
 * CSS placement of the caught block (SpideyStage positions it here) and its width.
 * The timeline moves it with transforms relative to this, so leave x / y / w alone.
 */
export const BLOCK_START = { x: 416, y: 392, w: 480 }

/** Where the caught block comes to rest (top-left). The scene ends with it exactly here. */
export const BLOCK_LAND = { x: 416, y: 460 }

/**
 * Block's top y at the moment his hand meets its top-right corner.
 * The ride (CATCH_Y -> BLOCK_LAND.y) is where the block sheds its speed, so it needs real
 * distance: 55 px cannot absorb a fall, it can only look like a stop. 170 px can.
 */
export const CATCH_Y = 330

/** Block's top-right corner at the catch, and at rest (what the geometry is solved against). */
export const CATCH_CORNER: [number, number] = [BLOCK_START.x + BLOCK_START.w, CATCH_Y]
export const LAND_CORNER: [number, number] = [BLOCK_LAND.x + BLOCK_START.w, BLOCK_LAND.y]

/* ---- scroll budget ---------------------------------------------------------------------- */

/**
 * Pin length of this scene in viewport heights, and the timeline's length in units.
 * SpideyStage MUST pass `screens: SPIDEY_SCREENS` to pinnedScene(): the gravity is defined in
 * scroll space, so the timeline needs to know how many screens its units are worth.
 * (The timeline warns in the console if the real pin length disagrees.)
 */
export const SPIDEY_SCREENS = 1.0
export const SPIDEY_END = 5.0

/* ---- the replicas: same layout as the intro's settled state ---------------------------- */

export const ABOUT_START = { x: 416, y: 214, w: 640 }
export const FACTS_START = [
  { x: 96, y: 376 },
  { x: 96, y: 456 },
  { x: 96, y: 536 },
] as const

/**
 * Each object's top y at s = 0 (the cut). They open already mid-air and spread
 * down the stage, so the first scroll pixels already show falling words — no
 * empty opening. All still enter with exactly their contract speeds (see
 * freeFall.speedAtCut), so the gravity is unaffected; only the phase changed.
 *
 * ORDER MATTERS, because everything shares one gravity and only differs by entry speed
 * (heading 1435, fact0 1329, text 1280, fact1 1184, fact2 1135 px/screen). Anything that shares
 * columns must be stacked so the FASTER object is the LOWER one; then the gap only grows and
 * nothing ever passes through anything else:
 *   text column (x 416..):  text on top, heading below it (heading is faster).
 *   facts column (x 96..):  fact2 on top, fact1, fact0 lowest (each faster than the one above).
 * Minimum gap at s = 0 is ~26 px and grows from there.
 */
export const ENTRY_TOP = {
  text: -150,
  heading: 100,
  fact0: -20,
  fact1: -110,
  fact2: -200,
} as const

/* ---- catch tuning (see catchGeometry.ts) ------------------------------------------------ */

/** Shoulder is this far right of the block corner, and this far above it at the catch. */
export const REACH_DX = 46
export const REACH_DY_CATCH = -22

/** Web length in stage px (long, so the anchor sits off the top of the stage). */
export const WEB_LENGTH = 560
/** Web angle from vertical at the catch, and where the swing starts (degrees). */
export const WEB_CATCH_ANGLE = 8
export const WEB_START_ANGLE = 64

/* ---- legacy, no longer used by the timeline (kept so existing imports still compile) ---- */
export const FALL_FROM_Y = -80
export const BLOCK_TILT = -4
export const ABOUT_FROM_Y = -100
export const ABOUT_DROP = 900
export const FACTS_FROM_Y = [-90, -60, -30] as const
export const FACT_DROP = 860
export const FACT_W = 150
export const ENTER_X = 1400
export const LAND_X = 900
export const SWING_LIFT = 180
export const WEB_ANCHOR = { x: 1150, y: -40 }
export const HAND_OFFSET_X = -60
export const HAND_OFFSET_Y = -20
