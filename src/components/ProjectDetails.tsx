import { projects, type Project } from '../data/content'
import { Section } from './Section'

/**
 * The full project briefs in normal document flow — unlimited room, real HTML.
 * Rendered once on desktop (WorkbenchScene, after the pinned stage) and once
 * on mobile / reduced-motion (inside ProjectsPreview, which only renders when
 * the workbench doesn't), so there is never a duplicate. The pinned workbench
 * frame keeps only the teaser card; nothing here touches the stage, the
 * timeline, or the coder.
 */
export function ProjectDetails() {
  return (
    <Section title="How each project works">
      <div className="flex flex-col gap-16 md:gap-20">
        {projects.map((p) => (
          <DetailsArticle key={p.slug} project={p} />
        ))}
      </div>
    </Section>
  )
}

function DetailsArticle({ project: p }: { project: Project }) {
  return (
    <article className="border-t border-line pt-8">
      <p className="text-[15px] text-ink-mute">
        {p.role}, {p.year}
      </p>
      <h3 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-ink">{p.title}</h3>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
        <div>
          <Subhead>Overview</Subhead>
          <p className="mt-2 text-lg leading-relaxed text-ink-soft">{p.details.overview}</p>
        </div>
        <div>
          <Subhead>Problem</Subhead>
          <p className="mt-2 text-lg leading-relaxed text-ink-soft">{p.details.problem}</p>
        </div>
      </div>

      <div className="mt-8">
        <Subhead>Architecture</Subhead>
        <p className="mt-2 max-w-[72ch] text-lg leading-relaxed text-ink-soft">{p.details.architecture}</p>
      </div>

      <div className="mt-8">
        <Subhead>Technical deep dive</Subhead>
        <ul className="mt-2 max-w-[72ch] list-disc space-y-2 pl-6 text-lg leading-relaxed text-ink-soft">
          {p.details.points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-14">
        <div>
          <Subhead>My role</Subhead>
          <p className="mt-2 text-lg leading-relaxed text-ink-soft">{p.details.roleDetail}</p>
        </div>
        <div>
          <Subhead>Results</Subhead>
          <p className="mt-2 text-lg leading-relaxed text-ink-soft">{p.details.results}</p>
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Built with for ${p.title}`}>
        {p.stack.map((s) => (
          <li key={s} className="rounded-full border border-line bg-surface px-3 py-1 text-[15px] text-ink-soft">
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-6 text-[17px] font-medium">
        {p.links.live && (
          <a className="text-blue underline decoration-blue-soft underline-offset-4 hover:decoration-blue" href={p.links.live}>
            Live site
          </a>
        )}
        {p.links.repo && (
          <a className="text-blue underline decoration-blue-soft underline-offset-4 hover:decoration-blue" href={p.links.repo}>
            Source
          </a>
        )}
      </div>
    </article>
  )
}

function Subhead({ children }: { children: string }) {
  return <h4 className="text-[18px] font-semibold text-ink">{children}</h4>
}
