import { describe, expect, it } from "vitest";
import { describeNextOpening, formatPrice, formatTime } from "./format";

describe("formatPrice", () => {
  it.each([
    [11.5, "€11.50"],
    [1.8, "€1.80"],
    [14.2, "€14.20"],
    [0, "€0.00"],
    [1234.5, "€1,234.50"],
  ])("%d → %s", (amount, expected) => {
    expect(formatPrice(amount)).toBe(expected);
  });
});

describe("formatTime", () => {
  it("pads to 24-hour HH:MM", () => {
    expect(formatTime(480)).toBe("08:00");
    expect(formatTime(17 * 60 + 5)).toBe("17:05");
  });
});

describe("describeNextOpening", () => {
  it("phrases later today, tomorrow and further out", () => {
    expect(describeNextOpening({ day: "saturday", opensAt: 540, daysAway: 0 })).toBe("today from 09:00");
    expect(describeNextOpening({ day: "tuesday", opensAt: 480, daysAway: 1 })).toBe("tomorrow, Tuesday, from 08:00");
    expect(describeNextOpening({ day: "tuesday", opensAt: 480, daysAway: 2 })).toBe("on Tuesday from 08:00");
  });
});
