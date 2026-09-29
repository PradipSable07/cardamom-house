import type { LocalTime, Menu } from "./types";

export const DEMO_STATES = ["open", "closed", "special-sold-out"] as const;

export type DemoState = (typeof DEMO_STATES)[number];

const DEFAULT_DEMO_STATE: DemoState = "open";

export const DEMO_STATE_LABELS: Record<DemoState, string> = {
  open: "Open",
  closed: "Closed",
  "special-sold-out": "Special sold out",
};

/** Everything about "right now" that the page depends on. */
export interface Scenario {
  state: DemoState;
  now: LocalTime;
  soldOutItemIds: ReadonlySet<string>;
}

const TUESDAY_1130: LocalTime = { day: "tuesday", minutes: 11 * 60 + 30 };
const MONDAY_1130: LocalTime = { day: "monday", minutes: 11 * 60 + 30 };

function isDemoState(value: string): value is DemoState {
  return (DEMO_STATES as readonly string[]).includes(value);
}

/** Missing, unknown or repeated `?state=` values fall back to the default. */
export function parseDemoState(value: string | string[] | undefined): DemoState {
  const first = Array.isArray(value) ? value[0] : value;
  return first !== undefined && isDemoState(first) ? first : DEFAULT_DEMO_STATE;
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
