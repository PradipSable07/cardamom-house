import { Moon } from "@/components/ui/icons";
import { HOURS_ANCHOR } from "../anchors";
import { describeNextOpening } from "../format";
import type { OpenStatus } from "../hours";

type ClosedStatus = Extract<OpenStatus, { kind: "closed" }>;

const TITLES: Record<ClosedStatus["reason"], string> = {
  "closed-today": "We’re closed today",
  "after-closing": "We’ve closed for the day",
  "before-opening": "We’re not open just yet",
};

function nextOpeningCopy({ reason, next }: ClosedStatus): string {
  if (!next) return "Check back soon.";
  if (reason === "before-opening") return `Doors open ${describeNextOpening(next)}.`;
  return `Back ${describeNextOpening(next)}. The menu below is what we’ll be cooking.`;
}

export function ClosedBanner({ status }: { status: ClosedStatus }) {
  return (
    <section
      aria-labelledby="closed-heading"
      className="rounded-3xl bg-espresso p-6 text-cream shadow-[0_24px_48px_-28px_rgb(43_29_20/0.8)] sm:p-8 print:shadow-none"
    >
      <Moon className="h-7 w-7 text-amber-glow" />
      <h2 id="closed-heading" className="mt-4 font-display text-3xl leading-tight font-semibold sm:text-[2.125rem]">
        {TITLES[status.reason]}
      </h2>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-cream-mute">{nextOpeningCopy(status)}</p>
      <a
        href={`#${HOURS_ANCHOR}`}
        className="mt-6 inline-flex min-h-11 print:hidden items-center rounded-full bg-amber px-5 text-sm font-semibold text-cream transition-colors hover:bg-amber-deep outline-amber-glow"
      >
        See this week&rsquo;s hours
      </a>
    </section>
  );
}
