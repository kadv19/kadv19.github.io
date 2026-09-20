import { StickmanLayer } from '../character/Stickman'
import { FIGURE_GROUND } from '../character/Stickman'
import { ButtonLink } from '../components/Button'
import { Section } from '../components/Section'
import { profile, site } from '../data/content'

const K = 0.75 // px per figure unit — small and quiet for the calm ending
const BUTTON_H = 59 // so the button's top edge meets his forearm

/**
 * Static preview of the ending: everything calm, he leans on the button.
 * (In the real scene this same pose is entered from the previous one.)
 */
export function ContactPreview() {
  return (
    <Section id="contact" title="Let’s talk" className="pb-40">
      <p className="mb-10 max-w-[44ch] text-xl leading-relaxed text-ink-soft">
        If you are hiring, or have something worth building, I would like to hear about it.
      </p>
      <div className="relative inline-block">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox={`-36 -100 90 ${FIGURE_GROUND + 106}`}
          width={90 * K}
          height={(FIGURE_GROUND + 106) * K}
          className="pointer-events-none absolute bottom-0 z-10"
          style={{ left: -56 * K, overflow: 'visible' }}
        >
          <StickmanLayer pose="lean" overrides={{ scale: 1, x: 0, ground: FIGURE_GROUND + 6, plant: 1 }} />
        </svg>
        <ButtonLink href={`mailto:${profile.email}`} style={{ height: BUTTON_H }}>
          {site.contactLabel}
        </ButtonLink>
      </div>
    </Section>
  )
}
