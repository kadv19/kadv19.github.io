import { STAGE } from './useStageScale'

/**
 * The stage is a fixed 1280×720 canvas centred in its container and scaled with
 * "contain". These helpers translate between stage coordinates (what the intro
 * timeline thinks in) and the window coordinates the CharacterOverlay lives in.
 *
 * A scene measures its stage transform once on mount and again on window resize,
 * stores it, and converts every point via `toWindow()`.
 */

export interface StageTransform {
  /** The scale factor applied to the 1280×720 stage. */
  scale: number
  /** The stage's top-left corner, in window coordinates. */
  originX: number
  originY: number
}

/**
 * Measure the stage transform from a container element (the section that wraps
 * the 1280×720 stage div). If the container has zero size at measure time — as
 * can happen on the very first layout pass — fall back to the viewport so the
 * character at least appears in the right ballpark; the next resize will correct it.
 */
export function measureStage(container: HTMLElement | null): StageTransform {
  const r = container?.getBoundingClientRect()
  const w = r?.width ?? 0
  const h = r?.height ?? 0
  if (w < 1 || h < 1) {
    return {
      scale: Math.min(window.innerWidth / STAGE.w, window.innerHeight / STAGE.h),
      originX: 0,
      originY: 0,
    }
  }
  const scale = Math.min(w / STAGE.w, h / STAGE.h)
  const stageW = STAGE.w * scale
  const stageH = STAGE.h * scale
  return {
    scale,
    originX: (r?.left ?? 0) + (w - stageW) / 2,
    originY: (r?.top ?? 0) + (h - stageH) / 2,
  }
}

export function toWindow(t: StageTransform, x: number, y: number): [number, number] {
  return [t.originX + x * t.scale, t.originY + y * t.scale]
}

/** Inverse of `toWindow`: a window-space point back into stage units. */
export function fromWindow(t: StageTransform, x: number, y: number): [number, number] {
  return [(x - t.originX) / t.scale, (y - t.originY) / t.scale]
}
