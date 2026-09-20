import { StickmanFigure } from '../../character/Stickman'
import { focus } from '../../data/content'
import { Photo } from '../../components/Photo'
import { SpeechBubble } from '../../components/SpeechBubble'
import { AboutHeading, FocusItem, IdentityBlock, IntroBlock } from './blocks'

/**
 * Mobile / reduced-motion version of the same story: same words, same character,
 * normal document flow. He still points at the photo — he just doesn't move.
 */
export function IntroStatic() {
  return (
    <section id="top" aria-label="Introduction" className="mx-auto max-w-2xl px-6 pb-20 pt-28">
      <IdentityBlock nameClass="text-display" />

      <div className="mt-12 flex items-end gap-1">
        <div className="relative">
          <SpeechBubble tail="right" className="absolute -top-12 left-0 whitespace-nowrap">
            This is me!
          </SpeechBubble>
          <StickmanFigure pose="point" unit={0.95} />
        </div>
        <Photo className="-ml-6 mb-[6px] h-52 w-40 shrink-0" />
      </div>

      <IntroBlock className="mt-12" />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {focus.map((f) => (
          <FocusItem key={f.id} id={f.id} />
        ))}
      </div>

      <AboutHeading className="mt-24 text-4xl leading-[1.05]" />
    </section>
  )
}
