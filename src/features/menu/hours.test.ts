import { describe, expect, it } from "vitest";
import { getOpenStatus, parseDayHours } from "./hours";
import type { LocalTime, WeeklyHours } from "./types";

const at = (day: LocalTime["day"], hhmm: string): LocalTime => {
  const [h, m] = hhmm.split(":").map(Number);
  return { day, minutes: (h ?? 0) * 60 + (m ?? 0) };
};

// The café's real week.
const week: WeeklyHours = {
  monday: { kind: "closed" },
  tuesday: parseDayHours("08:00 – 15:00"),
  wednesday: parseDayHours("08:00 – 15:00"),
  thursday: parseDayHours("08:00 – 15:00"),
  friday: parseDayHours("08:00 – 16:00"),
  saturday: parseDayHours("09:00 – 17:00"),
  sunday: parseDayHours("09:00 – 17:00"),
};

describe("parseDayHours", () => {
  it("parses the en-dash range used in the data", () => {
    expect(parseDayHours("08:00 – 15:00")).toEqual({ kind: "open", opens: 480, closes: 900 });
  });

  it("accepts a plain hyphen and no spaces", () => {
    expect(parseDayHours("9:30-17:00")).toEqual({ kind: "open", opens: 570, closes: 1020 });
  });

  it("treats Closed case-insensitively", () => {
    expect(parseDayHours(" closed ")).toEqual({ kind: "closed" });
  });

  it.each(["", "8am – 3pm", "08:00", "15:00 – 08:00", "08:00 – 08:00", "25:00 – 26:00", "08:75 – 15:00"])(
    "rejects %j",
    (value) => {
      expect(() => parseDayHours(value)).toThrow();
    },
  );
});

describe("getOpenStatus", () => {
  it("is open on Tuesday at 11:30 (the default demo time)", () => {
    expect(getOpenStatus(week, at("tuesday", "11:30"))).toEqual({ kind: "open", closesAt: 900 });
  });

  it("is open at exactly opening time", () => {
    expect(getOpenStatus(week, at("tuesday", "08:00")).kind).toBe("open");
  });

  it("is closed at exactly closing time and points to tomorrow", () => {
    expect(getOpenStatus(week, at("tuesday", "15:00"))).toEqual({
      kind: "closed",
      reason: "after-closing",
      next: { day: "wednesday", opensAt: 480, daysAway: 1 },
    });
  });

  it("before opening, points to later today", () => {
    expect(getOpenStatus(week, at("saturday", "08:30"))).toEqual({
      kind: "closed",
      reason: "before-opening",
      next: { day: "saturday", opensAt: 540, daysAway: 0 },
    });
  });

  it("on Monday (closed all day), points to Tuesday 08:00", () => {
    expect(getOpenStatus(week, at("monday", "11:30"))).toEqual({
      kind: "closed",
      reason: "closed-today",
      next: { day: "tuesday", opensAt: 480, daysAway: 1 },
    });
  });

  it("wraps from Sunday evening past closed Monday to Tuesday", () => {
    expect(getOpenStatus(week, at("sunday", "18:00"))).toMatchObject({
      reason: "after-closing",
      next: { day: "tuesday", daysAway: 2 },
    });
  });

  it("finds the same weekday next week when it is the only open day", () => {
    const onlyTuesday: WeeklyHours = { ...week, wednesday: { kind: "closed" }, thursday: { kind: "closed" }, friday: { kind: "closed" }, saturday: { kind: "closed" }, sunday: { kind: "closed" } };
    expect(getOpenStatus(onlyTuesday, at("tuesday", "16:00"))).toMatchObject({
      next: { day: "tuesday", daysAway: 7 },
    });
  });

  it("returns no next opening when closed every day", () => {
    const shut: WeeklyHours = Object.fromEntries(Object.keys(week).map((d) => [d, { kind: "closed" }])) as WeeklyHours;
    expect(getOpenStatus(shut, at("monday", "10:00"))).toEqual({ kind: "closed", reason: "closed-today", next: null });
  });
});
