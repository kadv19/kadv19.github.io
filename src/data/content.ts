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
    'I’m Advaith — I own the whole stack, from sensor firmware to on-device AI to the interface on top. I lead small teams and ship end-to-end: quiet software that stays honest under pressure.',
  photo: '/advaith.jpg',
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
  /** One to two sentences a recruiter can skim: what it is and why it matters. */
  summary: string
  /**
   * Technical substance, distilled to fit the pinned workbench frame
   * (inner height 401px — see scenes/projectFrame.ts). Keep to 3
   * single-line bullets (≤ ~50 chars each) so all three cards stay the
   * same height and the cross-slide never jumps. Full paragraphs live
   * in projects/*.html, not here.
   */
  highlights: string[]
  role: string
  year: string
  stack: string[]
  links: { live?: string; repo?: string }
  /** Screenshot/video in /public. null renders a placeholder frame. */
  media: string | null
  /**
   * How media fills the 16/10 panel. `cover` (default) fills and crops;
   * `contain` shows the whole image with tint bars. Use `contain` when
   * covering cuts off content that matters.
   */
  mediaFit?: 'cover' | 'contain'
  /**
   * The full brief, shown verbatim in the details section below the
   * workbench (ProjectDetails, normal document flow — unlimited room, so
   * nothing here threatens the pinned frame or the coder). The pinned
   * card above carries only `summary` + `highlights`.
   */
  details: {
    overview: string
    problem: string
    architecture: string
    /** Technical deep-dive bullets, verbatim. */
    points: string[]
    /** “My role” and “Results”, verbatim. */
    roleDetail: string
    results: string
  }
}

