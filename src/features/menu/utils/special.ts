import type { Menu } from "@/features/menu/types/menu";
import type { TodaysSpecial } from "@/features/menu/types/status";

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
