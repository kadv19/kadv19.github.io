import type { CSSProperties } from 'react'

/**
 * A pinned scene's section is 100dvh tall, and ScrollTrigger keeps one more viewport of trailing
 * spacer after the pin ends (the section scrolls away in normal flow). The next pinned section
 * therefore starts one viewport AFTER the previous pin ended: a dead stretch in which the previous
 * scene's content scrolls up and out while the next scene's content scrolls in from below. That is
 * why a block that should sit still across a handoff appears to "travel".
 *
 * Pulling the next scene up by one viewport makes its pin start exactly where the previous pin ends,
 * so the handoff is a cut between two identical pictures. Each scene hides itself (visibility) until
 * its own pin starts, so the overlap never paints over the scene before it.
 *
 * Check with __scrollDiag.snapshot():   scene[n].start  ===  scene[n-1].end
 *
 *   true   the pin starts are ~1 viewport after the previous ends (a gap): apply the overlap.
 *   false  they already touch (something else already overlaps them): change nothing.
 */
export const OVERLAP_PREVIOUS_PIN = true

/** Inline style for the wrapper div around a pinned section that follows another pinned scene. */
export const overlapPreviousPin = (): CSSProperties | undefined =>
  OVERLAP_PREVIOUS_PIN ? { marginTop: '-100dvh' } : undefined
