/**
 * Layout frames for the Hulk scene, in stage units (1280×720).
 *
 * He starts where Spidey left him (idle, normal size, beside the caught block),
 * grows in place, jumps through the upper half Spidey emptied, and lands where
 * the workbench will be. The caught block exits during the flight; the Projects
 * header arrives as he lands.
 */

export const GROUND = 620
export const CHAR_SCALE = 1.5

/** Where he stands when the scene starts (Spidey's end pose, idle). */
export const HULK_X = 942

/** Where he stands after landing (left of the title, inside arm's reach of its edge). */
export const LAND_X = 715

/** How high the jump goes (hop height via the rig's lift — feet stay grounded-math, no pop). */
export const JUMP_LIFT = 260

/** The caught block, resting where Spidey left it. Exits during the flight. */
export const BLOCK_REST = { x: 416, y: 460, w: 480 }

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

/** The project frame: rises during the drag, settling on the workbench geometry
 * (mirrors workbench BENCH so the handoff reads as one continuous window). */
export const FRAME_REST = { x: 160, y: 180, w: 960, h: 440 }
export const FRAME_FROM_Y = 900

/* ---- hulk build (mirrors poses.ts hulk*) ---- */
export const HULK_SCALE = 1.55
export const HULK_WEIGHT = 1.7
export const HULK_SPAN = 15
