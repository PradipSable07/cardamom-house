import { formatTime, formatWeekday } from "../format";
import { DEMO_STATE_LABELS, DEMO_STATES, type DemoState } from "../scenario";
import type { LocalTime } from "../types";

interface DemoStateSwitcherProps {
  current: DemoState;
  simulatedNow: LocalTime;
}

/** Reviewer tooling, deliberately kept apart from the customer-facing page. */
export function DemoStateSwitcher({ current, simulatedNow }: DemoStateSwitcherProps) {
  return (
    <div className="border-t border-cream/15 print:hidden">
      <nav
        aria-label="Demo states"
        className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8"
      >
        <p className="text-cream-mute">
          Demo &middot; simulated time {formatWeekday(simulatedNow.day)} {formatTime(simulatedNow.minutes)},
          Lisbon
        </p>
        <ul className="flex flex-wrap gap-2">
          {DEMO_STATES.map((state) => {
            const isCurrent = state === current;
            return (
              <li key={state}>
                {/* A plain link: every state is a static page, so a full load is
                    instant and needs no client router code or prefetching. */}
                <a
                  href={`/?state=${state}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 font-semibold transition-colors outline-amber-glow ${
                    isCurrent
                      ? "bg-cream text-espresso"
                      : "text-cream ring-1 ring-cream/25 ring-inset hover:bg-cream/10 hover:ring-cream/50"
                  }`}
                >
                  {DEMO_STATE_LABELS[state]}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
