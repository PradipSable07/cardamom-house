import type { ReactNode } from "react";

const TONES = {
  sage: "bg-sage-wash text-sage",
  wheat: "bg-wheat-wash text-wheat",
  paprika: "bg-paprika-wash text-paprika",
  // Cream on amber is 4.7:1 — fine for this bold label size, and it stays visible on amber-wash rows.
  solid: "bg-amber text-cream",
  neutral: "bg-oat text-ink-soft ring-1 ring-inset ring-line",
  // For use on amber surfaces: cream on amber-deep is 6.6:1.
  inverse: "bg-amber-deep text-cream",
} as const;

export type PillTone = keyof typeof TONES;

interface PillProps {
  tone: PillTone;
  children: ReactNode;
  className?: string;
}

export function Pill({ tone, children, className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] leading-4 font-semibold tracking-wide ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
