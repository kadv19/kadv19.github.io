/**
 * Scroll diagnostics. Dev tool: prints what ScrollTrigger actually measured, and says
 * which failure mode (A–H) the numbers match.
 *
 * Enabled automatically in `npm run dev`, or on a built site with `?scrolldiag` in the URL.
 * Add `?markers` to also draw ScrollTrigger's start/end markers on the page.
 *
 * In the console:
 *   __scrollDiag.snapshot()   print the table + verdicts now
 *   __scrollDiag.sweep()      scroll through every scene at 0/25/50/75/100% and print progress
 *   __scrollDiag.trace(true)  log which scene's timeline is writing the character (case G)
 */
import { ScrollTrigger } from './gsap'

const TAG = '[scrolldiag]'

interface Row {
  '#': number
  id: string
  trigger: string
  triggerH: number
  pinH: number
  start: number
  end: number
  range: number
  rangeVh: number
  spacerH: number | null
  progress: number
  active: boolean
}

const name = (el?: Element | null) => (el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}` : 'none')

function collect(): Row[] {
  const vh = window.innerHeight
  return ScrollTrigger.getAll().map((st, i) => {
    const trigger = st.trigger as HTMLElement | undefined
    const pin = st.pin as HTMLElement | undefined
    const parent = pin?.parentElement
    const spacer = parent && parent.classList.contains('pin-spacer') ? parent : null
    const range = st.end - st.start
    return {
      '#': i,
      id: st.vars.id ?? '(no id)',
      trigger: name(trigger),
      triggerH: trigger ? Math.round(trigger.offsetHeight) : -1,
      pinH: pin ? Math.round(pin.offsetHeight) : -1,
      start: Math.round(st.start),
      end: Math.round(st.end),
      range: Math.round(range),
      rangeVh: +(range / vh).toFixed(2),
      spacerH: spacer ? Math.round(spacer.offsetHeight) : null,
      progress: +st.progress.toFixed(3),
      active: st.isActive,
    }
  })
}

/** Things that break `position: fixed` (which is how GSAP pins) or create a second scroller. */
function ancestorIssues(): string[] {
  const out: string[] = []
  const seen = new Set<Element>()
  for (const st of ScrollTrigger.getAll()) {
    const pin = st.pin
    if (!pin) continue
    for (let el = pin.parentElement; el && el !== document.documentElement; el = el.parentElement) {
      if (seen.has(el) || el.classList.contains('pin-spacer')) continue
      seen.add(el)
      const cs = getComputedStyle(el)
      const bad: string[] = []
      if (cs.transform && cs.transform !== 'none') bad.push(`transform: ${cs.transform}`)
      if (cs.filter && cs.filter !== 'none') bad.push('filter')
      if (cs.perspective && cs.perspective !== 'none') bad.push('perspective')
      if (cs.willChange && /transform|filter|perspective/.test(cs.willChange)) bad.push(`will-change: ${cs.willChange}`)
      if (cs.contain && /paint|layout|strict|content/.test(cs.contain)) bad.push(`contain: ${cs.contain}`)
      if (bad.length) out.push(`${name(el)} → ${bad.join('; ')}`)
    }
  }
  const h = getComputedStyle(document.documentElement)
  const b = getComputedStyle(document.body)
  const clip = (o: string) => o !== 'visible'
  if ((clip(h.overflowX) || clip(h.overflowY)) && (clip(b.overflowX) || clip(b.overflowY))) {
    out.push(`html AND body both set overflow (${h.overflowX}/${h.overflowY} and ${b.overflowX}/${b.overflowY}): two competing scrollers`)
  }
  return out
}

function verdicts(rows: Row[]): string[] {
  const vh = window.innerHeight
  const out: string[] = []

  if (rows.length === 0) {
    out.push('C  No ScrollTriggers exist. The scenes never built (or were killed). Look for an early `return` in the scene effect, e.g. the rig not being ready yet.')
  }

  const ids = new Map<string, number>()
  for (const r of rows) ids.set(r.id, (ids.get(r.id) ?? 0) + 1)
  for (const [id, n] of ids) if (n > 1) out.push(`D  "${id}" exists ${n} times. A scene was built twice without reverting (StrictMode remount, or the Static⇄Stage swap). Duplicate pins double the spacer and fight each other.`)

  for (const r of rows) {
    if (r.range < vh * 0.5) {
      out.push(`A  "${r.id}" has a scroll range of only ${r.range}px (${r.rangeVh} viewport heights). A scrubbed timeline over a near-zero range jumps to its end on the first pixel. Check this scene's \`end\` (a custom function returning 0? a stale value?) and use pinnedScene().`)
    }
    if (r.pinH >= 0 && r.spacerH === null) {
      out.push(`B  "${r.id}" is pinned but its element has no .pin-spacer parent, so nothing reserves the scroll distance and later content slides over it. Was it reverted after creation (ctx.revert) without being rebuilt?`)
    } else if (r.spacerH !== null && r.spacerH < r.pinH + r.range - 2) {
      out.push(`B  "${r.id}" spacer is ${r.spacerH}px but should be ~${r.pinH + r.range}px (pinned height + range). pinSpacing is off, or the parent is a flex/grid container collapsing the spacer. Wrap the section in a plain block div.`)
    }
  }

  const anc = ancestorIssues()
  if (anc.length) {
    out.push(`H  A pinned element has an ancestor that breaks position:fixed (GSAP's pinning) or creates a second scroller:\n     ${anc.join('\n     ')}\n     A transformed/filtered ancestor makes the pin behave like position:absolute inside it: the "pinned" scene scrolls away and the next scene overlaps it. Remove it, or move the pinned section out of it (or pass pinType: 'transform').`)
  }

  const byStart = [...rows].sort((a, b) => a.start - b.start)
  for (let i = 1; i < byStart.length; i++) {
    const prev = byStart[i - 1]
    const next = byStart[i]
    if (next.start < prev.end - 2) {
      out.push(`E  "${next.id}" starts at ${next.start}px, before "${prev.id}" ends at ${prev.end}px. Scenes overlap: the later one measured before the earlier one's pin-spacer existed. Use pinnedScene({ order }) so earlier scenes refresh first, and create them in DOM order.`)
    }
  }
  return out
}

