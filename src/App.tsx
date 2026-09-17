import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PageShell } from "./components/layout/PageShell";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import Home from "./pages/Home";

const WorkRazorpay = lazy(() => import("./pages/WorkRazorpay"));
const WorkAiGhost = lazy(() => import("./pages/WorkAiGhost"));
const WorkParallel = lazy(() => import("./pages/WorkParallel"));

function NotFound() {
  return (
    <div className="mx-auto max-w-shell px-6 lg:px-8 py-24 text-center">
      <div className="font-mono text-2xs tracking-[0.18em] uppercase text-accent-amber">404 — not found</div>
      <h1 className="mt-2 font-display text-2xl font-semibold text-text-primary">This archive entry doesn’t exist</h1>
      <a href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-amber px-6 py-3 font-mono text-xs tracking-widest uppercase text-ink-900 hover:bg-accent-amberSoft transition-colors">
        Back to overview →
      </a>
    </div>
  );
}

function Fallback() {
  return (
    <div className="mx-auto max-w-shell px-6 lg:px-8 py-16 flex items-center gap-3 font-mono text-2xs tracking-[0.16em] uppercase text-text-faint">
      <span className="h-2 w-2 rounded-full bg-accent-amber animate-pulse" aria-hidden />
      Loading archive…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageShell>
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/razorpay" element={<WorkRazorpay />} />
            <Route path="/work/ai-ghost" element={<WorkAiGhost />} />
            <Route path="/work/parallel-scheduler" element={<WorkParallel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageShell>
    </BrowserRouter>
  );
}
