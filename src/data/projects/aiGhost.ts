// AI Ghost — Sovereign Memory Transfer
// Sources: /home/advaith/Downloads/ppt.md + /home/advaith/Desktop/companies/advaith information further/projects/ai-ghost.html + claude.txt + antbrain task
export const AI_GHOST = {
  slug: "ai-ghost",
  category: "ON-DEVICE AI / SOVEREIGN MEMORY",
  title: "AI Ghost — Sovereign Memory Transfer",
  thesis: "Move understanding, not just files.\nA phone’s memory should be queryable, private, and useful offline.",
  oneLiner: "Hybrid Cloud-Edge RAG: ‘soul’ (indexed memory) before ‘body’ (bulk files).",
  problem:
    "Migration today is a dumb byte-copy. Users wait for 100 GB to move while the new phone is a stranger. Cloud intelligence (Google/Apple) requires reading your data — a privacy and latency liability.",
  story: "AI Ghost explores transplanting usable personal intelligence: index the old phone’s meaningful content (SMS, PDFs, images via caption) into portable embeddings, deliver that index to the new device, answer questions fully offline.",
  architecture: {
    preparation: [
      { id: "sources", label: "SMS / PDF / Images", sub: "SMS CSV, PDFs, JPG/PNG", role: "input" as const },
      { id: "docling", label: "Docling / BLIP / Pandas", sub: "PDF text · image captions · SMS sentences", role: "process" as const },
      { id: "chunking", label: "Chunking", sub: "Recursive · 300 tokens, 50 overlap", role: "process" as const },
      { id: "embeddings", label: "Embeddings", sub: "384-d · all-MiniLM-L6-v2", role: "process" as const },
      { id: "memory", label: "Memory Package", sub: "brain.json + metadata.json (S3 URLs)", role: "store" as const },
    ],
    device: [
      { id: "memory2", label: "Memory", sub: "brain.json on device", role: "store" as const },
      { id: "query", label: "Query", sub: "“when’s my exam?”", role: "input" as const },
      { id: "emb", label: "Embedding", sub: "Local EmbeddingGemma → vector", role: "process" as const },
      { id: "retrieval", label: "Similarity Retrieval", sub: "Cosine · Top-3/5", role: "process" as const },
      { id: "gemma", label: "Gemma 3 1B · INT4", sub: "MediaPipe Tasks GenAI — offline", role: "model" as const },
      { id: "answer", label: "Response", sub: "Augmented generation · on-device", role: "output" as const },
    ],
    cloudBoundaryNote: "Boundary between Preparation (cloud, one-time heavy) and Device (offline, daily). After delivery, airplane-mode inference holds.",
  },
  details: {
    stack: ["Android (Java) · MediaPipe · FastAPI · AWS S3 · sentence-transformers · FAISS / NumPy · Docling · BLIP"],
    ingestion: [
      "SMS CSV → Pandas → natural sentences: “On Jan 5, Boss texted: deadline moved” (verified via ppt.md:5, ai-ghost.html Technical Deep-Dive)",
      "PDFs → Docling (structured, hierarchy-aware extraction, per claude.txt Phase 1)",
      "Images → BLIP captioning (Salesforce BLIP base) → searchable text (ppt.md:5, brain task images)",
      "Chunking: LangChain RecursiveCharacterTextSplitter size 300, overlap 50 (ppt) — earlier spec 500/10% via Docling in claude.txt; delivered as 300/50 per ppt.md",
      "Embeddings: 384-dimensional, all-MiniLM-L6-v2 (ppt.md & claude.txt consistent)",
      "Storage: brain.json (chunk_id + text + vector + metadata) + metadata.json mapping chunks → S3 URLs for on-demand fetch (claude.txt Phase 1)",
    ],
    delivery: [
      "Personal S3 bucket per user — bucket/{user_id}/filename (ppt.md:6). Async message bus, no shared backend.",
      "Bundle: brain.json + gemma-3-1b-it-int4.task (~1 GB) to new phone via cloud download or P2P Wi-Fi (claude.txt Phase 2).",
    ],
    inference: [
      "Engine: MediaPipe Tasks GenAI, LlmInference.generateResponseAsync(), Streaming tokens (antbrain MainActivity.java spec).",
      "Load: background thread (ExecutorService), main thread via runOnUiThread; 5–10 s cold load, ~6 GB RAM target (claude.txt consultant note).",
      "Packaging gotcha: jniLibs pickFirsts for native .so (verified via antigravity prompt).",
      "Model: gemma-3-1b-it-int4.task from Kaggle (license acceptance required).",
    ],
    retrievalLoop: [
      "1. Query → vectorize (local EmbeddingGemma)",
      "2. Retrieval → cosine similarity vs brain.json (NumPy dot on normalized vectors)",
      "3. Augmentation → inject Top-3 chunks into system prompt",
      "4. Generation → Gemma 3 1B on-device",
      "5. Optional: View Source → HTTPS GET to S3 URL from metadata",
      "Measured demo: 169 indexed chunks retrievable in <50 ms on lab device (ai-ghost.html Results) — small corpus, not production.",
    ],
  },
  ownership: {
    statement:
      "Scoped focus per brief: get MediaPipe to load the 1 GB Gemma model into RAM and reply “Hello” in Airplane Mode. Built on Java familiarity with MediaPipe (prior CV integrations).",
    built: [
      "Core RAG pipeline: sentence-transformers embeddings + on-device cosine retrieval (<50 ms, small corpus)",
      "Quantized 1B-parameter LLM offline via MediaPipe (streaming, airplane-mode verified goal)",
      "Ghost Key auth: 4-word passphrase baked into S3 path structure — path is the credential, no auth server (ai-ghost.html Technical Deep-Dive)",
      "Presigned URL bridging: request by name → 1-hour expiry link (file delivery without exposing bucket)",
    ],
    teamContext: "AI Ghost is a 3-person team project (AMD Slingshot Ideathon Selection). Above lines reflect personal contributions per Antigravity scope; broader system (S3 orchestration, BLIP pipeline, second Android app Extractor/Retrieval) involved teammates — credited as team effort where boundary uncertain.",
  },
  decisions: [
    {
      title: "Local retrieval + quantized model",
      why: "Heavy once in cloud (BLIP, embedding), daily use fully offline. INT4 keeps model on-device (~1 GB, 6 GB RAM budget).",
      source: "ppt.md: AMD Ryzen AI philosophy + claude.txt inference loop",
    },
    {
      title: "S3 path-based auth instead of central auth",
      why: "Trades standard infra for smaller attack surface — single-user personal tool. Evaluated as explicit trade-off with team.",
      source: "ai-ghost.html Deep-Dive Ghost Key",
    },
    {
      title: "Constrained demo scope",
      why: "SMS + PDF only for prototype (per user prompt), MediaPipe Hello-in-airplane-mode as anchored milestone. Pre-baked memory.json acceptable for hackathon demo.",
      source: "claude.txt consultant advice + user scope",
    },
  ],
  limitations: [
    "Prototype: SMS + PDF primary; images via BLIP captioning is ppt-level design, verify per device before claiming full multimodal.",
    "Chunk size/overlap spec varies (300/50 in ppt vs 500/10% in early claude.txt) — delivered as 300/50 per final ppt.md.",
    "Model load 5–10 s cold, 6 GB RAM free required — budget devices risk OOM during load, as flagged in review.",
    "AMD Ryzen AI NPU framing is alignment (philosophy), not measured NPU deployment on test device — phrasing stays conservative.",
    "No production-scale evaluation (169 chunks demo, small corpus retrieval latency). No claim of production privacy audit.",
  ],
  reproduction: [
    "Factory: export SMS CSV + PDFs + images → upload to S3 bucket/{user_id}/ → POST /process (FastAPI) → brain.json",
    "Device: adb push gemma-3-1b-it-int4.task /sdcard/models/ + brain.json → Android app MediaPipe LlmInference (background thread)",
    "Verify: launch app → Model Ready → Airplane Mode → query “when’s my exam?” → streaming response from Top-3 chunks",
  ],
  links: {
    repo: "https://github.com/kadv19/AiGhost",
    tech: "MediaPipe Tasks GenAI 0.10.22, minSdk 26",
  },
} as const;
