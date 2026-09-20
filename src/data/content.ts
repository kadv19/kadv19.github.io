/**
 * All portfolio content lives here. Scenes and components read from this file
 * and never hard-code copy, so changing your story never means touching animation code.
 *
 * TODO(Advaith): everything marked PLACEHOLDER is a stand-in — replace it with the real thing.
 */

export interface Profile {
  name: string
  role: string
  location: string
  /** The 2–3 sentence personal introduction. */
  intro: string
  /** Path in /public (e.g. "/advaith.jpg"). null renders a neutral placeholder. */
  photo: string | null
  photoAlt: string
  email: string
  github: string
}

export const profile: Profile = {
  name: 'Advaith Kashyap',
  role: 'Software developer',
  location: 'India',
  intro:
    'I build systems that stay honest under pressure — privacy-first on-device AI, agent architectures that refuse to authorize their own payments, and firmware that runs on real hardware. I care about software that is simple to use and quiet to run.',
  photo: null,
  photoAlt: 'Portrait of Advaith Kashyap',
  email: 'advaith.kashyap19@gmail.com',
  github: 'https://github.com/kadv19',
}

/** What you do, in three short lines. Shown as a wide strip that later breaks apart. */
export interface Focus {
  id: string
  title: string
  detail: string
}

export const focus: Focus[] = [
  { id: 'interfaces', title: 'Interfaces', detail: 'React, TypeScript' },
  { id: 'systems', title: 'Systems', detail: 'On-device AI, agents' },
  { id: 'hardware', title: 'Hardware', detail: 'Embedded C++, sensors' },
]

export interface Project {
  slug: string
  title: string
  /** One sentence a recruiter can skim: what it is and why it matters. */
  summary: string
  role: string
  year: string
  stack: string[]
  links: { live?: string; repo?: string }
  /** Screenshot/video in /public. null renders a placeholder frame. */
  media: string | null
}

export const projects: Project[] = [
  {
    slug: 'ai-ghost',
    title: 'AI Ghost',
    summary:
      'A privacy-first Android system for conversationally querying your old phone’s data from your new one — with zero cloud AI involved.',
    role: 'Design and engineering',
    year: '2025',
    stack: ['Android', 'MediaPipe', 'Gemma 3', 'Sentence Transformers', 'AWS S3'],
    links: { repo: 'https://github.com/kadv19/AiGhost' },
    media: null,
  },
  {
    slug: 'transaction-integrity-agent',
    title: 'Transaction Integrity Agent',
    summary:
      'An agentic commerce architecture where AI can propose a transaction but never authorize payment — five deterministic validators gate every attempt.',
    role: 'System design',
    year: '2025',
    stack: ['LangGraph', 'Python', 'Agent orchestration'],
    links: { repo: 'https://github.com/kadv19/RazorPay-Advaith' },
    media: null,
  },
  {
    slug: 'terrainfit',
    title: 'TerrainFit',
    summary:
      'A terrain-aware posture backpack that distinguishes genuine bad posture from normal uphill tilt — first place, college IoT competition.',
    role: 'Firmware and sensing',
    year: '2024',
    stack: ['Embedded C++', 'Arduino', 'MPU6050'],
    links: { repo: 'https://github.com/kadv19' },
    media: '/terrainfit-demo.mp4',
  },
]

export const site = {
  nav: [
    { label: 'Work', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ],
  contactLabel: 'Get in touch',
  /** Second beat of the hero: the section title the layout settles into. */
  aboutHeading: 'Builder first, with an eye for how things feel.',
  /** Shown after the project list, before the footer. */
  moreProjects: { label: 'and many more here', href: 'https://github.com/kadv19' },
}
