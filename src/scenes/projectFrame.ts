/**
 * The project frame, in stage units (1280×720). ONE geometry, shared by the Hulk scene (where the
 * populated frame rises during the drag) and the workbench (where he sits on its top edge), so
 * the handoff between them is a cut between two identical pictures.
 *
 * hulk/frames.ts      FRAME_REST = PROJECT_FRAME
 * workbench/frames.ts BENCH      = PROJECT_FRAME
 *
 * Grown downward only (top edge pinned at y 185): the coder's pelvis is
 * derived from the top edge (workbench/frames.ts SIT), so growing up would
 * push his head under the fixed navbar, while the bottom has room until the
 * MORE link below. Bottom edge (185 + 465 = 650) sits just past the floor
 * line (GROUND 620) with the MORE link moved clear of it.
 */
export const PROJECT_FRAME = { x: 48, y: 185, w: 1184, h: 465 } as const

/** Tailwind `p-8`, in stage px. Both scenes pad their card identically. */
export const FRAME_PAD = 32

/** Room for the card inside the frame: h - 2 * pad. */
export const FRAME_INNER_H = PROJECT_FRAME.h - 2 * FRAME_PAD // 401

/** The frame box itself. Position/size come from PROJECT_FRAME via inline style. */
export const FRAME_CLASS = 'absolute overflow-hidden border border-line bg-surface rounded-[22px]'

/**
 * The card wrapper. Same string in both scenes = same padding, same clipping.
 * The 16:10 media panel is ~394px tall against 401px of room, so it shows
 * unclipped; the max-h below (= FRAME_INNER_H, written out because Tailwind
 * needs the literal) is a guard that keeps the card inside the frame instead
 * of being clipped at the bottom. It is a no-op if the card already fits.
 */
export const FRAME_CONTENT_CLASS =
  'absolute inset-0 overflow-y-hidden p-8 [&_article>div:first-child]:max-h-[401px]'
