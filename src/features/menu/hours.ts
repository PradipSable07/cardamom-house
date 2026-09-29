import { WEEKDAYS, type DayHours, type LocalTime, type Weekday, type WeeklyHours } from "./types";

const RANGE = /^(\d{1,2}):(\d{2})\s*[–—-]\s*(\d{1,2}):(\d{2})$/;

function toMinutes(hours: string, minutes: string): number {
  const h = Number(hours);
  const m = Number(minutes);
  if (h > 24 || m > 59) throw new Error(`Invalid time "${hours}:${minutes}"`);
  return h * 60 + m;
}

/** Parses `"Closed"` or `"08:00 – 15:00"` (en dash, hyphen or em dash). */
export function parseDayHours(value: string): DayHours {
  const trimmed = value.trim();
  if (trimmed.toLowerCase() === "closed") return { kind: "closed" };

  const match = RANGE.exec(trimmed);
  if (!match) throw new Error(`Unrecognised opening hours "${value}"`);

  const [, oh = "", om = "", ch = "", cm = ""] = match;
  const opens = toMinutes(oh, om);
  const closes = toMinutes(ch, cm);
  if (closes <= opens) throw new Error(`Closing time must be after opening time in "${value}"`);
  return { kind: "open", opens, closes };
}

export interface NextOpening {
  day: Weekday;
  opensAt: number;
  /** 0 = later today, 1 = tomorrow, … */
  daysAway: number;
}

export type OpenStatus =
  | { kind: "open"; closesAt: number }
  | {
      kind: "closed";
      reason: "closed-today" | "before-opening" | "after-closing";
      /** `null` only if the café is closed every day of the week. */
      next: NextOpening | null;
    };

function dayAfter(day: Weekday, offset: number): Weekday {
  const index = WEEKDAYS.indexOf(day);
  // The modulo keeps the index in range; the cast only satisfies noUncheckedIndexedAccess.
  return WEEKDAYS[(index + offset) % WEEKDAYS.length] as Weekday;
}

function findNextOpening(hours: WeeklyHours, from: Weekday): NextOpening | null {
  for (let daysAway = 1; daysAway <= WEEKDAYS.length; daysAway++) {
    const day = dayAfter(from, daysAway);
    const dayHours = hours[day];
    if (dayHours.kind === "open") return { day, opensAt: dayHours.opens, daysAway };
  }
  return null;
}

/** Open from `opens` (inclusive) until `closes` (exclusive). */
export function getOpenStatus(hours: WeeklyHours, now: LocalTime): OpenStatus {
  const today = hours[now.day];

  if (today.kind === "closed") {
    return { kind: "closed", reason: "closed-today", next: findNextOpening(hours, now.day) };
  }
  if (now.minutes < today.opens) {
    return {
      kind: "closed",
      reason: "before-opening",
      next: { day: now.day, opensAt: today.opens, daysAway: 0 },
    };
  }
  if (now.minutes < today.closes) {
    return { kind: "open", closesAt: today.closes };
  }
  return { kind: "closed", reason: "after-closing", next: findNextOpening(hours, now.day) };
}
