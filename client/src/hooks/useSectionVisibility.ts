import { useEffect, useRef, useState } from "react";

type VisibilityState = "far" | "near" | "active";

export function useSectionVisibility() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<VisibilityState>("active");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      setState("active");
      return;
    }

    const apply = (value: VisibilityState) =>
      setState((previous) => (previous === value ? previous : value));
    const observe = () => {
      const rect = element.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      apply(visible ? "active" : "far");
    };

    observe();
    window.addEventListener("scroll", observe, { passive: true });
    window.addEventListener("resize", observe);

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) apply("active");
          else observe();
        },
        { threshold: 0.01 },
      );
      observer.observe(element);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", observe);
      window.removeEventListener("resize", observe);
    };
  }, []);

  return { ref, state };
}
