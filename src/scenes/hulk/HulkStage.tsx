import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../motion/gsap'
import { STAGE, useStageScale } from '../../motion/useStageScale'
import { pinnedScene } from '../../motion/pinnedScene'
import { measureStage } from '../../motion/stageToWindow'
import { useRig } from '../../motion/CharacterOverlay'
import { FrameCard, ProjectsTitle, RestedBlock } from './blocks'
import { BLOCK_REST, FRAME_REST, PROJECTS_TITLE } from './frames'
import { buildHulkTimeline } from './timeline'

/**
 * The Hulk jump as a pinned 1280×720 stage. The character lives in the fixed
 * CharacterOverlay; this scene drives his pose through the shared rig.
 */
export function HulkStage() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const rigRef = useRig()

  useStageScale(root, stage)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    let cancelled = false
    let api: ReturnType<typeof buildHulkTimeline> | null = null
    let ctx: gsap.Context | null = null

    const pushStage = () => {
      if (api) api.setStage(measureStage(el))
    }

    const tryBuild = () => {
      if (cancelled) return
      const rig = rigRef.current
      const block = blockRef.current
      const title = titleRef.current
      const frame = frameRef.current
      if (!rig || !block || !title || !frame) {
        requestAnimationFrame(tryBuild)
        return
      }
      ctx = gsap.context(() => {
        api = buildHulkTimeline({
          root: el,
          block,
          title,
          frame,
          rig,
          scrollTrigger: pinnedScene({ id: 'hulk', trigger: el, screens: 2.6, order: 2 }),
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
    <section
      ref={root}
      aria-label="Becoming stronger"
      className="relative h-dvh overflow-hidden bg-paper"
    >
      <div
        ref={stage}
        className="absolute left-1/2 top-1/2"
        style={{ width: STAGE.w, height: STAGE.h, transformOrigin: 'center' }}
      >
        <div ref={blockRef} data-block="block" className="absolute" style={{ left: BLOCK_REST.x, top: BLOCK_REST.y, width: BLOCK_REST.w }}>
          <RestedBlock />
        </div>
        <div ref={titleRef} data-block="title" className="absolute" style={{ left: PROJECTS_TITLE.x, top: PROJECTS_TITLE.y, width: PROJECTS_TITLE.w }}>
          <ProjectsTitle className="text-[48px] leading-[1.05]" />
        </div>
        <div ref={frameRef} data-block="frame" className="absolute border border-line bg-surface rounded-[22px] overflow-hidden" style={{ left: FRAME_REST.x, top: FRAME_REST.y, width: FRAME_REST.w, height: FRAME_REST.h }}>
          <div className="absolute inset-0 overflow-y-hidden p-8">
            <FrameCard />
          </div>
        </div>
      </div>
    </section>
  )
}
