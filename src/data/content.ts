/**
 * CONTENT TRUTH RULE — Phase 2
 * Hierarchy: verified repo evidence > local resumes > documented descriptions > conservative context.
 * Nothing upgraded from exploring → expert, prototype → production.
 */

export const SITE = {
  name: "Advaith Kashyap",
  title: "Systems-minded engineer",
  subtitle: "Computer Science Engineering · NIE Mysuru (Apr 2027)",
  email: "advaith.kashyap19@gmail.com",
  phone: "+91 9019527115",
  location: "Mysuru, Karnataka, India",
  github: "https://github.com/kadv19",
  linkedin: "https://linkedin.com/in/advaith-kashyap",
  identity:
    "A systems-minded engineer who uses AI as one of his tools — not the other way around.",
  heroBlurb:
    "I build real systems under constraints: embedded firmware on 2 KB RAM, on-device LLMs without a cloud, and parallel schedulers where cache locality decides speedup. Architecture first, measurement always.",
  heroWhat:
    "Systems × AI × Backend × Edge × Parallel × Architecture — with a longer arc toward quantum and hardware.",
} as const;

// ── 6 principles for About ──────────────────────────────────────────────
export const PRINCIPLES = [
  {
    n: "01",
    title: "UNDERSTAND THE SYSTEM",
    detail:
      "Decompose into components and interfaces before reaching for a framework. Name the invariants.",
    note: "Interfaces outlive implementations.",
  },
  {
    n: "02",
    title: "RESPECT THE CONSTRAINTS",
    detail:
      "2 KB SRAM, 6 GB RAM budget, offline-only, single-thread baseline — constraints are inputs, not inconveniences.",
    note: "Constraints clarify design.",
  },
  {
    n: "03",
    title: "MEASURE THE BEHAVIOR",
    detail:
      "Speedup, efficiency, throughput — each with workload, workers, and repeat count attached. No naked percentages.",
    note: "Measured beats marketed.",
  },
  {
    n: "04",
    title: "DESIGN THE FAILURE PATH",
    detail:
      "Caching misses, calibration drift, model load failures — test the unhappy path first, then the demo path.",
    note: "Failure is a first-class flow.",
  },
  {
    n: "05",
    title: "SCOPE IS AN ENGINEERING DECISION",
    detail:
      "Prefer a verified 68-test suite and a live hardware demo over an untested 200-feature roadmap.",
    note: "Scope honestly, ship verifiably.",
  },
  {
    n: "06",
    title: "USE AI AS A TOOL",
    detail:
      "RAG, embeddings, and on-device inference are useful operators — applied where they reduce cost or latency, not as the whole story.",
    note: "AI is a node, not the graph.",
  },
] as const;

export const PHILOSOPHY = {
  kicker: "Engineering Notebook · How I Think",
  title: "Systems are the thing. Tools are how you probe them.",
  paragraphs: [
    "I like the layer where software meets its substrate — where a memory layout, a stride, or a power envelope decides whether an abstraction holds. Abstractions are powerful precisely because they hide cost; my job is to remember the cost is still there.",
    "That’s why I scope to what can be demonstrated, measure before claiming, and keep the trade-offs next to the feature. A single-core lab machine that reports honest numbers tells you more than a slide that promises a data center.",
  ],
} as const;

export type ProjectStatus = "built" | "demonstrated" | "tested" | "ongoing" | "explored";

