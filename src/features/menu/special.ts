import type { Menu, MenuCategory, MenuItem } from "./types";

export type TodaysSpecial =
  | { kind: "available"; item: MenuItem; category: MenuCategory; blurb: string }
  | { kind: "sold-out"; item: MenuItem; category: MenuCategory };

/** `null` when the special points at an item that isn't on the menu. */
export function resolveSpecial(
  menu: Menu,
  soldOutItemIds: ReadonlySet<string>,
): TodaysSpecial | null {
  for (const category of menu.categories) {
    const item = category.items.find((candidate) => candidate.id === menu.special.itemId);
    if (!item) continue;
    return soldOutItemIds.has(item.id)
      ? { kind: "sold-out", item, category }
      : { kind: "available", item, category, blurb: menu.special.blurb };
  }
  return null;
}
