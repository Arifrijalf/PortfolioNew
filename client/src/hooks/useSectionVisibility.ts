import { useEffect, useRef, useState } from "react";

type VisibilityState = "far" | "near" | "active";

export function useSectionVisibility(rootMargin = "-15% 0px -15% 0px") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<VisibilityState>("near");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      setState("active");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        if (ratio > 0.3) setState("active");
        else if (ratio > 0) setState("near");
        else setState("far");
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1], rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, state };
}
