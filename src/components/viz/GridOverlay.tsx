/**
 * Subtle technical grid — CSS only, lightweight.
 * Feel: lab bench, not neon.
 */
export function GridOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-grid opacity-[0.035] ${className}`}
      style={{ backgroundSize: "40px 40px" }}
    />
  );
}

export function Vignette({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -10%, rgba(232,184,106,0.08), transparent 60%), radial-gradient(900px 500px at 85% 30%, rgba(61,210,204,0.06), transparent 60%)",
      }}
    />
  );
}
