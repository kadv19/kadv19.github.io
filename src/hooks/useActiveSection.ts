import { useEffect, useState } from "react";

export function useActiveSection(ids: string[], offset = 120): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry most near top that is intersecting
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Sort by bounding rect top (closest to viewport top wins)
        visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        const top = visible[0]?.target.id;
        if (top) setActive(top);
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids, offset]);

  return active;
}
