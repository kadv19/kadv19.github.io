import { projects, profile } from '../../data/content'
import { ProjectCard } from '../../components/ProjectCard'

/** The caught block, resting where Spidey left it. Exits when he jumps. */
export function RestedBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-line bg-surface rounded-[22px] px-6 py-5 ${className}`}>
      <p className="text-[21px] leading-[1.6] text-ink-soft">{profile.intro}</p>
    </div>
  )
}

/** The Projects header that arrives as he lands. */
export function ProjectsTitle({ className = '' }: { className?: string }) {
  return (
    <h2 className={`font-semibold tracking-[-0.03em] text-ink ${className}`}>
      Things I have built
    </h2>
  )
}

/**
 * The first project, riding inside the rising frame. Same card, same padding
 * as the workbench opens with, so the handoff reads as one continuous window.
 */
export function FrameCard() {
  return <ProjectCard project={projects[0]} />
}