let refreshTimes: number[] = []
let lastResize = 0
let debounce = 0

function report(reason: string) {
  const rows = collect()
  const doc = document.documentElement
  console.groupCollapsed(`${TAG} ${reason}  (${rows.length} triggers, viewport ${window.innerWidth}×${window.innerHeight}, document height ${doc.scrollHeight}px)`)
  console.table(rows)
  const vs = verdicts(rows)
  if (vs.length === 0) console.log('%cno structural problems found (cases A–E). If the page is still wrong, run __scrollDiag.trace(true) and look at case G.', 'color: #2b59ff')
  for (const v of vs) console.warn(v)
  console.groupEnd()
}

function sweep() {
  const run = async () => {
    for (const st of ScrollTrigger.getAll()) {
      console.log(`${TAG} sweeping "${st.vars.id ?? '(no id)'}"  start=${Math.round(st.start)} end=${Math.round(st.end)}`)
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        window.scrollTo(0, st.start + (st.end - st.start) * f)
        await new Promise((r) => setTimeout(r, 1200)) // scrub smoothing needs a moment to catch up
        const anim = st.animation ? +(st.animation as gsap.core.Timeline).progress().toFixed(3) : null
        console.log(`${TAG}   scrolled to ${Math.round(f * 100)}%  →  trigger.progress=${st.progress.toFixed(3)}  timeline.progress=${anim}  (want both ≈ ${f})`)
      }
    }
    window.scrollTo(0, 0)
  }
  void run()
}

let tracing = false
/** Call from inside a scene timeline's onUpdate. Logs, at most every 250 ms per scene, who is writing the character. */
export function traceUpdate(sceneId: string, progress: number) {
  if (!tracing) return
  const now = performance.now()
  const w = window as unknown as Record<string, number>
  const key = `__trace_${sceneId}`
  if (now - (w[key] ?? 0) < 250) return
  w[key] = now
  const st = ScrollTrigger.getById(sceneId)
  console.log(`${TAG} update from "${sceneId}"  timeline=${progress.toFixed(3)}  scrollTriggerActive=${st ? st.isActive : 'no trigger'}`)
}

export function installScrollDiagnostics() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (params.has('markers')) ScrollTrigger.defaults({ markers: true })

  window.addEventListener('resize', () => (lastResize = Date.now()))
  ScrollTrigger.addEventListener('refresh', () => {
    const now = Date.now()
    refreshTimes = [...refreshTimes.filter((t) => now - t < 3000), now]
    if (refreshTimes.length > 5 && now - lastResize > 1500) {
      console.warn(`F  ScrollTrigger refreshed ${refreshTimes.length}× in 3 s with no window resize. Something calls refresh() in a loop (a ResizeObserver on the pinned element is the usual cause). Remove refresh() calls from components.`)
    }
    window.clearTimeout(debounce)
    debounce = window.setTimeout(() => report(`refresh #${refreshTimes.length}`), 300)
  })

  ;(window as unknown as Record<string, unknown>).__scrollDiag = {
    snapshot: () => report('manual snapshot'),
    sweep,
    trace: (on = true) => {
      tracing = on
      console.log(`${TAG} trace ${on ? 'on' : 'off'}`)
    },
  }
  window.addEventListener('load', () => report('window load'))
  console.log(`${TAG} installed. Try __scrollDiag.snapshot(), __scrollDiag.sweep(), __scrollDiag.trace(true)`)
}
