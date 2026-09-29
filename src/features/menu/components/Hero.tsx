import type { ReactNode } from "react";
import { ArrowDown, CardamomMark } from "@/components/ui/icons";
import { HOURS_ANCHOR } from "../anchors";
import { formatTime } from "../format";
import type { OpenStatus } from "../hours";

interface HeroProps {
  name: string;
  tagline: string;
  status: OpenStatus;
  /** Today's special or the closed banner. */
  aside: ReactNode;
}

export function Hero({ name, tagline, status, aside }: HeroProps) {
  return (
    <header className="relative overflow-hidden">
      <CardamomMark className="pointer-events-none absolute print:hidden -top-16 -right-24 h-96 w-96 text-amber/6 sm:-right-10 lg:-top-20 lg:-right-16" />

      <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-10 sm:px-8 sm:pt-16 lg:grid lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end lg:gap-16 lg:pt-24 lg:pb-16 print:max-w-none print:px-0 print:pt-0 print:pb-4">
        <div>
          <CardamomMark className="enter h-10 w-10 text-amber print:hidden" />
          <h1 className="enter mt-6 print:mt-0 font-display text-[3.25rem] leading-[0.95] font-semibold tracking-tight text-balance [--enter-delay:60ms] sm:text-7xl lg:text-[5.5rem] print:text-5xl">
            {name}
          </h1>
          <p className="enter mt-4 print:mt-1 max-w-xl font-display text-xl text-pretty text-ink-soft italic [--enter-delay:120ms] sm:text-2xl">
            {tagline}
          </p>
          <div className="enter mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 [--enter-delay:180ms] print:hidden">
            <OpenStatusBadge status={status} />
            <a
              href={`#${HOURS_ANCHOR}`}
              className="group inline-flex min-h-11 items-center gap-1.5 text-sm print:hidden font-semibold text-amber-deep underline decoration-amber/40 decoration-2 underline-offset-4 transition-colors hover:text-amber hover:decoration-amber"
            >
              Opening hours
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>

        {aside ? <div className="enter mt-8 [--enter-delay:240ms] lg:mt-0 print:hidden">{aside}</div> : null}
      </div>
    </header>
  );
}

function OpenStatusBadge({ status }: { status: OpenStatus }) {
  if (status.kind === "open") {
    return (
      <p className="inline-flex items-center gap-2.5 rounded-full bg-sage-wash px-4 py-2 text-sm font-semibold text-sage">
        <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
        Open now
        <span className="font-normal">· until {formatTime(status.closesAt)}</span>
      </p>
    );
  }

  const label =
    status.reason === "before-opening" && status.next
      ? `Opens today at ${formatTime(status.next.opensAt)}`
      : status.reason === "after-closing"
        ? "Closed for today"
        : "Closed today";

  return (
    <p className="inline-flex items-center gap-2.5 rounded-full bg-oat px-4 py-2 text-sm font-semibold text-ink-soft ring-1 ring-line ring-inset">
      <span className="h-2 w-2 rounded-full border-[1.5px] border-ink-mute" aria-hidden="true" />
      {label}
    </p>
  );
}
