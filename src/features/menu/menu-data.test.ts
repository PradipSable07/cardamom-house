import { describe, expect, it } from "vitest";
import { menu, normaliseMenu } from "./menu-data";
import { resolveSpecial } from "./special";
import type { RawMenu } from "./types";

describe("menu data", () => {
  it("normalises the real data file", () => {
    expect(menu.restaurant.hours.monday).toEqual({ kind: "closed" });
    expect(menu.restaurant.hours.friday).toEqual({ kind: "open", opens: 480, closes: 960 });
    expect(menu.categories.map((c) => c.id)).toEqual(["brunch", "sandwiches", "drinks", "sides"]);
  });

  it("maps tag codes to named dietary tags", () => {
    const halloumi = menu.categories[1]?.items.find((i) => i.id === "sand_05");
    expect(halloumi?.tags).toEqual(["vegetarian", "spicy"]);
  });

  it("treats the empty Sides description and missing item descriptions as absent", () => {
    const sides = menu.categories.find((c) => c.id === "sides");
    expect(sides?.description).toBeUndefined();
    expect(sides?.items.every((i) => i.description === undefined)).toBe(true);
  });

  it("has unique item ids, so the special and anchors are unambiguous", () => {
    const ids = menu.categories.flatMap((c) => c.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("rejects unknown tags", () => {
    const raw: RawMenu = {
      restaurant: { name: "", tagline: "", address: "", brand_color: "", phone: "", instagram: "",
        hours: { monday: "Closed", tuesday: "Closed", wednesday: "Closed", thursday: "Closed", friday: "Closed", saturday: "Closed", sunday: "Closed" } },
      today_special: { item_id: "x", blurb: "" },
      categories: [{ id: "c", name: "C", description: "", items: [{ id: "x", name: "X", price: 1, tags: ["vegan"] }] }],
    };
    expect(() => normaliseMenu(raw)).toThrow(/Unknown dietary tag "vegan"/);
  });
});

describe("resolveSpecial", () => {
  it("finds the special with its category", () => {
    const special = resolveSpecial(menu, new Set());
    expect(special).toMatchObject({ kind: "available", item: { id: "brunch_07" }, category: { id: "brunch" } });
  });

  it("returns null when the special is not on the menu", () => {
    expect(resolveSpecial({ ...menu, special: { itemId: "missing", blurb: "" } }, new Set())).toBeNull();
  });
});