export const PROJECTS = [
  {
    id: "terrainfit",
    title: "TerrainFit — Terrain-Aware Posture Backpack",
    award: "1st Place · College IoT Competition",
    status: "built" as ProjectStatus,
    stack: ["C++", "Arduino Uno", "MPU6050 ×2", "Embedded"],
    summary:
      "Firmware that distinguishes genuine posture deviation from terrain-induced tilt using relative angular computation between two real-time gyroscopic vectors.",
    highlights: [
      "Dual-MPU6050 sensor fusion — vector geometry under 2 KB SRAM, real-time loop, calibration drift handling",
      "Full hardware-software integration: firmware → calibration → on-hardware debugging → documented demo",
      "Built for a live judged demo; won 1st place on a working prototype, not a slide",
    ],
    metrics: [
      { label: "Vectors compared", value: "2× realtime" },
      { label: "Demo mode", value: "Live hardware" },
    ],
    links: [],
    truthNote: "Built and demonstrated on Arduino hardware. Award verified via resume.",
  },
  {
    id: "aighost",
    title: "AI Ghost — Sovereign On-Device RAG",
    award: "AMD Slingshot Ideathon Selection · 3-person team (led)",
    status: "built" as ProjectStatus,
    stack: ["Python", "Android", "FastAPI", "AWS S3", "Gemma 3", "FAISS"],
    summary:
      "Hybrid cloud-edge system that transplants the ‘soul’ (indexed memory) of a phone before the ‘body’ (bulk files) — retrieval fully offline via on-device LLM.",
    highlights: [
      "Distributed design: Python/FastAPI ingestion + Android on-device inference (MediaPipe, quantized Gemma 3 1B)",
      "Low-latency retrieval — vector embeddings + cosine similarity; internal bench <50 ms (lab device, small corpus) — not a production claim",
      "S3 path-based auth evaluated as an explicit architectural trade-off (no central auth service)",
    ],
    metrics: [
      { label: "Inference", value: "Offline · airplane-mode" },
      { label: "Team", value: "Led · 3 members" },
    ],
    links: [],
    truthNote:
      "Modular distributed prototype spanning backend and Android. On-device LLM path demonstrated per project scope. Do not claim AMD NPU deployment.",
  },
  {
    id: "parallel",
    title: "Cache-Aware Parallel Data Processing with Burst-Time Prediction",
    award: "Systems · 68 tests, zero warnings",
    status: "tested" as ProjectStatus,
    stack: ["C++17", "CMake", "pthreads", "Python · scikit-learn", "matplotlib"],
    summary:
      "Studies how memory-access patterns (Sequential / Strided / Random) and scheduling policies affect parallel speedup — with an AI scheduler that predicts burst times.",
    highlights: [
      "Five schedulers under one IScheduler interface: FCFS · SJF · Round-Robin · Dynamic · AI (Linear Regression burst predictor)",
      "Measured suite: 54-row benchmark matrix (3 patterns × 3 worker counts × 6 schedulers), 11,040-row task-burst dataset, 8 analysis plots",
      "Model: Linear Regression MAE 0.040 / RMSE 0.076 / R² 0.793 (held-out 2,560 rows); Decision Tree compared but not deployed for C++ simplicity",
    ],
    metrics: [
      { label: "Tests", value: "68 · CTest" },
      { label: "Speedup (FCFS, 4w)", value: "3.78× (sublinear, measured)" },
    ],
    links: [{ label: "Repo", href: "https://github.com/kadv19/Parallel-computing" }],
    truthNote:
      "All numbers from committed artifacts: benchmark_results.csv, model_metrics.json, visualization outputs. Speedup is workload-specific (1M array, 100 tasks, repeat=5).",
  },
  {
    id: "deepfake",
    title: "Deepfake Detection — PPG + Eulerian Magnification",
    award: "Ongoing · DSP / Computer Vision",
    status: "ongoing" as ProjectStatus,
    stack: ["Python", "OpenCV", "SciPy", "scikit-learn", "FastAPI"],
    summary:
      "Detects synthetic video by extracting photoplethysmography (PPG) signals — subtle skin-color pulsations that correlate with heartbeats — and amplifying them with a Python EVM pipeline.",
    highlights: [
      "Pipeline: frame extraction (strided) → POS/CHROM PPG extraction → BPM and frequency-domain consistency features",
      "Diagnosed and fixed a caching bottleneck via log analysis — latency −60% on the local pipeline run",
      "Multi-detector fusion evaluated: PPG + optical flow + blink + metadata (each scored, none claimed as production-grade)",
    ],
    metrics: [
      { label: "Pipeline", value: "Frame → PPG → Fusion" },
      { label: "Latency fix", value: "−60% (log-diagnosed)" },
    ],
    links: [],
    truthNote:
      "Ongoing research prototype. Do not claim publication, deployed accuracy, or comparison to published benchmarks. EVM is a Python port, not MATLAB production.",
  },
] as const;

