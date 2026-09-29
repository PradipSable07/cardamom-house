/** In-page anchor ids, shared by the links and the elements they target. */
export const MENU_ANCHOR = "menu";
export const HOURS_ANCHOR = "hours";

export function menuItemAnchor(itemId: string): string {
  return `item-${itemId}`;
}
