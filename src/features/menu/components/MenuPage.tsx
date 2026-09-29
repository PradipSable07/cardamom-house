import { MENU_ANCHOR } from "@/features/menu/constants/anchors";
import { menu } from "@/features/menu/data/menu-data";
import type { DemoState } from "@/features/menu/types/scenario";
import { getOpenStatus } from "@/features/menu/utils/hours";
import { getScenario } from "@/features/menu/utils/scenario";
import { resolveSpecial } from "@/features/menu/utils/special";
import { CategoryNav } from "./CategoryNav";
import { ClosedBanner } from "./ClosedBanner";
import { DietaryLegend } from "./DietaryTags";
import { Hero } from "./Hero";
import { HoursBlock } from "./HoursBlock";
import { MenuSection } from "./MenuSection";
import { SiteFooter } from "./SiteFooter";
import { SpecialCallout } from "./SpecialCallout";

/** The whole page for one demo state. Rendered at build time for every state. */
export function MenuPage({ state }: { state: DemoState }) {
  const scenario = getScenario(state, menu);
  const { restaurant, categories } = menu;

  const status = getOpenStatus(restaurant.hours, scenario.now);
  // No "today's special" on a day the kitchen isn't cooking.
  const special = status.kind === "open" ? resolveSpecial(menu, scenario.soldOutItemIds) : null;

  return (
    <>
      <a
        href={`#${MENU_ANCHOR}`}
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-cream focus:not-sr-only focus:fixed focus:top-[calc(1rem+var(--safe-top))] focus:left-(--gutter-left)"
      >
        Skip to menu
      </a>
      {/* The amber brand strip. On notched phones it also fills the status-bar
          area; the fixed copy keeps that area amber once the page scrolls, so
          content never shows behind the camera cut-out. Both are 0-height
          extras on devices without one. */}
      <div aria-hidden="true" className="h-[calc(0.375rem+var(--safe-top))] bg-amber print:mb-6 print:h-1.5" />
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-(--safe-top) bg-amber print:hidden" />

      <Hero
        name={restaurant.name}
        tagline={restaurant.tagline}
        status={status}
        aside={
          status.kind === "closed" ? (
            <ClosedBanner status={status} />
          ) : special ? (
            <SpecialCallout special={special} />
          ) : null
        }
      />

      <main>
        <div className="mx-auto max-w-6xl pl-(--gutter-left) pr-(--gutter-right) lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 print:max-w-none print:px-0">
          <CategoryNav
            categories={categories.map(({ id, name, items }) => ({ id, name, itemCount: items.length }))}
          />

          <div id={MENU_ANCHOR} tabIndex={-1} className="pt-6 outline-none lg:max-w-2xl lg:pt-0 print:max-w-none print:columns-2 print:gap-12 print:pt-0">
            <DietaryLegend />
            {categories.map((category) => (
              <MenuSection
                key={category.id}
                category={category}
                specialItemId={special?.item.id ?? null}
                soldOutItemIds={scenario.soldOutItemIds}
              />
            ))}
          </div>
        </div>

        <HoursBlock hours={restaurant.hours} today={scenario.now.day} status={status} />
      </main>

      <SiteFooter restaurant={restaurant} demoState={scenario.state} simulatedNow={scenario.now} />
    </>
  );
}
