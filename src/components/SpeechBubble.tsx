import type { CSSProperties, ReactNode } from 'react'

/**
 * A quiet speech bubble. Decorative — the words are never the only place
 * information lives, so it is hidden from assistive tech.
 * `tail` says which bottom corner points at the speaker.
 */
export function SpeechBubble({
  children,
  tail = 'right',
  className = '',
  style,
  ...rest
}: {
  children: ReactNode
  tail?: 'left' | 'right'
  className?: string
  style?: CSSProperties
} & Record<string, unknown>) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`relative inline-block rounded-2xl border border-line bg-surface px-4 py-2 text-[17px] font-medium text-ink ${className}`}
      {...rest}
    >
      {children}
      <span
        className={`absolute -bottom-[7px] h-3 w-3 rotate-45 border-b border-r border-line bg-surface ${
          tail === 'right' ? 'right-6' : 'left-6'
        }`}
      />
    </div>
  )
}
