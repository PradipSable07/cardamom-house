import rawMenuJson from "@/data/menu.json";
import { parseDayHours } from "./hours";
import type { DietaryTag, Menu, RawMenu, WeeklyHours } from "./types";

const TAG_CODES: Record<string, DietaryTag> = {
  v: "vegetarian",
  gf: "gluten-free",
  spicy: "spicy",
};

function parseTag(code: string): DietaryTag {
  const tag = TAG_CODES[code.trim().toLowerCase()];
  if (!tag) throw new Error(`Unknown dietary tag "${code}"`);
  return tag;
}

/** Empty strings in the data mean "no description". */
function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function normaliseMenu(raw: RawMenu): Menu {
  const h = raw.restaurant.hours;
  const hours: WeeklyHours = {
    monday: parseDayHours(h.monday),
    tuesday: parseDayHours(h.tuesday),
    wednesday: parseDayHours(h.wednesday),
    thursday: parseDayHours(h.thursday),
    friday: parseDayHours(h.friday),
    saturday: parseDayHours(h.saturday),
    sunday: parseDayHours(h.sunday),
  };

  return {
    restaurant: {
      name: raw.restaurant.name,
      tagline: raw.restaurant.tagline,
      address: raw.restaurant.address,
      phone: raw.restaurant.phone,
      instagram: raw.restaurant.instagram,
      hours,
    },
    special: { itemId: raw.today_special.item_id, blurb: raw.today_special.blurb },
    categories: raw.categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: optionalText(category.description),
      items: category.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: optionalText(item.description),
        price: item.price,
        tags: item.tags.map(parseTag),
      })),
    })),
  };
}

// Annotating the import checks the JSON's shape at compile time.
const rawMenu: RawMenu = rawMenuJson;

export const menu: Menu = normaliseMenu(rawMenu);
