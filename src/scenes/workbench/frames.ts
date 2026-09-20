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

/** The project frame: big, top edge near the top so the seated coder's head
 * nearly touches the navbar. Mirrors hulk FRAME_REST so the handoff reads as
 * one continuous window. */
export const BENCH = { x: 160, y: 180, w: 960, h: 440 }

/** His pelvis while seated on the frame's top edge (plant 0: explicit). */
export const SIT = { x: 640, y: 172 }

/** The closing link row, below the frame (clear of his exit walk). */
export const MORE = { x: 240, y: 648, w: 800 }

/* ---- hulk build (what he shrinks back from) ---- */
export const HULK_SCALE = 1.55
export const HULK_WEIGHT = 1.7
export const HULK_SPAN = 15
