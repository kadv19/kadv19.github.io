import { useLayoutEffect, useRef } from 'react'
import { focus } from '../../data/content'
import { gsap, ScrollTrigger } from '../../motion/gsap'
import { STAGE, useStageScale } from '../../motion/useStageScale'
import { pinnedScene } from '../../motion/pinnedScene'
import { measureStage } from '../../motion/stageToWindow'
import { useRig } from '../../motion/CharacterOverlay'
import { AboutHeading, FocusItem, IdentityBlock, IntroBlock } from './blocks'
import { Photo } from '../../components/Photo'
import { SpeechBubble } from '../../components/SpeechBubble'
import { A, B, INTRO_SCREENS } from './frames'
import { buildIntroTimeline } from './timeline'

/** The full desktop experience: a pinned 1280×720 stage, scrubbed by scroll. */
export function IntroStage() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const rigRef = useRig()

  useStageScale(root, stage)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    let cancelled = false
    let api: ReturnType<typeof buildIntroTimeline> | null = null
    let ctx: gsap.Context | null = null

    const pushStage = () => {
      if (api) api.setStage(measureStage(el))
    }

    // The overlay rig is created in its own layout effect. Under StrictMode the
    // ref can be null for one tick; retry on the next animation frame.
    const tryBuild = () => {
      if (cancelled) return
      const rig = rigRef.current
      if (!rig) {
        requestAnimationFrame(tryBuild)
        return
      }
      ctx = gsap.context(() => {
        api = buildIntroTimeline({
          root: el,
          rig,
          scrollTrigger: pinnedScene({ id: 'intro', trigger: el, screens: INTRO_SCREENS, order: 0 }),
        })
        // Defer the first measurement until the browser has laid out the section.
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

  const abs = (x: number, y: number, w?: number) => ({ left: x, top: y, width: w })

  return (
    <section ref={root} id="top" aria-label="Introduction" className="relative h-dvh overflow-hidden bg-paper">
      <div
        ref={stage}
        className="absolute left-1/2 top-1/2"
        style={{ width: STAGE.w, height: STAGE.h, transformOrigin: 'center' }}
      >
        <div data-block="identity" className="absolute" style={abs(A.identity.x, A.identity.y, A.identity.w)}>
          <IdentityBlock nameClass="text-[96px] leading-[0.98]" />
        </div>

        <div data-block="intro" className="absolute" style={abs(A.intro.x, A.intro.y, A.intro.w)}>
          <IntroBlock />
        </div>

        {focus.slice(0, 3).map((f, i) => (
          <div key={f.id} data-block={`fact-${i}`} className="absolute" style={abs(A.facts[i].x, A.facts[i].y, A.factW)}>
            <FocusItem id={f.id} />
          </div>
        ))}

        <div data-block="photo" className="absolute" style={{ ...abs(A.photo.x, A.photo.y, A.photo.w), height: A.photo.h }}>
          <Photo className="h-full w-full" />
        </div>

        <div data-block="about" className="absolute" style={abs(B.about.x, B.about.y, B.about.w)}>
          <AboutHeading className="text-[46px] leading-[1.05]" />
        </div>

        <div data-block="bubble" className="absolute" style={abs(A.bubble.x, A.bubble.y)}>
          <SpeechBubble tail="right">This is me!</SpeechBubble>
        </div>

        <p data-block="cue" aria-hidden="true" className="absolute -translate-x-1/2 text-[16px] text-ink-mute" style={abs(A.cue.x, A.cue.y)}>
          Scroll to continue
        </p>
      </div>
    </section>
  )
}
