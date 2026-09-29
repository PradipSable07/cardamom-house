import { describe, expect, it } from "vitest";
import { describeNextOpening, formatPrice, formatTime, toInstagramUrl, toMapsUrl, toTelHref } from "./format";

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

describe("contact links", () => {
  it("builds a dialable tel: href", () => {
    expect(toTelHref("+351 21 123 4567")).toBe("tel:+351211234567");
  });

  it("builds an Instagram profile URL from the handle", () => {
    expect(toInstagramUrl("@cardamomhouse")).toBe("https://www.instagram.com/cardamomhouse/");
  });

  it("encodes the address for a maps search", () => {
    expect(toMapsUrl("Rua da Boavista 84, 1200-066 Lisboa")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Rua%20da%20Boavista%2084%2C%201200-066%20Lisboa",
    );
  });
});
