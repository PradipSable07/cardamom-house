import { describe, expect, it } from "vitest";
import { menu } from "@/features/menu/data/menu-data";
import { resolveSpecial } from "./special";

describe("resolveSpecial", () => {
  it("finds the special with its category", () => {
    const special = resolveSpecial(menu, new Set());
    expect(special).toMatchObject({ kind: "available", item: { id: "brunch_07" }, category: { id: "brunch" } });
  });

  it("returns null when the special is not on the menu", () => {
    expect(resolveSpecial({ ...menu, special: { itemId: "missing", blurb: "" } }, new Set())).toBeNull();
  });
});
