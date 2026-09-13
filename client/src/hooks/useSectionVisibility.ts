import { useEffect, useRef, useState } from "react";

type VisibilityState = "far" | "near" | "active";

export function useSectionVisibility() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<VisibilityState>("active");

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    // Reveal once: revisiting a section must not hide its content or controls.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    setState("far");
    const reveal = () => {
      setState("active");
      observer.disconnect();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: 0, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(element);
    const onMotionChange = () => {
      if (motion.matches) reveal();
    };
    motion.addEventListener("change", onMotionChange);
    element.addEventListener("focusin", reveal);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      element.removeEventListener("focusin", reveal);
    };
  }, []);

  return { ref, state };
}
