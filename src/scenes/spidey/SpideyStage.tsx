import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../motion/gsap'
import { STAGE, useStageScale } from '../../motion/useStageScale'
import { pinnedScene } from '../../motion/pinnedScene'
import { overlapPreviousPin } from '../../motion/pinOverlap'
import { measureStage } from '../../motion/stageToWindow'
import { useRig } from '../../motion/CharacterOverlay'
import { FallingAbout, FallingBlock, FallingFact, WebLine } from './blocks'
import { ABOUT_START, BLOCK_START, FACTS_START, FACT_W, SPIDEY_SCREENS } from './frames'
import { buildSpideyTimeline } from './timeline'

/**
 * The outer div pulls this scene up by one viewport (motion/pinOverlap.ts) so its pin starts
 * exactly where the intro's ends — otherwise there is a full viewport of dead scroll between the
 * intro's outro (everything already fallen out of view) and this scene's opening (nothing has
 * fallen in yet), which is what read as "scroll several times, nothing visible, then it appears".
 * The section hides itself until its own pin starts (and again once its pin ends — see
 * motion/pinnedScene.ts), so the overlap never paints over the scene before or after it.
 */
export function SpideyStage() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const webRef = useRef<SVGPathElement>(null)
  const rigRef = useRig()

  useStageScale(root, stage)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    let cancelled = false
    let api: ReturnType<typeof buildSpideyTimeline> | null = null
    let ctx: gsap.Context | null = null

    const pushStage = () => {
      if (api) api.setStage(measureStage(el))
    }

    const tryBuild = () => {
      if (cancelled) return
      const rig = rigRef.current
      const block = blockRef.current
      const web = webRef.current
      if (!rig || !block || !web) {
        requestAnimationFrame(tryBuild)
        return
      }
      ctx = gsap.context(() => {
        api = buildSpideyTimeline({
          root: el,
          block,
          web,
          rig,
          scrollTrigger: pinnedScene({ id: 'spidey', trigger: el, screens: SPIDEY_SCREENS, order: 1 }),
        })
        requestAnimationFrame(pushStage)
      }, el)

      const refreshListener = () => requestAnimationFrame(pushStage)
      ScrollTrigger.addEventListener('refresh', refreshListener)
      const onResize = () => requestAnimationFrame(pushStage)
      window.addEventListener('resize', onResize)

      if (api) {
        ;(api as { _cleanup?: () => void })._cleanup = () => {
          ScrollTrigger.removeEventListener('refresh', refreshListener)
          window.removeEventListener('resize', onResize)
        }
      }
    }
    tryBuild()

    return () => {
      cancelled = true
      if (api) (api as { _cleanup?: () => void })._cleanup?.()
      ctx?.revert()
    }
  }, [rigRef])

  return (
    <div style={overlapPreviousPin()}>
      <section
        ref={root}
        aria-label="Catching a falling block"
        className="relative h-dvh overflow-hidden bg-paper"
      >
        <div
          ref={stage}
          className="absolute left-1/2 top-1/2"
          style={{ width: STAGE.w, height: STAGE.h, transformOrigin: 'center' }}
        >
          <div data-block="about" className="absolute" style={{ left: ABOUT_START.x, top: ABOUT_START.y, width: ABOUT_START.w }}>
            <FallingAbout className="text-[46px] leading-[1.05]" />
          </div>

          {FACTS_START.map((pos, i) => (
            <div key={i} data-block={`fact-${i}`} className="absolute" style={{ left: pos.x, top: pos.y, width: FACT_W }}>
              <FallingFact id={['interfaces', 'systems', 'hardware'][i]} />
            </div>
          ))}

          <div ref={blockRef} data-block="block" className="absolute border border-line bg-surface rounded-[22px] px-6 py-5" style={{ left: BLOCK_START.x, top: BLOCK_START.y, width: BLOCK_START.w }}>
            <FallingBlock />
          </div>
          <WebLine pathRef={webRef} />
        </div>
      </section>
    </div>
  )
}
