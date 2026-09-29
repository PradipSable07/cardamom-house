// Imported by next.config.ts, so this file must stay free of runtime imports
// (type-only imports are erased) and of `@/` aliases the config loader can't resolve.
import type { DemoState } from "../types/scenario";

export const DEMO_STATES = ["open", "closed", "special-sold-out"] as const;

export const DEFAULT_DEMO_STATE: DemoState = "open";

export const DEMO_STATE_LABELS: Record<DemoState, string> = {
  open: "Open",
  closed: "Closed",
  "special-sold-out": "Special sold out",
};
