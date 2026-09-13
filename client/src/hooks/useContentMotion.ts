import { useEffect, useRef } from "react";

/** Animate newly visible content without hiding it while waiting for JavaScript. */
export function useContentMotion(location: string) {
  const previousLocation = useRef(location);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const main = document.querySelector(".site-shell > main");
    if (previousLocation.current !== location)
      main?.classList.add("route-enter");
    previousLocation.current = location;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const animation = entry.target.animate(
            [
              { opacity: 0, translate: "0 32px" },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: 650,
              delay: Math.min(index, 3) * 80,
              easing: "cubic-bezier(.16, 1, .3, 1)",
              fill: "backwards",
            }
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" }
    );
    document
      .querySelectorAll(
        ".practice-item, .timeline li, .logbook-callout, .progress-detail section, .progress-detail #logs article"
      )
      .forEach(element => observer.observe(element));
    const stop = () => {
      main?.classList.remove("route-enter");
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const onMotionChange = () => {
      if (motion.matches) stop();
    };
    motion.addEventListener("change", onMotionChange);
    return () => {
      stop();
      motion.removeEventListener("change", onMotionChange);
    };
  }, [location]);
}
