import type { Project } from '../data/content'

/**
 * Project presentation. Real HTML: readable, linkable, indexable — even when a
 * scene later stages the character around it. No shadows; the frame does the work.
 */
export function ProjectCard({ project }: { project: Project }) {
  const fit = project.mediaFit === 'contain' ? 'object-contain' : 'object-cover'
  return (
    <article className="grid items-center gap-8 md:grid-cols-[1.45fr_1fr] md:gap-14">
      <div className="aspect-[16/10] overflow-hidden rounded-[22px] border border-line bg-blue-tint">
        {project.media ? (
          project.media.endsWith('.mp4') ? (
            <video
              src={project.media}
              className={`h-full w-full ${fit}`}
              controls
              preload="metadata"
              playsInline
              aria-label={`${project.title} demo video`}
            />
          ) : (
            <img src={project.media} alt={`${project.title} screenshot`} className={`h-full w-full ${fit}`} />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-[15px] text-ink-mute">Project screenshot or video</div>
        )}
      </div>
      <div>
        <p className="text-[15px] text-ink-mute">
          {project.role}, {project.year}
        </p>
        <h3 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-ink">{project.title}</h3>
        <p className="mt-2 max-w-[38ch] text-lg leading-relaxed text-ink-soft">{project.summary}</p>
        <ul className="mt-3 max-w-[44ch] list-disc space-y-1 pl-5 text-[15px] leading-snug text-ink-soft" aria-label="Technical highlights">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
          {project.stack.map((s) => (
            <li key={s} className="rounded-full border border-line bg-surface px-3 py-1 text-[15px] text-ink-soft">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-6 text-[17px] font-medium">
          {project.links.live && (
            <a className="text-blue underline decoration-blue-soft underline-offset-4 hover:decoration-blue" href={project.links.live}>
              Live site
            </a>
          )}
          {project.links.repo && (
            <a className="text-blue underline decoration-blue-soft underline-offset-4 hover:decoration-blue" href={project.links.repo}>
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
