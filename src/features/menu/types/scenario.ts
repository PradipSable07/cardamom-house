import type { DEMO_STATES } from "@/features/menu/constants/demo-states";
import type { LocalTime } from "@/features/menu/types/menu";

export type DemoState = (typeof DEMO_STATES)[number];

/** Everything about "right now" that the page depends on. */
export interface Scenario {
  state: DemoState;
  now: LocalTime;
  soldOutItemIds: ReadonlySet<string>;
}
