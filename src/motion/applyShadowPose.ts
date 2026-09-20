import type { Pose, StickRig } from '../character/rig'
import { toWindow, type StageTransform } from './stageToWindow'

/**
 * Writes a scene's shadow pose (STAGE units) into the shared rig (WINDOW pixels).
 *
 * Every Pose field that is a position or a length in the world has to be converted, not just
 * x / y / scale. The ones that are easy to forget (and that broke the intro grab and the
 * spidey catch) are:
 *
 *   lx, ly, rx, ry   IK hand targets
 *   ground           the floor's y
 *   lift             hop height
 *
 * Everything else on a Pose is an angle, a 0..1 weight, or a figure-space length
 * (span, lapX, lapY) that the rig already scales with `scale`.
 *
 * All scenes must call this instead of `Object.assign(rig.pose, S, ...)` so the list lives in one place.
 */
export function applyShadowPose(rig: StickRig, S: Pose, t: StageTransform): void {
  const [x, y] = toWindow(t, S.x, S.y)
  const [lx, ly] = toWindow(t, S.lx, S.ly)
  const [rx, ry] = toWindow(t, S.rx, S.ry)
  Object.assign(rig.pose, S, {
    x,
    y,
    lx,
    ly,
    rx,
    ry,
    scale: S.scale * t.scale,
    ground: t.originY + S.ground * t.scale,
    lift: S.lift * t.scale,
  })
}
