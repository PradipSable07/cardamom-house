import { MENU_ANCHOR } from "@/features/menu/anchors";
import { CategoryNav } from "@/features/menu/components/CategoryNav";
import { ClosedBanner } from "@/features/menu/components/ClosedBanner";
import { DietaryLegend } from "@/features/menu/components/DietaryTags";
import { Hero } from "@/features/menu/components/Hero";
import { HoursBlock } from "@/features/menu/components/HoursBlock";
import { MenuSection } from "@/features/menu/components/MenuSection";
import { SiteFooter } from "@/features/menu/components/SiteFooter";
import { SpecialCallout } from "@/features/menu/components/SpecialCallout";
import { getOpenStatus } from "@/features/menu/hours";
import { menu } from "@/features/menu/menu-data";
import { getScenario, parseDemoState } from "@/features/menu/scenario";
import { resolveSpecial } from "@/features/menu/special";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const { state } = await searchParams;
  const scenario = getScenario(parseDemoState(state), menu);
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
