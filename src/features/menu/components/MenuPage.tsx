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
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-cream focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to menu
      </a>
      <div aria-hidden="true" className="h-1.5 bg-amber print:mb-6" />

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
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 print:max-w-none print:px-0">
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
