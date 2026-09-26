import { ProjectCard } from '../components/ProjectCard'
import { ProjectDetails } from '../components/ProjectDetails'
import { Section } from '../components/Section'
import { projects, site } from '../data/content'
import { useFullExperience } from '../motion/useMediaQuery'

/**
 * The projects list for viewports without the pinned workbench (mobile /
 * reduced-motion). On desktop the workbench stages these same projects, so
 * this returns null there to avoid showing everything twice. The full
 * briefs ride along here so mobile gets them too (desktop gets its copy
 * from WorkbenchScene, never both).
 */
export function ProjectsPreview() {
  const full = useFullExperience()
  if (full) return null
  return (
    <>
      <Section id="projects" title="Things I have built">
        <div className="flex flex-col gap-24">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <p className="mt-20 text-lg text-ink-soft">
          <a
            className="text-blue underline decoration-blue-soft underline-offset-4 hover:decoration-blue"
            href={site.moreProjects.href}
            target="_blank"
            rel="noreferrer"
          >
            {site.moreProjects.label}
          </a>
        </p>
      </Section>
      <ProjectDetails />
    </>
  )
}
