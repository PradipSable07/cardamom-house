/** Shape of `data/menu.json` exactly as the brief supplies it. */
export interface RawMenu {
  restaurant: {
    name: string;
    tagline: string;
    address: string;
    hours: Record<Weekday, string>;
    brand_color: string;
    phone: string;
    instagram: string;
  };
  today_special: { item_id: string; blurb: string };
  categories: RawCategory[];
}

interface RawCategory {
  id: string;
  name: string;
  description: string;
  items: RawItem[];
}

interface RawItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  tags: string[];
}

/** Monday-first: the order the week is displayed in. */
export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

/** Opening and closing times are minutes since midnight, Lisbon time. */
export type DayHours =
  | { kind: "closed" }
  | { kind: "open"; opens: number; closes: number };

export type WeeklyHours = Record<Weekday, DayHours>;

export type DietaryTag = "vegetarian" | "gluten-free" | "spicy";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  /** EUR */
  price: number;
  tags: DietaryTag[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface Restaurant {
  name: string;
  tagline: string;
  address: string;
  hours: WeeklyHours;
  phone: string;
  instagram: string;
}

export interface Menu {
  restaurant: Restaurant;
  special: { itemId: string; blurb: string };
  categories: MenuCategory[];
}

/** A point in the café's week, in Lisbon local time. */
export interface LocalTime {
  day: Weekday;
  /** Minutes since midnight. */
  minutes: number;
}
