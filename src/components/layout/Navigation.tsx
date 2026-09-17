import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "../../data/navigation";
import { useActiveSection } from "../../hooks/useActiveSection";
import { cn } from "../../lib/cn";
import { scrollToId } from "../../lib/scroll";

export function Navigation() {
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const h = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Body scroll lock + focus trap affordance
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) {
      // focus close button after open
      window.setTimeout(() => closeBtnRef.current?.focus(), 60);
    } else {
      openBtnRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ESC to close, and focus stays inside when open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Keyboard nav: Home/End to jump sections
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Home" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        scrollToId("hero");
      }
      if (e.key === "End" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        scrollToId("contact");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-all",
          scrolled
            ? "bg-ink-900/85 backdrop-blur-xl border-line shadow-[0_4px_24px_-8px_rgba(0,0,0,0.8)]"
            : "bg-ink-900/0 border-transparent backdrop-blur-none"
        )}
        role="banner"
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-shell items-center justify-between gap-6 px-6 py-4 lg:px-8"
        >
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("hero");
            }}
            className="group flex items-center gap-3 focus-visible:outline-none"
            aria-label="Advaith Kashyap — go to overview"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-ink-800 font-mono text-[11px] font-medium tracking-widest text-accent-amber"
              aria-hidden
            >
              AK
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-[13px] font-semibold tracking-tight text-text-primary group-hover:text-accent-amberSoft transition-colors">
                ADVAITH KASHYAP
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-text-muted uppercase">
                Systems × Edge × Architecture
              </span>
            </span>
          </a>

          {/* Desktop nav — active section is obvious via solid pill + aria-current */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(item.id);
                }}
                aria-current={active === item.id ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 font-mono text-2xs tracking-widest uppercase transition-colors focus-visible:outline-none",
                  active === item.id
                    ? "bg-accent-amber text-ink-900"
                    : "text-text-muted hover:text-text-primary hover:bg-ink-800"
                )}
              >
                <span className="opacity-60 mr-1.5 hidden xl:inline">{item.short}</span>
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-accent-amber/30 bg-accent-amber/10 px-4 py-2 font-mono text-2xs tracking-widest uppercase text-accent-amber hover:bg-accent-amber hover:text-ink-900 hover:border-accent-amber transition-colors focus-visible:outline-none"
            >
              <span className="hidden md:inline">Initialize contact</span>
              <span className="md:hidden">Contact</span>
              <span aria-hidden>→</span>
            </a>

            <button
              ref={openBtnRef}
              type="button"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-full border border-line bg-ink-800 text-text-secondary hover:text-text-primary hover:border-line-strong transition-colors focus-visible:outline-none"
            >
              <span className="sr-only">{mobileOpen ? "Close" : "Menu"}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform">
                {mobileOpen ? (
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <path d="M3 5H13M3 8H13M3 11H13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Subtle progress — doubles as laboratory trace */}
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-accent-amber/40 origin-left transition-transform duration-150"
          style={{ transform: `scaleX(${scrolled ? 1 : 0})` }}
          aria-hidden
        />
      </header>

      {/* Mobile drawer — intentional, not just collapsed desktop */}
      <div
        id="mobile-nav"
        aria-hidden={!mobileOpen}
        className={cn("fixed inset-0 z-30 lg:hidden transition", mobileOpen ? "visible" : "invisible pointer-events-none")}
      >
        <button
          type="button"
          aria-label="Close navigation"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink-900/70 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          className={cn(
            "absolute right-0 top-0 h-[100dvh] w-[86%] max-w-[360px] border-l border-line bg-ink-800 shadow-[-16px_0_40px_-12px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-line-soft">
            <span className="font-mono text-2xs tracking-[0.18em] uppercase text-text-muted">Navigation</span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setMobileOpen(false)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-line text-text-muted hover:text-text-primary hover:border-line-strong transition-colors focus-visible:outline-none"
              aria-label="Close menu"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
            {NAV_ITEMS.map((item, idx) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(item.id);
                  setMobileOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 border transition-colors focus-visible:outline-none",
                  active === item.id
                    ? "bg-accent-amber text-ink-900 border-amber-600/20"
                    : "bg-ink-700/50 border-line-soft text-text-primary hover:bg-ink-700 hover:border-line"
                )}
                aria-current={active === item.id ? "page" : undefined}
              >
                <span className="flex items-center gap-3">
                  <span className={cn("font-mono text-2xs tracking-widest", active === item.id ? "text-ink-900/60" : "text-text-muted")}>
                    {String(idx).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[15px] font-medium">{item.label}</span>
                </span>
                <span aria-hidden className="text-sm opacity-60">
                  →
                </span>
              </a>
            ))}
          </div>

          <div className="p-6 border-t border-line-soft space-y-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
                setMobileOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-amber px-6 py-3 font-mono text-xs tracking-widest uppercase text-ink-900 hover:bg-accent-amberSoft transition-colors focus-visible:outline-none"
            >
              Initialize contact <span aria-hidden>→</span>
            </a>
            <p className="text-center font-mono text-2xs tracking-widest uppercase text-text-muted">NIE Mysuru · Apr 2027 · Mysuru, IN</p>
          </div>
        </div>
      </div>
    </>
  );
}