export const projects: Project[] = [
  {
    slug: 'ai-ghost',
    title: 'AI Ghost',
    summary:
      'A privacy-first Android system that answers questions about your old phone’s data — zero cloud AI. 169 chunks indexed; offline after setup.',
    highlights: [
      '384-d embeddings, top-5 retrieval under 50ms',
      'Gemma 3 1B INT4 on-device — zero cloud, zero cost',
      'Ghost Key: passphrase baked into the S3 path',
    ],
    role: 'Team lead — architecture & auth',
    year: '2025',
    stack: ['Python', 'FastAPI', 'AWS S3', 'Android', 'Kotlin', 'Gemma 3', 'MediaPipe', 'sentence-transformers'],
    links: { repo: 'https://github.com/kadv19/AiGhost' },
    media: '/ai-ghost.mp4',
    details: {
      overview:
        'A privacy-first Android system that lets you conversationally query your old phone’s data from your new device — with zero cloud AI involved.',
      problem:
        'Every 2-3 years, people migrate to a new phone. Cloud backups move files, but they can’t answer questions about them — there’s no way to ask “when’s my dentist appointment?” without manually digging through old apps and screenshots.',
      architecture:
        'Two-app system — an Extractor app on the old phone processes data and uploads embeddings to AWS S3; a Retrieval app on the new phone downloads that and runs everything on-device. S3 acts as an asynchronous bridge — the two devices never need to be online at the same time.',
      points: [
        'Python backend generates 384-dimensional embeddings via sentence-transformers',
        'On-device cosine similarity search retrieves the top-5 relevant chunks in under 50ms',
        'Gemma 3 (1B parameters, INT4-quantized) runs fully offline via MediaPipe’s LLM Inference API — zero cloud AI dependency, zero per-query cost',
        'Ghost Key authentication: a 4-word passphrase baked directly into the S3 object path itself. No login screen, no password database, no auth server — if you don’t know the exact phrase, you can’t construct the path. The absence of infrastructure is the security model.',
        'Presigned URL delivery (1-hour expiry) lets users request specific files by name',
        'Exponential backoff retry logic handles flaky mobile network conditions',
      ],
      roleDetail: 'Led a 3-person team, owned the architecture end-to-end, including the authentication design.',
      results: '169 memory chunks indexed and retrievable in the working demo. Fully offline after setup.',
    },
  },
  {
    slug: 'transaction-integrity-agent',
    title: 'Transaction Integrity Agent',
    summary:
      'An agentic commerce system where AI proposes but only code authorizes payment. Solo buildathon entry, shipped end-to-end.',
    highlights: [
      'Five validators: price, stock, policy, budget, auth',
      'Unanimous pass required — AI can never override',
      'Bounded-retry Recovery Agent, Razorpay test mode',
    ],
    role: 'Solo — architecture & orchestration',
    year: '2025',
    stack: ['Python', 'LangGraph', 'Razorpay API (test mode)'],
    links: { repo: 'https://github.com/kadv19/Transaction-Integrity-Agent' },
    media: '/transaction.jpg',
    mediaFit: 'contain',
    details: {
      overview:
        'An agentic commerce architecture built on one core principle: an AI agent can propose a transaction, but it must never be the thing that authorizes payment.',
      problem:
        'As AI agents increasingly act on behalf of users in commerce (browsing, negotiating, purchasing), the real risk isn’t the AI being wrong occasionally — it’s the AI having unchecked authority to move money at all.',
      architecture:
        'An AI buyer agent proposes transactions. A separate Integrity Investigator runs five deterministic validators — price, inventory, policy, budget, and authorization checks — against every proposed transaction before anything is allowed through. A Recovery Agent handles bounded retries on failure. AI proposes and narrates; only deterministic code can greenlight payment.',
      points: [
        'Built with LangGraph for multi-agent orchestration',
        'Integrated with Razorpay’s test-mode checkout flow',
        'The five validators run independently and must all pass — no single point of AI judgment can override them',
        'Went through several earlier concept pivots (a merchant curation panel idea, then a lending/risk-scoring concept) before landing on transaction integrity as the sharper, more defensible problem',
      ],
      roleDetail: 'Solo entry — designed the full architecture, built the agent orchestration, and integrated the validation layer.',
      results: 'Finished and submitted by deadline. Not shortlisted for the next round, but a complete, working end-to-end system.',
    },
  },
  {
    slug: 'terrainfit',
    title: 'TerrainFit',
    summary:
      'A smart backpack that tells bad posture apart from walking uphill. 1st place, college IoT competition.',
    highlights: [
      'Dual MPU6050s cancel terrain false positives',
      'C++ sensor-fusion firmware on Arduino Uno',
      'Team SpineSync — live demo, 1st place',
    ],
    role: 'Hardware, firmware & calibration',
    year: '2024',
    stack: ['C++', 'Arduino Uno', 'Dual MPU6050 Gyroscopes', 'Embedded Systems'],
    links: { repo: 'https://github.com/kadv19' },
    media: '/terrainfit-demo.mp4',
    details: {
      overview:
        'A smart backpack that tells the difference between bad posture and just walking uphill. 1st Place, College IoT Competition.',
      problem:
        'Existing posture-monitoring wearables use a single sensor and flag any deviation from “upright” as bad posture — meaning normal terrain like stairs or slopes constantly triggers false positives, making the devices unreliable in real-world conditions.',
      architecture:
        'Dual MPU6050 gyroscope setup — one sensor tracks terrain/body baseline angle, the second tracks spine angle relative to it — feeding into an Arduino Uno that computes relative deviation instead of absolute deviation.',
      points: [
        'Built with team SpineSync',
        'The differential sensor design is what eliminates the false-positive problem — the system asks “is the back deviated from the terrain-adjusted baseline?” not “is the back at exactly 90°?”',
        'Full embedded firmware written in C++ for Arduino Uno, real-time sensor fusion between the two units',
        'Taken through the complete lifecycle: ideation → hardware prototyping → firmware debugging → sensor calibration → academic documentation',
      ],
      roleDetail: 'Hardware design, gyroscope calibration logic, embedded firmware, and academic paper writing.',
      results: '1st place at the college IoT competition, live working hardware demo.',
    },
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
