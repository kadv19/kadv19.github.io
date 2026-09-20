import { StickmanFigure } from '../../character/Stickman'

/**
 * Mobile / reduced-motion version of the Hulk beat: same heading, same
 * character, normal document flow. He simply stands big beside it.
 */
export function HulkStatic() {
  return (
    <section aria-label="Becoming stronger" className="mx-auto max-w-2xl px-6 pb-20 pt-8">
      <div className="flex items-end gap-4">
        <StickmanFigure pose="hulk" unit={1.1} className="shrink-0" />
        <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
          Things I have built
        </h2>
      </div>
    </section>
  )
}
