# Advaith Kashyap — Portfolio (Phase 3: Flagship Projects & Case Studies)

**Systems-minded engineer who uses AI as one of his tools.**

Laboratory × future computing × engineering notebook — dark-dominant, measured, architecture-first.

## Phase status

- **Phase 1** — Architecture, design system, shell, 8-section skeleton, Canvas network (done)
- **Phase 2** — Identity, narrative, visual language (done)
- **Phase 3** — Flagship project case studies (this branch — done, runnable, code-split)

## Routes

- `/` — Home: Hero → About → Work (flagship previews + secondary grid) → Systems → Journey → Exploration → Quantum → Contact
- `/work/razorpay` — Razorpay Agentic Commerce (Transaction Integrity Agent)
- `/work/ai-ghost` — AI Ghost Sovereign Memory Transfer
- `/work/parallel-scheduler` — Cache-Aware Parallel Scheduler
- `*` — 404 archive fallback

Each flagship has: project hero (category/title/thesis), architecture viz, failure/edge viz, measurements, decisions, limitations, reproduction, prev/next/back archive nav.

## Project routes created

- `src/pages/Home.tsx` (extracted from `App.tsx`)
- `src/pages/WorkRazorpay.tsx` — deterministic gate story, 5 checks inspectable, animated failure paths (recovery vs block), 3 separate metrics, TEST MODE, honest scope
- `src/pages/WorkAiGhost.tsx` — sovereign memory story, preparation|device boundary, retrieval disclosure (query→embedding→similarity→generation), ownership boundaries, 2-person team context
- `src/pages/WorkParallel.tsx` — cache locality question, CPU→Cache→Memory viz + access pattern (sequential/strided/random) interactive, repo-evidence overview (68 tests), measurement definitions, reproduction

## Components created

- `src/components/work/ProjectHero.tsx` — strong category/title/thesis hero with badges + visual slot
- `src/components/work/ArchitectureRazorpay.tsx` — architecture flow (Intent→Auditor GATE→TEST Checkout) + `FiveChecksRazorpay` inspectable 5 validators
- `src/components/work/FailurePathsRazorpay.tsx` — animated failure paths (auto-stepping 900 ms, pauses off-screen, reduced-motion static)
- `src/components/work/ArchitectureAiGhost.tsx` — preparation|device split with boundary + `RetrievalDisclosureAiGhost` progressive disclosure
- `src/components/work/MemoryVizParallel.tsx` — `CpuCacheMemoryViz` (stack + 8 memory cells) + `OverviewParallelMetrics` (meaningful overview, not 8 giant images)
- `src/components/work/Disclosure.tsx` — progressive disclosure (architecture/implementation/failure/measurements/decisions/limitations)
- `src/components/work/ProjectNav.tsx` — prev/next/back archive nav
- `src/components/work/SecondaryGrid.tsx` — lighter entries for Deepfake/ TerrainFit/ Safety-Net/ NutriMind/ Sign-to-Audio with conservative scope
- `src/components/layout/ScrollToTop.tsx` — route scroll reset (hash-aware)
- Refined `src/App.tsx` to `BrowserRouter` + `Suspense` + `lazy()` code-split

## Visualizations created (performant: no WebGL, paused off-screen, reduced-motion)

- Razorpay: interactive architecture (GATE distinct), 5 validation checks (hover/tap detail), 2 failure paths (OUT OF STOCK→recovery vs exhausted→block)
- AI Ghost: preparation/device boundary with S3/P2P marker, retrieval loop disclosure (5 steps)
- Parallel: CPU/Cache/Memory stack + 8-cell memory (sequential/strided/random) with 700 ms stepping, overview single-visualization (not 8 images) + selected detailed CSV snippet

## Data / files used (verified)

- **Razorpay** — `~/Desktop/RazorPay/src/{state.py,validators.py,graph.py,recovery_agent.py}`, `README.md` Architecture + `benchmarks/full_benchmark_report.json` (validator_only 180:1.0/1.0, agent gap 117/120, safety 0/0, amount correct) — metrics shown separately with `doesProve/doesNotProve`
- **AI Ghost** — `~/Downloads/ppt.md` Process Flow (300/50 chunk, 384-d MiniLM, BLIP, S3 brain.json, Ryzen AI) + `~/Desktop/companies/advaith information further/projects/ai-ghost.html` (169 chunks, <50 ms, Ghost Key 4-word path, presigned URLs) + antigravity MediaPipe spec (1 GB task, 5–10 s, 6 GB, pickFirsts)
- **Parallel** — `~/Desktop/PARALLEL_COMPUTING/ml/model_metrics.json` (MAE 0.040 RMSE 0.076 R² 0.793, tree 0.027/0.879), `experiments/results/benchmark_results.csv` (55 lines), `analysis/results_summary.txt` (14.9/17.7/24.3 ms, FCFS 8.17/2.21), `analysis/final_comparison.csv` (representative 4w), `PROJECT_STATE.md` (68 tests zero warnings)
- **Secondary** — conversation-summary.md + 6 HTML detail pages (TerrainFit paper, NutriMind AMD Ideathon etc.) — all phrased conservatively with shared ownership where uncertain

## Metrics displayed (labeled separately, sourced)

- Razorpay: `180 (60/120) · precision 1.0 recall 1.0 invalidMarkedPass 0` (validator-only), `117/120` recovery (category substitution, bounded MAX_LOOPS=3), `0 invalid→checkout, 0 FAIL→checkout, amount correct, 174 PASS/6 FAIL` (structural via Stub call log)
- AI Ghost: `384-d · 169 chunks · <50 ms` (lab demo small corpus, not production), Gemma 3 1B INT4 via MediaPipe
- Parallel: `68 CTest · MAE 0.040 RMSE 0.076 R² 0.793 · 54-row matrix · 8 plots · FCFS 8.17 ms 2.21× on sequential (fastest), AI 21.26 ms on random beats FCFS 28.34`

## Source verification performed

- Searched `src/data/projects/*` and `src/pages/*` for forbidden upgrades (won, internship, production payment, Agent Studio integration, NPCI UAP shipped, dashboard shipped) — all absent except intentional `No Agent Studio, NPCI UAP, or production payment claim` limitation + seeking-internship (not result).
- Numbers checked against on-disk artifacts via `final_audit.py` — validator 1.0/1.0, 117/120, 0/0, MAE 0.040 match.
- Every metric has source line (e.g., `src/validators.py:18`, `benchmarks/full_benchmark_report.json:safety_invariant_check`).

## Tests performed

- `tsc -b && vite build` — 466 modules, 6 chunks (main 480kB + 27k/25k/21k lazy), CSS 37kB, `✓ built in 521ms`
- `npm run lint` — only pre-existing `useReducedMotion` warning
- `npm run dev` — 200 on `/`, title correct
- Code-split lazy routes verified via `dist/assets/Work*.js`
- Reduced-motion respected in 9 components, animations paused off-screen (IntersectionObserver in FailurePaths + HeroNetwork)
- Mobile: stacked flows at `<md`, disclosure tap-friendly, no horizontal overflow (`overflow-x-auto` on `pre`)

## Remaining polish (intentionally deferred to Phase 4)

- Final visual overhaul (unified flagship hero styling, polish pass on transitions/motion per Phase 4 brief)
- 8 benchmark plots rendered as single overview + expandable raw CSV (currently single overview + snippet + expandable definitions — 8 images not inlined for perf)
- OG images per flagship, richer SEO, image lazy loading where applicable

---

Fast, no heavy 3D, Canvas/SVG only, `prefers-reduced-motion` respected, mobile tested 375–1440 via responsive primitives.
