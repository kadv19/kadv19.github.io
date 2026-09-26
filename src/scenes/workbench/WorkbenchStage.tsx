import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../motion/gsap'
import { STAGE, useStageScale } from '../../motion/useStageScale'
import { pinnedScene } from '../../motion/pinnedScene'
import { overlapPreviousPin } from '../../motion/pinOverlap'
import { measureStage } from '../../motion/stageToWindow'
import { useRig } from '../../motion/CharacterOverlay'
import { ProjectCard } from '../../components/ProjectCard'
import { projects, site } from '../../data/content'
import { FRAME_CLASS, FRAME_CONTENT_CLASS } from '../projectFrame'
import { BENCH, MORE } from './frames'
import { buildWorkbenchTimeline } from './timeline'

/**
 * The workbench: he sits on the top edge of a large project frame while its
 * content cross-slides beneath him, one project per scroll beat. The character
 * lives in the fixed overlay; this scene drives his pose through the shared rig.
 *
 * The outer div pulls this scene up by one viewport (motion/pinOverlap.ts) so its pin starts exactly
 * where the Hulk scene's ends; the section hides itself until then (see the timeline).
 * Keep id="projects" on the <section> only (never on the wrapper): it must stay unique per render path.
 */
export function WorkbenchStage() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const rigRef = useRig()

  useStageScale(root, stage)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    let cancelled = false
    let api: ReturnType<typeof buildWorkbenchTimeline> | null = null
    let ctx: gsap.Context | null = null

    const pushStage = () => {
      if (api) api.setStage(measureStage(el))
    }

    const tryBuild = () => {
      if (cancelled) return
      const rig = rigRef.current
      if (!rig) {
        requestAnimationFrame(tryBuild)
        return
      }
      ctx = gsap.context(() => {
        api = buildWorkbenchTimeline({
          root: el,
          rig,
          scrollTrigger: pinnedScene({ id: 'work', trigger: el, screens: 2.2, order: 3 }),
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
        id="projects"
        aria-label="Selected work"
        className="relative h-dvh overflow-hidden bg-paper"
      >
        <div
          ref={stage}
          className="absolute left-1/2 top-1/2"
          style={{ width: STAGE.w, height: STAGE.h, transformOrigin: 'center' }}
        >
          <div
            data-block="more"
            className="absolute text-center text-lg text-ink-soft"
            style={{ left: MORE.x, top: MORE.y, width: MORE.w, opacity: 0 }}
          >
            <a
              className="text-blue underline decoration-blue-soft underline-offset-4 hover:decoration-blue"
              href={site.moreProjects.href}
              target="_blank"
              rel="noreferrer"
            >
              {site.moreProjects.label}
            </a>
          </div>
          <div
            className={FRAME_CLASS}
            style={{ left: BENCH.x, top: BENCH.y, width: BENCH.w, height: BENCH.h }}
          >
            {projects.map((p) => (
              <div key={p.slug} data-block={`project-${p.slug}`} className={FRAME_CONTENT_CLASS}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
