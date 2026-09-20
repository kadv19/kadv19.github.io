/**
 * Layout frames for the intro scene, in stage units (1280×720).
 *
 *   Frame A — the wide, landscape opening (who I am).
 *   Frame B — the recomposed "about" layout it settles into.
 *
 * Blocks never resize or reflow while moving: they only translate (and the
 * photo scales uniformly). That keeps text crisp and the motion cheap.
 * Changing the layout of the scene = editing numbers here.
 */

export const GROUND = 620 // y of the floor the character stands on
export const CHAR_SCALE = 1.5

export const A = {
  identity: { x: 96, y: 116, w: 560 },
  intro: { x: 96, y: 392, w: 480 },
  facts: [
    { x: 96, y: 552 },
    { x: 262, y: 552 },
    { x: 428, y: 552 },
  ],
  factW: 150,
  photo: { x: 860, y: 100, w: 300, h: 400 },
  bubble: { x: 664, y: 372 },
  cue: { x: 640, y: 664 },
} as const

export const B = {
  photo: { x: 96, y: 112, scale: 0.56 },
  facts: [
    { x: 96, y: 376 },
    { x: 96, y: 456 },
    { x: 96, y: 536 },
  ],
  intro: { x: 416, y: 392 }, // = where the carried block ends up (see CARRY)
  about: { x: 416, y: 214, w: 640 },
} as const

/** Where the block is gripped: its right edge, this far below its top. */
export const GRIP_Y = 64

/**
 * The carry choreography, all derived so contact is exact:
 * he grabs at GRAB_X, then pulls until the block's right edge sits where B.intro puts it.
 */
export const HAND_OFFSET = 50 // hand hangs this far behind the pelvis while pulling
export const GRAB_X = A.intro.x + A.intro.w + HAND_OFFSET // 626
export const DROP_X = B.intro.x + A.intro.w + HAND_OFFSET // 946
export const START_X = 780

/** Where he exits after the drag: offstage right (user's right), clearing the way for Spidey. */
export const EXIT_X = 1420

/* ---- outro scroll budget (see motion/freeFall.ts) ---------------------------------------- */

/**
 * Pin length of the intro in viewport heights, and the timeline's length in units.
 * IntroStage MUST pass `screens: INTRO_SCREENS` to pinnedScene(): the outro gravity is
 * defined in scroll space (s = time * INTRO_SCREENS / INTRO_END), and the outro needs
 * ~1.1 screens so the slowest object (photo) reaches EXIT_Y at the cut.
 */
export const INTRO_SCREENS = 3.2
export const INTRO_END = 15.0
