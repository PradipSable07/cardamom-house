import type { SVGProps } from "react";

// Every icon here is decorative: meaning is always carried by adjacent text.
type IconProps = Omit<SVGProps<SVGSVGElement>, "aria-hidden">;

const base = { "aria-hidden": true, focusable: false } as const;

/** A cardamom pod: the café's mark. */
export function CardamomMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...base} {...props}>
      <g transform="rotate(35 16 16)">
        <path d="M16 2.5c6.2 4.6 6.2 22.4 0 27-6.2-4.6-6.2-22.4 0-27Z" fill="currentColor" />
        <path
          d="M16 5.5c1.9 4.8 1.9 16.2 0 21"
          stroke="var(--color-cream)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path d="M16 2.5V0.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...base} {...props}>
      <path
        d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...base} {...props}>
      <path
        d="M10 4v11m-4.5-4.5L10 15l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Moon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...base} {...props}>
      <path
        d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...base} {...props}>
      <path d="M8 .5C8.6 5.2 10.8 7.4 15.5 8 10.8 8.6 8.6 10.8 8 15.5 7.4 10.8 5.2 8.6.5 8 5.2 7.4 7.4 5.2 8 .5Z" />
    </svg>
  );
}
