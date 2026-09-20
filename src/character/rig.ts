/**
 * StickRig — a tiny procedural skeleton rendered as SVG.
 *
 * Why this exists instead of Rive/Lottie: the character is one circle and five
 * polylines. Everything that makes him expressive (pose, weight, scale, props)
 * is a handful of numbers, so the whole "animation system" is:
 *
 *      GSAP tweens numbers on a Pose object  →  rig.render() rewrites ~12 SVG attributes.
 *
 * Nothing in here knows about React, scroll, or the portfolio.
 *
 * Conventions (facing-relative, so a pose looks the same mirrored):
 *   - Limb angles are degrees. 0 = hanging straight down, 90 = pointing forward
 *     (the way he faces), 180 = straight up, negative = behind him.
 *   - `dir` is +1 (facing right) or -1 (facing left). It only mirrors x.
 *   - Upper limbs (`lsh`, `rsh`, `lhip`, `rhip`) are angles from vertical.
 *     Elbows/knees (`lel`, `rel`, `lkn`, `rkn`) are *bends relative to the upper limb*.
 *   - Figure space: origin at the pelvis, y down, 1 unit ≈ 1px at scale 1.
 */

export const DIMS = {
  torso: 44,
  upper: 24,
  fore: 24,
  thigh: 28,
  shin: 28,
  head: 12.5,
  limb: 6.2, // base stroke width of limbs
  outline: 1.1, // the light outline, per side
} as const

export interface Pose {
  // placement in the parent SVG's coordinate space (pelvis position)
  x: number
  y: number
  scale: number
  dir: number // +1 / -1
  // grounding: when plant > 0 the pelvis height is derived so the feet sit on `ground`
  // (minus `lift` for hops). Keeps him standing on the floor while he grows or crouches.
  ground: number
  plant: number
  lift: number
  // build
  weight: number // limb thickness multiplier (1 = normal, ~1.6 = strong)
  span: number // shoulder width (0 = a single point, like the original stick figure)
  // spine
  lean: number
  head: number
  // free-form limbs (FK)
  lsh: number
  lel: number
  rsh: number
  rel: number
  lhip: number
  lkn: number
  rhip: number
  rkn: number
  // reach: world-space hand targets, blended in with weight (IK)
  lx: number
  ly: number
  lw: number
  rx: number
  ry: number
  rw: number
  // walk cycle: phase in cycles, amount 0..1 blends the walk over the FK legs
  wp: number
  wa: number
  // props (0..1)
  glasses: number
  laptop: number
  lapX: number // laptop position relative to pelvis, figure units
  lapY: number
}

export type V = [number, number]

export interface Joints {
  hip: V
  neck: V
  head: V
  lSh: V
  lEl: V
  lHand: V
  rSh: V
  rEl: V
  rHand: V
  lKnee: V
  lFoot: V
  rKnee: V
  rFoot: V
}

/* ------------------------------ math helpers ------------------------------ */

const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI
const clamp = (v: number, a = -1, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpAngle = (a: number, b: number, t: number) => a + (((b - a + 540) % 360) - 180) * t
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]]
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k]
const limb = (angle: number, dir: number): V => [Math.sin(rad(angle)) * dir, Math.cos(rad(angle))]

/** Two-bone IK in facing space. `side` = -1 puts the elbow/knee below the line to the target. */
export function ik(from: V, to: V, u: number, f: number, dir: number, side = -1): [number, number] {
  const vx = to[0] - from[0]
  const vy = to[1] - from[1]
  const d = Math.min(Math.max(Math.hypot(vx, vy), Math.abs(u - f) + 0.01), u + f - 0.01)
  const theta = deg(Math.atan2(vx * dir, vy))
  const a = deg(Math.acos(clamp((u * u + d * d - f * f) / (2 * u * d))))
  const g = deg(Math.acos(clamp((u * u + f * f - d * d) / (2 * u * f))))
  const upper = theta + side * a
  return [upper, upper - side * (180 - g)]
}

/** Leg angles for a walk phase (in cycles). Pure function, so it can be scrubbed both ways. */
export function walk(phase: number) {
  const t = phase * Math.PI * 2
  return {
    lhip: 28 * Math.sin(t),
    rhip: -28 * Math.sin(t),
    lkn: -46 * Math.max(0, Math.cos(t)),
    rkn: -46 * Math.max(0, -Math.cos(t)),
    lsh: -20 * Math.sin(t),
    rsh: 20 * Math.sin(t),
  }
}

/* --------------------------------- solver --------------------------------- */