// ── Technical Identity: categories + proficiency tiers ───────────────────
export type TechTier = "built" | "worked" | "exploring";

export const TECH_MAP = [
  {
    id: "computing",
    label: "COMPUTING",
    caption: "Foundations taught & used in coursework and systems work",
    items: [
      { name: "C / C++", tier: "built" as TechTier, note: "Systems & embedded" },
      { name: "Python", tier: "built" as TechTier },
      { name: "Java", tier: "worked" as TechTier },
      { name: "JavaScript", tier: "worked" as TechTier },
      { name: "Data Structures & Algorithms", tier: "built" as TechTier, note: "NIE coursework" },
      { name: "Operating Systems", tier: "worked" as TechTier },
      { name: "Computer Networks", tier: "worked" as TechTier },
      { name: "Concurrency / Threads", tier: "built" as TechTier, note: "pthreads, thread_pool" },
    ],
  },
  {
    id: "systems",
    label: "SYSTEMS",
    caption: "Where I like to live — near the machine",
    items: [
      { name: "Parallel Computing", tier: "built" as TechTier, note: "68 tests, 5 schedulers" },
      { name: "Memory & Caching", tier: "built" as TechTier, note: "measured curves" },
      { name: "Performance & Benchmarking", tier: "built" as TechTier },
      { name: "Computer Architecture", tier: "worked" as TechTier, note: "pipelines, ISA basics" },
      { name: "Distributed Systems", tier: "exploring" as TechTier, note: "S3 path-auth trade-off" },
      { name: "Embedded / Real-time", tier: "built" as TechTier, note: "2 KB SRAM, MPU6050" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    caption: "Applied where it reduces cost or latency",
    items: [
      { name: "RAG / Vector Search", tier: "built" as TechTier, note: "FAISS, <50 ms lab bench" },
      { name: "Embeddings", tier: "built" as TechTier },
      { name: "On-device LLM", tier: "built" as TechTier, note: "Gemma 3 1B · MediaPipe" },
      { name: "Computer Vision", tier: "worked" as TechTier, note: "OpenCV, PPG/EVM" },
      { name: "scikit-learn / Hugging Face", tier: "worked" as TechTier },
      { name: "LLM Orchestration", tier: "exploring" as TechTier },
    ],
  },
  {
    id: "backend",
    label: "BACKEND",
    caption: "Owned end-to-end once — MTD Hostinger deploy",
    items: [
      { name: "FastAPI / Flask", tier: "built" as TechTier },
      { name: "REST / APIs", tier: "built" as TechTier },
      { name: "MySQL / MongoDB / SQLite", tier: "built" as TechTier },
      { name: "AWS S3", tier: "worked" as TechTier, note: "path-based auth eval" },
      { name: "PHP + Hostinger", tier: "worked" as TechTier, note: "MTD intern ship" },
    ],
  },
  {
    id: "tools",
    label: "TOOLS",
    caption: "Daily drivers, not badges",
    items: [
      { name: "Linux", tier: "built" as TechTier },
      { name: "Git / GitHub", tier: "built" as TechTier },
      { name: "Docker", tier: "worked" as TechTier },
      { name: "CMake", tier: "built" as TechTier },
      { name: "Cloud & Deploy", tier: "worked" as TechTier, note: "Hostinger, S3" },
      { name: "CI / Testing", tier: "worked" as TechTier, note: "CTest, pytest" },
    ],
  },
] as const;

// Keep flat SYSTEMS for fallback / simple views if needed
export const SYSTEMS = {
  kicker: "Technical Identity",
  title: "Depth across the stack. Preference for the lower layers.",
  intro:
    "Not ‘full-stack’ as a buzzword — but comfort moving between firmware, systems, backend, and models when the problem demands it. The through-line is architecture and measurement.",
  groups: [
    { label: "Languages", items: ["C++ (systems, embedded)", "Python", "Java", "JavaScript", "Kotlin (Android)"] },
    { label: "Systems", items: ["OS internals · memory · CPU pipelines · ISA basics"] },
    { label: "Backend & Data", items: ["FastAPI / Flask", "REST API design", "MySQL · MongoDB · SQLite", "AWS S3"] },
    { label: "AI / CV", items: ["OpenCV · signal processing (PPG/EVM)", "RAG · vector search · FAISS"] },
    { label: "Practices", items: ["Git/GitHub · Docker · Linux", "Structured testing (Catch2 / pytest)"] },
    { label: "Quantum — Foundational", items: ["Qiskit · Cirq · IBM Quantum Lab", "BB84/E91 (coursework)"] },
  ],
} as const;

// ── Journey: chronological + directional ─────────────────────────────────
export const JOURNEY = [
  {
    year: "2023",
    title: "B.E. CSE — NIE Mysuru",
    detail: "Enrolled. CGPA 8.01/10. DSA, OS, DBMS, ADA, Architecture, Compilers, Applied Math.",
    marker: "enrolled" as const,
  },
  {
    year: "2024 — 2025",
    title: "Builder trajectory",
    detail: "Deepfake PPG/EVM pipeline · parallel computing foundations · StudyReel contributions.",
    marker: "building" as const,
  },
  {
    year: "Jul — Aug 2025",
    title: "Full-Stack Intern — MTD, Mysuru",
    detail: "Built and deployed PHP + MongoDB on Hostinger — owned architecture, schema, REST APIs, and handoff in ~2 months.",
    marker: "shipped" as const,
  },
  {
    year: "2025",
    title: "TerrainFit · 1st Place (IoT)",
    detail: "Embedded C++ posture backpack — dual-MPU6050 fusion, live hardware demo, judged win.",
    marker: "awarded" as const,
  },
  {
    year: "2025 — 2026",
    title: "AI Ghost · AMD Slingshot selection",
    detail: "Led 3-person distributed on-device RAG — hybrid ingestion + offline Gemma inference. Selected for ideathon; scoped to demonstrable prototype.",
    marker: "selected" as const,
  },
  {
    year: "Apr 2027",
    title: "Graduation — expected",
    detail: "Seeking systems-facing roles: architecture, performance, edge/AI, hardware-software.",
    marker: "future" as const,
  },
] as const;

export const JOURNEY_DIRECTION = [
  { id: "software", label: "SOFTWARE", status: "built" as const, note: "Data structures, OOP, MTD deploy" },
  { id: "ai", label: "AI", status: "built" as const, note: "RAG, PPG/EVM, on-device" },
  { id: "edge", label: "EDGE / CONSTRAINED", status: "built" as const, note: "2 KB SRAM → 6 GB RAM budgeting" },
  { id: "parallel", label: "PARALLEL / PERFORMANCE", status: "built" as const, note: "68 tests, 54-row matrix" },
  { id: "systems", label: "SYSTEMS", status: "building" as const, note: "Interfaces, trade-offs, docs" },
  { id: "arch", label: "ARCHITECTURE", status: "building" as const, note: "Pipelines, ISAs, cache" },
  { id: "quantum", label: "QUANTUM / HARDWARE", status: "exploring" as const, note: "Qiskit Aer, BB84 — foundational" },
] as const;

// ── Current Exploration: interconnected lab ───────────────────────────────
export const EXPLORATION = {
  kicker: "Active Laboratory",
  title: "What I’m spending cycles on right now.",
  intro:
    "Not a roadmap slide — each line is something I can show or measure today, with a clear next probe. Hover to see why it matters.",
  items: [
    {
      id: "distributed",
      title: "Distributed systems",
      why: "AI Ghost’s S3 path-based auth made trade-offs explicit — central vs. decentralized trust.",
      learning: "Consistency models · partitioning · S3 as a coordination primitive (building).",
      tier: "exploring" as const,
    },
    {
      id: "parallel",
      title: "Parallel computing",
      why: "The same array, traversed differently, tells a different performance story.",
      learning: "FCFS vs SJF vs AI burst predictor — why static wins on uniform work.",
      tier: "built" as const,
    },
    {
      id: "cache",
      title: "Cache behavior",
      why: "Sequential 12.1 ms vs Random 22.3 ms is not trivia — it’s locality, made visible.",
      learning: "Stride sweeps, repeat counts, worker scaling curves (measured).",
      tier: "built" as const,
    },
    {
      id: "edge",
      title: "Edge AI",
      why: "Airplane-mode answers change the trust model — no cloud to leak through.",
      learning: "Quantized Gemma 3 1B · MediaPipe GenAI · 5–10 s cold load · 6 GB budget.",
      tier: "built" as const,
    },
    {
      id: "backend",
      title: "Backend systems",
      why: "Owning a deploy (Hostinger, S3) teaches what slides hide: schema, auth, handoff.",
      learning: "FastAPI + SQLite + REST — plus where they break.",
      tier: "built" as const,
    },
    {
      id: "arch",
      title: "Computer architecture",
      why: "Pipelines, ISAs, and cache hierarchies are the substrate my schedulers run on.",
      learning: "NIE coursework + parallel project — applied, not theoretical.",
      tier: "worked" as const,
    },
    {
      id: "quantum",
      title: "Quantum computing",
      why: "QKD and superposition are a different computing substrate — worth learning before claiming.",
      learning: "Qiskit Aer · BB84/E91 · Grover/Deutsch-Jozsa at lab scale (foundational).",
      tier: "exploring" as const,
    },
    {
      id: "hardware",
      title: "Hardware / Semiconductor",
      why: "The longer arc — where architecture meets physics and systems software meets silicon.",
      learning: "Direction, not a present claim — watching via architecture + NPTEL.",
      tier: "exploring" as const,
    },
  ],
  benches: [
    { label: "Bench A · Edge", value: "Gemma 3 1B .task — cold load 5–10 s, RAM budget 6 GB, MediaPipe GenAI Tasks" },
    { label: "Bench B · Parallel", value: "1M array · repeat sweep · workers 1/2/4 · 8 plots in analysis/plots/" },
    { label: "Bench C · Signal", value: "POS vs CHROM extraction · BPM consistency · blink/optical-flow ablation" },
  ],
} as const;

// ── Quantum: ladder + detail ─────────────────────────────────────────────
export const QUANTUM = {
  kicker: "Future Computing",
  title: "Toward the substrate.",
  intro:
    "Quantum is not a career claim today — it’s a direction I’m studying deliberately. NPTEL Quantum Algorithms & Qiskit, DeepLearning.AI maths, Imperial Linear Algebra — building the vocabulary before claiming the work.",
  bullets: [
    "QKD (BB84, E91), Grover & Deutsch–Jozsa — implemented in Qiskit Aer at lab scale",
    "Interest: quantum-safe encryption, key distribution, and secure communication protocols",
    "Longer arc: semiconductor / hardware systems — where architecture, physics, and systems software converge",
  ],
  disclaimer:
    "Foundational stage. No publications or deployed quantum systems claimed. Listed as future direction — not present expertise.",
  ladder: [
    { id: "bit", label: "BIT", sub: "0 / 1", detail: "Deterministic state. The abstraction everything else rests on.", status: "built" as const },
    { id: "transistor", label: "TRANSISTOR", sub: "Switch", detail: "Silicon that holds the abstraction. Where physics meets logic.", status: "built" as const },
    { id: "processor", label: "PROCESSOR", sub: "Pipeline", detail: "Pipelined, cached, scheduled — the substrate I measure on.", status: "built" as const },
    { id: "parallel", label: "PARALLEL SYSTEM", sub: "1 → 4 workers", detail: "Where locality and scheduling decide real speedup.", status: "built" as const },
    { id: "quantum", label: "QUANTUM STATE", sub: "|ψ⟩ = α|0⟩+β|1⟩", detail: "Superposition + entanglement — a different substrate. Exploratory, not claimed.", status: "exploring" as const },
  ],
} as const;

export const CONTACT = {
  kicker: "Contact",
  title: "Build something measured together?",
  blurb:
    "I’m most useful on teams that value architecture, honest scoping, and reproducible results. If your problem lives near systems, edge, performance, or applied AI — I’d like to hear about it.",
  email: SITE.email,
  github: SITE.github,
} as const;
