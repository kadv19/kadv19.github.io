// Parallel — verified from /home/advaith/Desktop/PARALLEL_COMPUTING
export const PARALLEL = {
  slug: "parallel-scheduler",
  category: "SYSTEMS / PARALLEL / PERFORMANCE",
  title: "Cache-Aware Parallel Scheduler",
  thesis: "How does memory access behavior affect parallel execution,\nand can a scheduler use that information?",
  oneLiner: "AI-assisted burst-time prediction for locality-aware scheduling — measured, not asserted.",
  question:
    "Same data, same workers, different traversal orders — does cache locality decide speedup, and can a learned model predict it?",
  architecture: [
    { id: "data", label: "DATA", sub: "std::vector<double> · 1M · 100 tasks", role: "input" as const },
    { id: "workers", label: "PARALLEL WORKERS", sub: "thread_pool · mutex · cv", role: "process" as const },
    { id: "access", label: "ACCESS PATTERN", sub: "Sequential / Strided / Random", role: "pattern" as const },
    { id: "cache", label: "CACHE BEHAVIOR", sub: "Locality → measured performance", role: "effect" as const },
    { id: "ml", label: "ML PREDICTION", sub: "Linear Regression · 7 features → burst_time", role: "model" as const },
    { id: "scheduler", label: "SCHEDULER", sub: "IScheduler: 5 policies + AI", role: "gate" as const },
  ],
  repoEvidence: {
    structure: "Data → Core (task, access_pattern) → Kernel (numeric_kernel) → Engine (thread_pool) → Scheduler (IScheduler) → Benchmark/Metrics → ML → Analysis (plots)",
    schedulers: [
      { id: "fcfs", name: "FCFS", type: "static queue" },
      { id: "sjf", name: "SJF", type: "shortest burst first" },
      { id: "rr", name: "RoundRobin", type: "cyclic" },
      { id: "dynamic", name: "Dynamic", type: "work-stealing / queue" },
      { id: "ai", name: "AI", type: "Linear Regression burst predictor → shortest predicted first" },
    ] as const,
    interface: "IScheduler { name(), execute(array, tasks, workers, a,b,c, repeat) } — src/scheduler/ischeduler.hpp",
    tests: 68,
    testFramework: "Catch2 v3.7.1 via FetchContent",
    warnings: "Zero warnings on -Wall -Wextra -Wpedantic",
    build: "CMake >=3.14, C++17, Threads (pthreads)",
  },
  memoryVizNote:
    "Explanatory visualization — locality_score is heuristic (Sequential 1.0, Strided 1/(1+stride/8), Random 0.1), not a hardware cache-hit measurement.",
  measurements: {
    workload: "array_size=1000000 task_count=100 repeat=5 patterns 3 workers {1,2,4} schedulers 6 → 54 rows (benchmark_results.csv:55 lines inc header)",
    dataset: "11040 rows task_burst_dataset.csv; 8 plots in analysis/plots; final_comparison.csv 15 rows; test_predictions.csv 2560 rows",
    metricsDef: {
      speedup: "T_seq / T_parallel (median of 5 runs, 1 warmup)",
      efficiency: "speedup / workers",
      throughput: "elements / sec",
      locality: "Sequential 1.0, Strided 0.5 (stride 8), Random 0.1 — derived, not measured",
    },
    // From actual artifacts — conservative, workload-specific
    findings: {
      // from analysis/results_summary.txt & benchmark_results.csv samples
      accessPattern: "Sequential ~14.9 ms < Strided ~17.7 ms < Random ~24.3 ms (workers=4 mean median_time, per summary)",
      schedulerOnSequential: "FCFS 8.17 ms speedup 2.21 fastest; AI 21.26 ms speedup 0.85 — uniform tasks favor static",
      schedulerOnRandom: "AI 21.26 ms beats FCFS 28.34 ms on random (final_comparison.csv) — where prediction helps",
      scalingFCFS: "w1 0.98 eff 98.5% | w2 1.89 eff 94.6% | w4 2.21 eff 55.3% — sublinear, bandwidth & overhead",
      modelLine: "Linear Regression 7 feats → burst_time_ms: MAE 0.040 RMSE 0.076 R² 0.793 (test 2560, train 8480, 14 held-out configs)",
      modelTree: "Decision Tree (max_depth 6) comparison: MAE 0.027 R² 0.879 — better but not deployed (C++ simplicity)",
      nuance: "AI does not universally outperform traditional on this workload; prediction error explains non-universal win (results_summary.txt)",
    },
    plots: [
      "execution_time_by_pattern.png",
      "scheduler_comparison.png",
      "speedup_vs_workers.png",
      "efficiency_vs_workers.png",
      "throughput_vs_workers.png",
      "ai_prediction_quality.png",
      "ai_vs_traditional.png",
      "burst_time_by_pattern.png",
    ] as const,
  },
  decisions: [
    {
      title: "Multiple scheduling strategies under one interface",
      why: "IScheduler lets FCFS/SJF/RR/Dynamic/AI be swapped without touching kernel or benchmark harness — architecture before tooling.",
      source: "src/scheduler/ischeduler.hpp, src/main.cpp",
    },
    {
      title: "Explicit memory access patterns",
      why: "Sequential / Strided (stride 8) / Random (seeded shuffle) make locality a controlled variable, not a hidden factor.",
      source: "src/core/access_pattern.cpp, config/default.yaml",
    },
    {
      title: "Measurement before prediction",
      why: "54-row matrix + 11040-row per-task dataset measured first; model trained only on pre-execution features (no leakage).",
      source: "ml/ml_pipeline.py: features list, PROJECT_STATE Phase 5",
    },
    {
      title: "Linear Regression for C++ deployment",
      why: "Chose interpretable linear model over higher-R² tree for direct C++ reimplementation (ml/model.cpp) and validated manual vs sklearn within 1e-6.",
      source: "README ML section, ml/model.json, src/ml/model.cpp:89",
    },
  ],
  limitations: [
    "Timing noise for microsecond-scale tasks near timer resolution; repeat_count used to amplify signal.",
    "Memory bandwidth caps throughput with more workers; hardware/environment dependent (locality_score not hardware-measured).",
    "Workload-specific (1M/100/repeat5) — speedup claims are not universal.",
    "AI scheduler assumes isolated burst cost predicts parallel load; contention not modeled — explains why AI loses on uniform sequential.",
    "Linear Regression prediction error (MAE 0.040) limits advantage; not guaranteed to beat every policy.",
  ],
  reproduction: [
    "cmake -S . -B build && cmake --build build -j",
    "ctest --test-dir build --output-on-failure  # 68 tests, 0.15s",
    "./build/benchmark --array-size 100000 --task-count 10 --workers 4 --pattern sequential --repeat-count 5",
    "python3 experiments/run_experiments.py  # → experiments/results/benchmark_results.csv (54 rows)",
    "python3 ml/ml_pipeline.py  # → ml/model.json, model_metrics.json, test_predictions.csv",
    "python3 analysis/visualize.py  # → analysis/plots/*.png (8), final_comparison.csv",
  ],
  links: {
    repo: "https://github.com/kadv19/Parallel-computing",
  },
} as const;