/** Legs: FK blended with the walk cycle. Independent of pelvis position. */
function legs(p: Pose) {
  const dir = p.dir < 0 ? -1 : 1
  const w = walk(p.wp)
  const lhip = lerp(p.lhip, w.lhip, p.wa)
  const rhip = lerp(p.rhip, w.rhip, p.wa)
  const lkn = lerp(p.lkn, w.lkn, p.wa)
  const rkn = lerp(p.rkn, w.rkn, p.wa)
  const lKnee = mul(limb(lhip, dir), DIMS.thigh)
  const lFoot = add(lKnee, mul(limb(lhip + lkn, dir), DIMS.shin))
  const rKnee = mul(limb(rhip, dir), DIMS.thigh)
  const rFoot = add(rKnee, mul(limb(rhip + rkn, dir), DIMS.shin))
  return { lKnee, lFoot, rKnee, rFoot }
}

/** Pelvis y after grounding. Feet (plus their rounded caps) rest on `ground`. */
export function effectiveY(p: Pose): number {
  if (p.plant <= 0) return p.y
  const { lFoot, rFoot } = legs(p)
  const cap = (DIMS.limb * p.weight) / 2 + DIMS.outline
  const bottom = Math.max(lFoot[1], rFoot[1]) + cap
  const planted = p.ground - p.lift - bottom * p.scale
  return lerp(p.y, planted, Math.min(1, p.plant))
}

export function solve(p: Pose): Joints {
  const dir = p.dir < 0 ? -1 : 1
  const l = rad(p.lean)
  const torsoV: V = [Math.sin(l) * dir, -Math.cos(l)]
  const perp: V = [Math.cos(l), Math.sin(l) * dir]

  const hip: V = [0, 0]
  const neck = add(hip, mul(torsoV, DIMS.torso))
  const shoulderC = add(hip, mul(torsoV, DIMS.torso * 0.9))
  const lSh = add(shoulderC, mul(perp, -p.span / 2))
  const rSh = add(shoulderC, mul(perp, p.span / 2))

  const hr = rad(p.lean + p.head)
  const head = add(neck, mul([Math.sin(hr) * dir, -Math.cos(hr)], DIMS.head * 0.92))

  const w = walk(p.wp)
  const { lKnee, lFoot, rKnee, rFoot } = legs(p)

  // arms: FK (+ walk swing), then blended toward IK if a reach target is active
  const arm = (sh: V, sh0: number, el0: number, swing: number, tx: number, ty: number, rw: number) => {
    let a1 = sh0 + swing * p.wa
    let a2 = a1 + el0
    if (rw > 0) {
      const target: V = [(tx - p.x) / p.scale, (ty - p.y) / p.scale]
      const [i1, i2] = ik(sh, target, DIMS.upper, DIMS.fore, dir)
      a1 = lerpAngle(a1, i1, rw)
      a2 = lerpAngle(a2, i2, rw)
    }
    const el = add(sh, mul(limb(a1, dir), DIMS.upper))
    const hand = add(el, mul(limb(a2, dir), DIMS.fore))
    return { el, hand }
  }
  const L = arm(lSh, p.lsh, p.lel, w.lsh, p.lx, p.ly, p.lw)
  const R = arm(rSh, p.rsh, p.rel, w.rsh, p.rx, p.ry, p.rw)

  return {
    hip,
    neck,
    head,
    lSh,
    lEl: L.el,
    lHand: L.hand,
    rSh,
    rEl: R.el,
    rHand: R.hand,
    lKnee,
    lFoot,
    rKnee,
    rFoot,
  }
}

/** Convert a figure-space point (e.g. a hand) to the parent SVG's space. Pass `rig.eff`. */
export const toWorld = (p: Pose, v: V): V => [p.x + v[0] * p.scale, p.y + v[1] * p.scale]

/* -------------------------------- renderer -------------------------------- */

const NS = 'http://www.w3.org/2000/svg'
type Attrs = Record<string, string | number>

function make<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, parent?: Element) {
  const node = document.createElementNS(NS, tag)
  for (const k in attrs) node.setAttribute(k, String(attrs[k]))
  parent?.appendChild(node)
  return node
}

