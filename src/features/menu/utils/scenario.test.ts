import { describe, expect, it } from "vitest";
import nextConfig from "../../../../next.config";
import { DEFAULT_DEMO_STATE, DEMO_STATES } from "@/features/menu/constants/demo-states";
import { menu } from "@/features/menu/data/menu-data";
import { getOpenStatus } from "./hours";
import { getScenario, isDemoState } from "./scenario";
import { resolveSpecial } from "./special";

describe("isDemoState", () => {
  it.each(["open", "closed", "special-sold-out"])("accepts %s", (value) => {
    expect(isDemoState(value)).toBe(true);
  });

  it.each(["", "CLOSED", "nonsense", "state"])("rejects %j", (value) => {
    expect(isDemoState(value)).toBe(false);
  });
});

describe("?state= routing", () => {
  it("rewrites every non-default state to its prerendered page", async () => {
    const rewrites = await nextConfig.rewrites?.();
    const beforeFiles = (rewrites && !Array.isArray(rewrites) && rewrites.beforeFiles) || [];
    const routed = beforeFiles.map((r) => [r.has?.[0]?.value, r.destination]);
    expect(routed).toEqual(
      DEMO_STATES.filter((s) => s !== DEFAULT_DEMO_STATE).map((s) => [s, `/state/${s}`]),
    );
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
