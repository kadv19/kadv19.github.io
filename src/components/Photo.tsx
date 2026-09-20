import { profile } from '../data/content'

/** Profile picture. Renders a neutral frame until `profile.photo` is set. */
export function Photo({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  if (profile.photo) {
    return <img src={profile.photo} alt={profile.photoAlt} style={style} className={`rounded-[28px] object-cover ${className}`} />
  }
  return (
    <div
      role="img"
      aria-label={`${profile.photoAlt} (placeholder)`}
      style={style}
      className={`flex flex-col items-center justify-center gap-2 rounded-[28px] bg-blue-tint ${className}`}
    >
      <span className="text-[112px] font-semibold leading-none tracking-tight text-blue-soft">A</span>
      <span className="text-[15px] text-ink-mute">Your photo goes here</span>
    </div>
  )
}
