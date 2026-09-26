import { PROJECT_FRAME } from '../projectFrame'

/**
 * Layout frames for the workbench scene, in stage units (1280×720).
 *
 * He sits on the top edge of a large project frame, laptop on knees, glasses
 * on. He stays put; the frame's content cross-slides beneath him as scroll
 * advances — one project per beat.
 */

export const GROUND = 620
export const CHAR_SCALE = 1.5

/** Where the Hulk scene left him (standing hulk). The shrink starts here. */
export const ARRIVE_X = 760

/**
 * The project frame. Same object as the Hulk scene's FRAME_REST (projectFrame.ts): the Hulk scene's
 * last frame and this scene's first frame are the same picture. Its top edge is where he sits.
 */
export const BENCH = PROJECT_FRAME

/**
 * His pelvis while seated on the frame's top edge (plant 0: explicit).
 * With CHAR_SCALE 1.5 his head top is at stage y ≈ 76, which clears the 64 px fixed navbar
 * (64 / scale stage units) on every stage scale from 0.85 up; on wider or taller windows the
 * letterbox adds more room.
 */
export const SIT = { x: 640, y: 177 }

/** The closing link row, below the frame (clear of his exit walk). */
export const MORE = { x: 240, y: 648, w: 800 }

/* ---- hulk build (what he shrinks back from) ---- */
export const HULK_SCALE = 1.55
export const HULK_WEIGHT = 1.7
export const HULK_SPAN = 15
