/**
 * The project frame, in stage units (1280×720). ONE geometry, shared by the Hulk scene (where the
 * populated frame rises during the drag) and the workbench (where he sits on its top edge), so
 * the handoff between them is a cut between two identical pictures.
 *
 * hulk/frames.ts      FRAME_REST = PROJECT_FRAME
 * workbench/frames.ts BENCH      = PROJECT_FRAME
 *
 * Its bottom edge (185 + 435 = 620) sits on the floor line (GROUND).
 */
export const PROJECT_FRAME = { x: 48, y: 185, w: 1184, h: 435 } as const

/** Tailwind `p-8`, in stage px. Both scenes pad their card identically. */
export const FRAME_PAD = 32

/** Room for the card inside the frame: h - 2 * pad. */
export const FRAME_INNER_H = PROJECT_FRAME.h - 2 * FRAME_PAD // 371

/** The frame box itself. Position/size come from PROJECT_FRAME via inline style. */
export const FRAME_CLASS = 'absolute overflow-hidden border border-line bg-surface rounded-[22px]'

/**
 * The card wrapper. Same string in both scenes = same padding, same clipping.
 * The frame is wider than it used to be, so a 16:10 media panel would be ~394px tall against 371px of room;
 * the max-h below (= FRAME_INNER_H, written out because Tailwind needs the literal) keeps the card inside
 * the frame instead of being clipped at the bottom. It is a no-op if the card already fits.
 */
export const FRAME_CONTENT_CLASS =
  'absolute inset-0 overflow-y-hidden p-8 [&_article>div:first-child]:max-h-[371px]'
