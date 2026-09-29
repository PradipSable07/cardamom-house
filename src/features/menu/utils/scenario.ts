import { DEMO_STATES } from "@/features/menu/constants/demo-states";
import type { LocalTime, Menu } from "@/features/menu/types/menu";
import type { DemoState, Scenario } from "@/features/menu/types/scenario";

const TUESDAY_1130: LocalTime = { day: "tuesday", minutes: 11 * 60 + 30 };
const MONDAY_1130: LocalTime = { day: "monday", minutes: 11 * 60 + 30 };

export function isDemoState(value: string): value is DemoState {
  return (DEMO_STATES as readonly string[]).includes(value);
}

export function getScenario(state: DemoState, menu: Menu): Scenario {
  switch (state) {
    case "open":
      return { state, now: TUESDAY_1130, soldOutItemIds: new Set() };
    case "closed":
      return { state, now: MONDAY_1130, soldOutItemIds: new Set() };
    case "special-sold-out":
      return { state, now: TUESDAY_1130, soldOutItemIds: new Set([menu.special.itemId]) };
  }
}
