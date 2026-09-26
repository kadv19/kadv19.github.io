/**
 * The backdrop: the colour of the world behind the page.
 *
 * Idea: natural-dye pigments on handmade paper. Each stage of the story has its own ground colour, and two
 * pigment shapes (hand-cut, slightly off register, so where they overlap a third colour appears) sit at the
 * edges. The blue character is the constant; everything around him changes with the story.
 *
 *   intro      haldi   turmeric yellow      who I am
 *   spidey     madder  coral                the fall and the catch
 *   hulk       leaf    fresh green          strength
 *   workbench  orchid  petal pink           the work
 *   after      river   calm aqua            contact, everything quiet again
 *
 * How it works, and why it touches no scene files:
 *  - One fixed layer behind everything (shapes + paper grain). Scene sections are made transparent in CSS
 *    (`main section.bg-paper`), so the same picture shows through every scene and every handoff cut.
 *  - The ground is the CSS variable --color-paper on <html>; everything that already uses `bg-paper`
 *    (header, body) follows it. --color-blue-tint follows too (photo frame, media placeholders).
 *  - The colour is a pure function of scroll position: stops are derived from the pin ranges of the scenes
 *    (ScrollTrigger ids intro / spidey / hulk / work), interpolated in OKLab. It runs only when scroll changes.
 *    If the pinned scenes do not exist (mobile, reduced motion) the same five worlds are spread over the page.
 *
 * Dev: __backdrop.report() prints the stops and the worst text contrast along the whole journey.
 */
import { ScrollTrigger } from './gsap'
import { CLUSTERS } from './backdropShapes'

export interface World {
  ground: string
  pigA: string
  pigB: string
  tint: string
  /** Underlines and rules: a strong version of the world's hue. */
  pop: string
}

/** Pigments are analogous pairs around each ground (hue -22° / +24°); every ground keeps ink text >= 7:1. */
export const WORLDS = {
  haldi: { ground: '#ffdf75', pigA: '#ffbe4d', pigB: '#d1e262', tint: '#fff3c2', pop: '#a57b00' },
  madder: { ground: '#ffad8e', pigA: '#ff9297', pigB: '#f8a856', tint: '#fccdbd', pop: '#d44f00' },
  leaf: { ground: '#b3eb89', pigA: '#ced230', pigB: '#5aeca0', tint: '#d8f4c4', pop: '#399900' },
  orchid: { ground: '#ffb3d5', pigA: '#eca2e5', pigB: '#ffa2a8', tint: '#fbd3e3', pop: '#c75083' },
  river: { ground: '#ace7ee', pigA: '#95dcd0', pigB: '#9fd9f5', tint: '#d7f3f6', pop: '#20909f' },
} as const satisfies Record<string, World>

export type WorldName = keyof typeof WORLDS
export type Colors = Record<keyof World | 'overlap', string>

/* ------------------------------------ colour maths ------------------------------------ */

type Lab = [number, number, number]
const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const fromLin = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
const rgbOf = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const hexOf = (rgb: number[]) => '#' + rgb.map((v) => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0')).join('')

export function hexToLab(hex: string): Lab {
  const [r, g, b] = rgbOf(hex).map((v) => toLin(v / 255))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]
}

export function labToHex([L, a, b]: Lab): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]
  return hexOf(lin.map((v) => fromLin(Math.min(1, Math.max(0, v))) * 255))
}

const mixLab = (a: Lab, b: Lab, t: number): Lab => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const multiply = (a: string, b: string) => hexOf(rgbOf(a).map((v, i) => (v * rgbOf(b)[i]) / 255))
const mixHex = (a: string, b: string, t: number) => hexOf(rgbOf(a).map((v, i) => v + (rgbOf(b)[i] - v) * t))
const smooth = (t: number) => t * t * (3 - 2 * t)

const KEYS = ['ground', 'pigA', 'pigB', 'tint', 'pop'] as const
const LAB: Record<WorldName, Record<(typeof KEYS)[number], Lab>> = Object.fromEntries(
  (Object.keys(WORLDS) as WorldName[]).map((n) => [n, Object.fromEntries(KEYS.map((k) => [k, hexToLab(WORLDS[n][k])]))]),
) as never

/* ------------------------------------- the journey ------------------------------------- */

export interface Range {
  start: number
  end: number
}
export interface Stop {
  pos: number
  world: WorldName
}

/**
 * Where each world begins and ends, in scroll px. The colour changes at story beats:
 * to coral as the block falls and is caught, to green as he grows, to pink as the frame rises,
 * to aqua as he stands up and walks off.
 */
