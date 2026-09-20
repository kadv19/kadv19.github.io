import { useRef, useState } from 'react'
import { StickmanFigure, FIGURE_GROUND } from '../character/Stickman'
import { POSES, type PoseName } from '../character/poses'
import type { StickRig } from '../character/rig'
import { ButtonLink } from '../components/Button'
import { SpeechBubble } from '../components/SpeechBubble'
import { gsap } from '../motion/gsap'

const colors = [
  { name: 'paper', hex: '#f8fafd', use: 'Page background' },
  { name: 'surface', hex: '#ffffff', use: 'Raised frames' },
  { name: 'ink', hex: '#13203a', use: 'Headings, key text' },
  { name: 'ink-soft', hex: '#4a5875', use: 'Body copy' },
  { name: 'ink-mute', hex: '#5e6a86', use: 'Meta, captions' },
  { name: 'line', hex: '#e3e8f2', use: 'Hairlines' },
  { name: 'blue', hex: '#2b59ff', use: 'Character, primary action' },
  { name: 'blue-soft', hex: '#a9bcff', use: 'Character outline' },
  { name: 'blue-tint', hex: '#edf1ff', use: 'Quiet fills' },
]

const poseNotes: Record<PoseName, string> = {
  idle: 'Neutral. Where he starts and ends.',
  point: 'Introduces the photo.',
  pull: 'Leans into dragging a block (arm is IK-driven).',
  hulk: 'Bigger, wider, heavier. Still blue.',
  hulkCrouch: 'Wind-up before the jump.',
  hulkAir: 'Mid-jump while the layout rearranges.',
  hulkLand: 'Impact, fist down.',
  coder: 'Glasses, laptop, seated. Projects scene.',
  lean: 'Calm ending. Elbow on the button.',
}

const names = Object.keys(POSES) as PoseName[]

function LiveFigure() {
  const rigRef = useRef<StickRig | null>(null)
  const [current, setCurrent] = useState<PoseName>('idle')

  const go = (name: PoseName) => {
    const rig = rigRef.current
    if (!rig) return
    setCurrent(name)
    const { x: _x, y: _y, ground: _g, plant: _p, lift: _l, ...target } = POSES[name]
    void _x, _y, _g, _p, _l
    gsap.to(rig.pose, { ...target, duration: 0.9, ease: 'power2.inOut', overwrite: true, onUpdate: () => rig.render() })
  }

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,320px)_1fr] md:items-center">
      <div className="flex h-[300px] items-end justify-center rounded-[22px] border border-line bg-surface">
        <StickmanFigure pose="idle" unit={1.5} rigRef={rigRef} className="-mb-[9px]" />
      </div>
      <div>
        <p className="mb-4 text-lg text-ink-soft">
          Pick a pose. The figure interpolates between them exactly as a scroll timeline would.
        </p>
        <div className="flex flex-wrap gap-2">
          {names.map((n) => (
            <button
              key={n}
              onClick={() => go(n)}
              aria-pressed={current === n}
              className={`rounded-full border px-4 py-2 text-[16px] transition-colors ${
                current === n ? 'border-blue bg-blue text-white' : 'border-line bg-surface text-ink-soft hover:border-blue-soft'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="mt-4 text-[16px] text-ink-mute">{poseNotes[current]}</p>
      </div>
    </div>
  )
}

export function Lab() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
      <a href="#" className="text-[16px] text-blue underline decoration-blue-soft underline-offset-4">
        Back to the site
      </a>
      <h1 className="mt-6 text-5xl font-semibold tracking-[-0.03em]">Design system and character lab</h1>
      <p className="mt-4 max-w-[60ch] text-xl leading-relaxed text-ink-soft">
        Everything here is what the real site is built from. If a choice looks wrong here, it will look wrong everywhere.
      </p>

      <h2 className="mb-6 mt-20 text-3xl font-semibold tracking-[-0.02em]">Character</h2>
      <LiveFigure />

      <h3 className="mb-6 mt-16 text-xl font-semibold">All poses</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {names.map((n) => (
          <figure key={n} className="rounded-[18px] border border-line bg-surface px-2 pt-4">
            <StickmanFigure
              pose={n}
              unit={0.9}
              overrides={{ scale: 1, ground: FIGURE_GROUND, plant: 1 }}
              className="mx-auto -mb-[6px] max-w-full"
            />
            <figcaption className="border-t border-line px-2 py-3 text-center text-[15px] text-ink-soft">{n}</figcaption>
          </figure>
        ))}
      </div>

      <h2 className="mb-6 mt-24 text-3xl font-semibold tracking-[-0.02em]">Colour</h2>
      <p className="mb-6 max-w-[60ch] text-lg text-ink-soft">One accent. It is the character’s colour, so the character is the only thing that is ever “coloured”.</p>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {colors.map((c) => (
          <li key={c.name} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3">
            <span className="h-14 w-14 shrink-0 rounded-xl border border-line" style={{ background: c.hex }} />
            <span>
              <span className="block text-[17px] font-semibold text-ink">{c.name}</span>
              <span className="block text-[15px] text-ink-mute">
                {c.hex}, {c.use}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mb-6 mt-24 text-3xl font-semibold tracking-[-0.02em]">Type</h2>
      <p className="mb-8 max-w-[60ch] text-lg text-ink-soft">Instrument Sans throughout. Hierarchy comes from size, weight and space, not from a second typeface or styling tricks.</p>
      <div className="space-y-8 rounded-[22px] border border-line bg-surface p-8 md:p-12">
        <p className="text-display font-semibold tracking-[-0.035em]">Advaith</p>
        <p className="text-5xl font-semibold leading-[1.05] tracking-[-0.025em]">Section heading, 48 semibold</p>
        <p className="text-3xl font-semibold tracking-[-0.02em]">Project title, 30 semibold</p>
        <p className="max-w-[60ch] text-xl leading-relaxed text-ink-soft">Body copy, 20 regular with 1.6 line height. Lines stay under about 65 characters so a recruiter can skim without effort.</p>
        <p className="text-[16px] text-ink-mute">Caption and meta, 16 regular in ink-mute.</p>
      </div>

      <h2 className="mb-6 mt-24 text-3xl font-semibold tracking-[-0.02em]">Components</h2>
      <div className="flex flex-wrap items-center gap-10 rounded-[22px] border border-line bg-surface p-8 md:p-12">
        <ButtonLink href="#lab" className="h-14">
          Get in touch
        </ButtonLink>
        <SpeechBubble tail="left">This is me!</SpeechBubble>
        <span className="rounded-full border border-line bg-surface px-3 py-1 text-[15px] text-ink-soft">React</span>
      </div>
    </div>
  )
}
