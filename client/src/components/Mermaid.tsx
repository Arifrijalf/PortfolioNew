import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { useTheme } from "@/contexts/ThemeContext";

const isDark = (theme: string) => theme === "dark";

// Module-level counter guarantees unique mermaid render IDs even when
// multiple diagrams render within the same millisecond.
let renderCounter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const target = ref.current;
      if (!target || !chart) return;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        fontFamily: "IBM Plex Mono",
        fontSize: 12,
        theme: isDark(theme) ? "dark" : "base",
        themeVariables: isDark(theme)
          ? {
              primaryColor: "#22221f",
              primaryTextColor: "#f2eee5",
              primaryBorderColor: "#e2592f",
              lineColor: "#e2592f",
              secondaryColor: "#171715",
              tertiaryColor: "#22221f",
            }
          : {
              primaryColor: "#f4f0e8",
              primaryTextColor: "#191917",
              primaryBorderColor: "#e2592f",
              lineColor: "#e2592f",
              secondaryColor: "#eae3d7",
              tertiaryColor: "#f4f0e8",
            },
      });
      try {
        renderCounter += 1;
        const { svg } = await mermaid.render(
          `_mermaid_${renderCounter}_${theme}`,
          chart
        );
        if (!cancelled && target) target.innerHTML = svg;
      } catch {
        if (!cancelled && target)
          target.innerHTML = `<pre style="white-space:pre-wrap">${chart}</pre>`;
      }
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [chart, theme]);

  return (
    <div className="mermaid-wrapper my-8 overflow-x-auto p-4 border border-[var(--line)] bg-[var(--paper-deep)]">
      <div ref={ref} className="flex justify-center" />
    </div>
  );
}
