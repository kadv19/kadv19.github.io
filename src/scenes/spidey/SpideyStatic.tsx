import { StickmanFigure } from '../../character/Stickman'
import { FallingBlock } from './blocks'

/**
 * Mobile / reduced-motion version of the Spider-Man beat: the same words, the
 * same character, normal document flow. He simply stands beside the block.
 */
export function SpideyStatic() {
  return (
    <section aria-label="Catching a falling block" className="mx-auto max-w-2xl px-6 pb-20 pt-8">
      <div className="flex items-end gap-4">
        <StickmanFigure pose="idle" unit={0.85} className="shrink-0" />
        <FallingBlock />
      </div>
    </section>
  )
}