export function buildStops(r: { spidey?: Range; hulk?: Range; work?: Range }, total: number): Stop[] {
  let stops: Stop[]
  if (r.spidey && r.hulk && r.work) {
    const at = (g: Range, f: number) => g.start + (g.end - g.start) * f
    stops = [
      { pos: 0, world: 'haldi' },
      { pos: at(r.spidey, 0.05), world: 'haldi' },
      { pos: at(r.spidey, 0.5), world: 'madder' },
      { pos: at(r.hulk, 0.02), world: 'madder' },
      { pos: at(r.hulk, 0.3), world: 'leaf' },
      { pos: at(r.hulk, 0.7), world: 'leaf' },
      { pos: at(r.work, 0.1), world: 'orchid' },
      { pos: at(r.work, 0.7), world: 'orchid' },
      { pos: r.work.end, world: 'river' },
      { pos: total, world: 'river' },
    ]
  } else {
    // no pinned scenes (mobile / reduced motion): spread the same journey over the page
    const f = (x: number) => total * x
    stops = [
      { pos: 0, world: 'haldi' },
      { pos: f(0.16), world: 'haldi' },
      { pos: f(0.3), world: 'madder' },
      { pos: f(0.42), world: 'madder' },
      { pos: f(0.54), world: 'leaf' },
      { pos: f(0.64), world: 'leaf' },
      { pos: f(0.76), world: 'orchid' },
      { pos: f(0.86), world: 'orchid' },
      { pos: f(0.96), world: 'river' },
      { pos: Math.max(total, f(0.96) + 1), world: 'river' },
    ]
  }
  stops.sort((a, b) => a.pos - b.pos)
  for (let i = 1; i < stops.length; i++) if (stops[i].pos <= stops[i - 1].pos) stops[i].pos = stops[i - 1].pos + 0.5
  return stops
}

/** The colours at a scroll position: OKLab interpolation between the surrounding stops. */
export function colorsAt(pos: number, stops: Stop[]): Colors {
  let i = 0
  while (i < stops.length - 2 && pos >= stops[i + 1].pos) i++
  const a = stops[i], b = stops[i + 1]
  const t = a.world === b.world ? 0 : smooth(Math.min(1, Math.max(0, (pos - a.pos) / (b.pos - a.pos))))
  const c = Object.fromEntries(KEYS.map((k) => [k, labToHex(mixLab(LAB[a.world][k], LAB[b.world][k], t))])) as Record<(typeof KEYS)[number], string>
  // where the two pigments overlap: their multiply, lightened a little so it never gets muddy
  return { ...c, overlap: mixHex(multiply(c.pigA, c.pigB), c.pigA, 0.3) }
}

/* -------------------------------------- the layer -------------------------------------- */

const GRAIN =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .09  0 0 0 0 .09  0 0 0 0 .22  .9 0 0 0 -.44'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
  )

function markup() {
  const shapes = CLUSTERS.map((c, i) => {
    const A = i % 2 ? 'var(--world-b)' : 'var(--world-a)'
    const B = i % 2 ? 'var(--world-a)' : 'var(--world-b)'
    return (
      `<clipPath id="bd-c${i}"><path d="${c.a}"/></clipPath>` +
      `<path d="${c.a}" style="fill:${A}"/><path d="${c.b}" style="fill:${B}"/>` +
      `<path d="${c.b}" clip-path="url(#bd-c${i})" style="fill:var(--world-overlap)"/>`
    )
  }).join('')
  return (
    `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">${shapes}</svg>` +
    `<div style="position:absolute;inset:0;background-image:url(&quot;${GRAIN}&quot;);background-size:220px 220px"></div>`
  )
}

let installed = false

export function installBackdrop() {
  if (typeof document === 'undefined' || installed) return
  installed = true

  const root = document.documentElement
  const host = document.createElement('div')
  host.id = 'backdrop'
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden'
  host.innerHTML = markup()
  document.body.insertBefore(host, document.body.firstChild)

  let stops = buildStops({}, 1)
  let last = ''

  const apply = (pos: number) => {
    const c = colorsAt(pos, stops)
    const key = KEYS.map((k) => c[k]).join() + c.overlap
    if (key === last) return
    last = key
    root.style.setProperty('--color-paper', c.ground)
    root.style.setProperty('--color-blue-tint', c.tint)
    root.style.setProperty('--world-pop', c.pop)
    host.style.setProperty('--world-a', c.pigA)
    host.style.setProperty('--world-b', c.pigB)
    host.style.setProperty('--world-overlap', c.overlap)
    return c
  }

  const range = (id: string): Range | undefined => {
    const st = ScrollTrigger.getById(id)
    return st && st.end - st.start > 1 ? { start: st.start, end: st.end } : undefined
  }

  const rebuild = () => {
    const total = Math.max(1, root.scrollHeight - window.innerHeight)
    stops = buildStops({ spidey: range('spidey'), hulk: range('hulk'), work: range('work') }, total)
    last = ''
    apply(window.scrollY)
  }

  ScrollTrigger.create({ trigger: root, start: 0, end: 'max', onUpdate: () => apply(window.scrollY), onRefresh: rebuild })
  ScrollTrigger.addEventListener('refresh', rebuild)
  window.addEventListener('load', rebuild)
  rebuild()

  ;(window as unknown as Record<string, unknown>).__backdrop = {
    stops: () => stops.map((s) => ({ pos: Math.round(s.pos), world: s.world })),
    at: (pos: number) => colorsAt(pos, stops),
    report: () => {
      console.table(stops.map((s) => ({ scrollPx: Math.round(s.pos), world: s.world, ground: WORLDS[s.world].ground })))
      console.log('current', colorsAt(window.scrollY, stops))
    },
  }
}
