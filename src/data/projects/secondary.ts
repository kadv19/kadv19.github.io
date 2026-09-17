// Secondary projects — conservative, evidence-based, not flagship
export const SECONDARY = [
  {
    id: "deepfake",
    title: "Deepfake Detection via Physiological Signal Analysis",
    subtitle: "DSP / Computer Vision · Python",
    stack: ["Python", "FastAPI", "OpenCV", "SciPy", "scikit-learn"],
    summary:
      "Doesn’t chase pixels — looks for heartbeat. Eulerian Video Magnification amplifies sub-pixel skin-color shifts (PPG) that real faces have and most fakes lack.",
    detail:
      "EVM (Python) → POS/CHROM PPG extraction → BPM + frequency consistency features → Scikit-learn classifier. 150+ FaceForensics++ videos, exposed via stateless FastAPI (<30 s per video). Caching cut disk I/O by ~60% (lag-diagnosed).",
    result: "85% accuracy on local 150-video set — local benchmark, not a paper claim. Extensible to health/biometrics.",
    ownership: "Solo — pipeline, classifier, API, optimization.",
    status: "Ongoing · research prototype" as const,
  },
  {
    id: "terrainfit",
    title: "TerrainFit — Terrain-Aware Posture Backpack",
    subtitle: "Embedded / IoT · 1st Place, College IoT",
    stack: ["C++", "Arduino Uno", "MPU6050 ×2"],
    summary:
      "A backpack that knows the hill is not a slouch. Terrain-aware threshold adaptation — the central innovation has no direct precedent in reviewed literature.",
    detail:
      "Dual MPU6050s (AD0 for 0x68/0x69) on X-axis + accelerometry variance terrain classifier (FLAT/UPHILL/DOWNHILL/ROCKY) → dynamic posture thresholds (e.g., rocky 8° vs flat 12°). Seven-sensor fusion (IR, tilt, ball, tracking) + graduated 4-level alerts + hardware interrupt on vibration (Pin 2). ₹270 build, 50-sample auto-calibration, 6-scenario validation + 20 h wear test (zero false during normal activity).",
    result: "1st Place IoT live hardware demo. Paper: TerrainFit (SpineSync, NIE Mysuru, June 2026).",
    ownership: "Core team member — hardware, gyro calibration, firmware, paper writing (with teammates).",
    status: "Built · 1st Place" as const,
  },
  {
    id: "safety-net",
    title: "Safety-Net Guardian — DevOps Observability Pipeline",
    subtitle: "Kubernetes · Argo Rollouts · Prometheus / Grafana",
    stack: ["Docker", "Kubernetes", "Argo Rollouts", "Prometheus", "Grafana", "ngrok"],
    summary:
      "A pipeline demoed the way production actually runs — canary rollouts with live metrics over the public internet, not localhost.",
    detail:
      "CI → Argo Rollouts canary (small traffic % first, continue only if health green) → Prometheus scrape → Grafana live. Tunneled via ngrok for faculty demo to show real latency/exposure.",
    result: "Live faculty demo: real canary behavior + real-time metrics, internet-accessible.",
    ownership: "With teammate Arun V — shared pipeline, deployment, monitoring.",
    status: "Built · live demo" as const,
  },
  {
    id: "nutrimind",
    title: "NutriMind — AI Food Health Advisor",
    subtitle: "AMD Ideathon, REVA University",
    stack: ["Gemini 1.5 Flash Vision", "Firebase", "React", "FastAPI", "Google Cloud Run"],
    summary:
      "Same plate, different advice — goal-aware nutrition (weight loss vs diabetes vs muscle gain vs budget) from a food photo.",
    detail:
      "Gemini Vision identifies food → backend cross-references against goal profile (onboarding: weight loss/muscle/diabetes/budget). Auth/logging via Firebase, full stack deployed end-to-end in a single sprint.",
    result: "Functional end-to-end demo in hackathon window.",
    ownership: "With teammates Abhilash CN & Akshaay BS — shared frontend/backend/AI.",
    status: "Built · hackathon" as const,
  },
  {
    id: "sign-to-audio",
    title: "Sign-to-Audio Wearable Translation System",
    subtitle: "Deep Learning · NLP · Edge",
    stack: ["Deep Learning", "NLP", "Computer Vision", "Python"],
    summary:
      "Glasses that turn signs into speech — hands-free, low-latency, wearable-native.",
    detail:
      "Camera → CNN gesture classifier (85% accuracy, gestures→words) → NLP sentence reconstruction (grammar, not just bag-of-words) → speech synthesis. Decoupled async components, edge quantization in progress for wearable power envelope.",
    result: "85% gesture accuracy; end-to-end pipeline functional; edge optimization ongoing.",
    ownership: "Solo, ongoing, edge optimization active.",
    status: "85% · ongoing" as const,
  },
] as const;