const f = (n: number) => Math.round(n * 100) / 100
const path = (...pts: V[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join('')

interface Layer {
  torso: SVGPathElement
  bar: SVGPathElement
  lArm: SVGPathElement
  rArm: SVGPathElement
  lLeg: SVGPathElement
  rLeg: SVGPathElement
  head: SVGCircleElement
}

function buildLayer(parent: Element, color: string): Layer {
  const g = make('g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent)
  g.style.stroke = color
  const p = () => make('path', {}, g)
  const layer: Layer = {
    torso: p(),
    bar: p(),
    lArm: p(),
    rArm: p(),
    lLeg: p(),
    rLeg: p(),
    head: make('circle', { cx: 0, cy: 0, r: DIMS.head }, g),
  }
  layer.head.style.fill = color
  layer.head.setAttribute('stroke', 'none')
  return layer
}

/**
 * Draws the figure into an existing <g>. Two passes — every part's light
 * outline first, then every part's solid blue — so the outline only appears
 * around the silhouette, never between overlapping limbs.
 */
export class StickRig {
  pose: Pose
  /** The pose as drawn last frame (pelvis y resolved through grounding). */
  eff: Pose
  joints: Joints
  private fig: SVGGElement
  private outline: Layer
  private body: Layer
  private laptopEl: SVGGElement
  private glassesEl: SVGGElement

  constructor(private root: SVGGElement, pose: Pose) {
    this.pose = { ...pose }
    this.eff = this.pose
    while (root.firstChild) root.removeChild(root.firstChild)
    this.fig = make('g', {}, root)

    // laptop sits under the body so hands and thighs read as "on" it
    this.laptopEl = make('g', {}, this.fig)
    const lapStroke = make('g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, this.laptopEl)
    lapStroke.style.stroke = 'var(--color-ink)'
    make('path', { d: 'M0 0L34 0', 'stroke-width': 3.4 }, lapStroke)
    make('path', { d: 'M34 0L43 -25', 'stroke-width': 2.6 }, lapStroke)

    this.outline = buildLayer(this.fig, 'var(--color-blue-soft)')
    this.body = buildLayer(this.fig, 'var(--color-blue)')

    // glasses: a prop, not a face — two dark lenses and a bridge
    this.glassesEl = make('g', {}, this.fig)
    const lens = { y: -3.2, width: 8.4, height: 6.2, rx: 2.4 }
    const gl = (x: number) => {
      const r = make('rect', { x, ...lens }, this.glassesEl)
      r.style.fill = 'var(--color-ink)'
    }
    gl(-10.2)
    gl(1.8)
    const bridge = make('path', { d: 'M-1.8 -0.8L1.8 -0.8', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, this.glassesEl)
    bridge.style.stroke = 'var(--color-ink)'

    this.joints = solve(this.pose)
    this.render()
  }

  render(): Joints {
    const p = (this.eff = { ...this.pose, y: effectiveY(this.pose) })
    const j = (this.joints = solve(p))
    const dir = p.dir < 0 ? -1 : 1

    this.fig.setAttribute('transform', `translate(${f(p.x)} ${f(p.y)}) scale(${f(p.scale)})`)

    const limbW = DIMS.limb * p.weight
    const torsoW = limbW * 1.12
    const o = DIMS.outline * 2

    const paint = (layer: Layer, extra: number) => {
      layer.torso.setAttribute('d', path(j.hip, j.neck))
      layer.torso.setAttribute('stroke-width', String(f(torsoW + extra)))
      layer.bar.setAttribute('d', path(j.lSh, j.rSh))
      layer.bar.setAttribute('stroke-width', String(f(limbW + extra)))
      layer.lArm.setAttribute('d', path(j.lSh, j.lEl, j.lHand))
      layer.rArm.setAttribute('d', path(j.rSh, j.rEl, j.rHand))
      layer.lLeg.setAttribute('d', path(j.hip, j.lKnee, j.lFoot))
      layer.rLeg.setAttribute('d', path(j.hip, j.rKnee, j.rFoot))
      for (const a of [layer.lArm, layer.rArm, layer.lLeg, layer.rLeg]) a.setAttribute('stroke-width', String(f(limbW + extra)))
      layer.head.setAttribute('cx', String(f(j.head[0])))
      layer.head.setAttribute('cy', String(f(j.head[1])))
      layer.head.setAttribute('r', String(f(DIMS.head + extra / 2)))
    }
    paint(this.outline, o)
    paint(this.body, 0)

    // props
    const lap = clamp(p.laptop, 0, 1)
    this.laptopEl.setAttribute('transform', `translate(${f(p.lapX * dir)} ${f(p.lapY)}) scale(${f(Math.max(lap, 0.001) * dir)} ${f(Math.max(lap, 0.001))})`)
    this.laptopEl.style.opacity = String(lap)

    const gl = clamp(p.glasses, 0, 1)
    this.glassesEl.setAttribute(
      'transform',
      `translate(${f(j.head[0] + 3 * dir)} ${f(j.head[1])}) rotate(${f((p.lean + p.head) * dir)})`,
    )
    this.glassesEl.style.opacity = String(gl)
    return j
  }

  destroy() {
    while (this.root.firstChild) this.root.removeChild(this.root.firstChild)
  }
}
