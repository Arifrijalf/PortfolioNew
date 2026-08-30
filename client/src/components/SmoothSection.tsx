import { type ReactNode, type RefObject, type HTMLAttributes } from "react";

interface SmoothSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ref: RefObject<HTMLDivElement | null>;
  state: "far" | "near" | "active";
}

export function SmoothSection({ children, ref, state, className = "", ...props }: SmoothSectionProps) {
  return (
    <div ref={ref} className={`smooth-section smooth-section--${state} ${className}`} {...props}>
      {children}
    </div>
  );
}
