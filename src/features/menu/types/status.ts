import type { MenuCategory, MenuItem, Weekday } from "@/features/menu/types/menu";

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

export type TodaysSpecial =
  | { kind: "available"; item: MenuItem; category: MenuCategory; blurb: string }
  | { kind: "sold-out"; item: MenuItem; category: MenuCategory };
