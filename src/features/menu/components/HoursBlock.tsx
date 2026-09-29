import { Pill } from "@/components/ui/Pill";
import { HOURS_ANCHOR } from "../anchors";
import { describeNextOpening, formatTime, formatWeekday } from "../format";
import type { OpenStatus } from "../hours";
import { WEEKDAYS, type Weekday, type WeeklyHours } from "../types";

interface HoursBlockProps {
  hours: WeeklyHours;
  today: Weekday;
  status: OpenStatus;
}

function statusSummary(status: OpenStatus): string {
  if (status.kind === "open") return `Open today until ${formatTime(status.closesAt)}.`;
  if (!status.next) return "Closed for now.";
  return status.reason === "before-opening"
    ? `Opening ${describeNextOpening(status.next)}.`
    : `Closed today. Back ${describeNextOpening(status.next)}.`;
}

export function HoursBlock({ hours, today, status }: HoursBlockProps) {
  return (
    <section
      id={HOURS_ANCHOR}
      aria-labelledby="hours-heading"
      className="mx-auto mt-20 max-w-6xl px-5 sm:px-8 lg:mt-28 print:mt-4 print:max-w-none print:break-inside-avoid print:px-0"
    >
      <div className="rounded-3xl bg-paper p-6 ring-1 ring-line sm:p-10 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:gap-12 print:grid print:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] print:gap-8 print:p-0 print:ring-0">
        <div>
          <h2 id="hours-heading" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl print:text-2xl">
            Opening hours
          </h2>
          <span aria-hidden="true" className="mt-4 block h-0.5 w-10 rounded-full bg-amber" />
          <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-balance print:hidden">{statusSummary(status)}</p>
        </div>

        <table className="mt-8 w-full border-collapse text-[0.9375rem] md:mt-0">
          <caption className="sr-only">Opening hours, Monday to Sunday</caption>
          <tbody>
            {WEEKDAYS.map((day) => {
              const dayHours = hours[day];
              const isToday = day === today;
              const isClosed = dayHours.kind === "closed";
              return (
                <tr
                  key={day}
                  aria-current={isToday ? "date" : undefined}
                  className={`border-b border-line last:border-b-0 print:border-0 ${isToday ? "bg-amber-wash" : ""}`}
                >
                  <th
                    scope="row"
                    className={`relative py-3 pr-4 pl-4 text-left print:py-0.5 ${isToday ? "font-semibold before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-amber" : "font-normal"} ${isClosed ? "text-ink-mute" : ""}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {formatWeekday(day)}
                      {isToday ? <Pill tone="solid">Today</Pill> : null}
                    </span>
                  </th>
                  <td
                    className={`py-3 pr-4 text-right tabular-nums print:py-0.5 ${isClosed ? "text-ink-mute italic" : isToday ? "font-semibold" : ""}`}
                  >
                    {dayHours.kind === "closed"
                      ? "Closed"
                      : `${formatTime(dayHours.opens)} – ${formatTime(dayHours.closes)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
