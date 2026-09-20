import { focus, profile, site } from '../../data/content'

/**
 * Presentational content blocks. They know nothing about layout or motion, so the
 * animated stage and the static fallback render exactly the same words.
 */

const PinIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
    <path d="M8 14.25s4.5-4.05 4.5-7.6a4.5 4.5 0 1 0-9 0c0 3.55 4.5 7.6 4.5 7.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="8" cy="6.6" r="1.6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export function IdentityBlock({ nameClass = 'text-display' }: { nameClass?: string }) {
  return (
    <div>
      <p className="text-[22px] text-ink-soft">Hi, I’m</p>
      <h1 className={`${nameClass} font-semibold tracking-[-0.035em] text-ink`}>{profile.name}</h1>
      <p className="mt-4 text-[26px] font-medium leading-tight text-ink">{profile.role}</p>
      <p className="mt-2 flex items-center gap-2 text-[18px] text-ink-mute">
        <PinIcon />
        {profile.location}
      </p>
    </div>
  )
}

export function IntroBlock({ className = '' }: { className?: string }) {
  return <p className={`text-[21px] leading-[1.6] text-ink-soft ${className}`}>{profile.intro}</p>
}

export function FocusItem({ id }: { id: string }) {
  const f = focus.find((x) => x.id === id)!
  return (
    <div className="border-t border-line pt-3">
      <p className="text-[18px] font-semibold text-ink">{f.title}</p>
      <p className="mt-0.5 text-[16px] text-ink-mute">{f.detail}</p>
    </div>
  )
}

export function AboutHeading({ className = '' }: { className?: string }) {
  return <h2 className={`font-semibold tracking-[-0.03em] text-ink ${className}`}>{site.aboutHeading}</h2>
}
