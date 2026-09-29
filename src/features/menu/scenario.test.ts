import { describe, expect, it } from "vitest";
import { getOpenStatus } from "./hours";
import { menu } from "./menu-data";
import { getScenario, parseDemoState } from "./scenario";
import { resolveSpecial } from "./special";

describe("parseDemoState", () => {
  it.each([
    ["open", "open"],
    ["closed", "closed"],
    ["special-sold-out", "special-sold-out"],
    [undefined, "open"],
    ["", "open"],
    ["CLOSED", "open"],
    ["nonsense", "open"],
    [["closed", "open"], "closed"],
    [[], "open"],
  ] as const)("%j → %s", (input, expected) => {
    expect(parseDemoState(input as string | string[] | undefined)).toBe(expected);
  });
});

// The three states the brief asks for, end to end against the real data.
describe("demo states", () => {
  it("open: Tuesday 11:30, open until 15:00, special available", () => {
    const scenario = getScenario("open", menu);
    expect(scenario.now).toEqual({ day: "tuesday", minutes: 690 });
    expect(getOpenStatus(menu.restaurant.hours, scenario.now)).toEqual({ kind: "open", closesAt: 900 });
    expect(resolveSpecial(menu, scenario.soldOutItemIds)?.kind).toBe("available");
  });

  it("closed: a Monday, next opening Tuesday 08:00", () => {
    const scenario = getScenario("closed", menu);
    expect(scenario.now.day).toBe("monday");
    expect(getOpenStatus(menu.restaurant.hours, scenario.now)).toMatchObject({
      kind: "closed",
      reason: "closed-today",
      next: { day: "tuesday", opensAt: 480 },
    });
  });

  it("special-sold-out: open, and the Saffron French Toast is sold out", () => {
    const scenario = getScenario("special-sold-out", menu);
    expect(getOpenStatus(menu.restaurant.hours, scenario.now).kind).toBe("open");
    const special = resolveSpecial(menu, scenario.soldOutItemIds);
    expect(special?.kind).toBe("sold-out");
    expect(special?.item.name).toBe("Saffron French Toast");
    expect(scenario.soldOutItemIds.has("brunch_07")).toBe(true);
  });
});
