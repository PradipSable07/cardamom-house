import { CardamomMark } from "@/components/ui/icons";
import type { LocalTime, Restaurant } from "@/features/menu/types/menu";
import type { DemoState } from "@/features/menu/types/scenario";
import { toInstagramUrl, toMapsUrl, toTelHref } from "@/features/menu/utils/format";
import { DemoStateSwitcher } from "./DemoStateSwitcher";

interface SiteFooterProps {
  restaurant: Restaurant;
  demoState: DemoState;
  simulatedNow: LocalTime;
}

const linkClass =
  "font-semibold text-cream underline decoration-amber-glow/50 decoration-2 underline-offset-4 transition-colors hover:text-amber-glow hover:decoration-amber-glow outline-amber-glow print:text-ink print:no-underline";

export function SiteFooter({ restaurant, demoState, simulatedNow }: SiteFooterProps) {
  const addressLines = restaurant.address.split(",").map((line) => line.trim());

  return (
    <footer className="mt-20 bg-espresso text-cream lg:mt-28 print:mt-6 print:bg-transparent print:text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 pl-(--gutter-left) pr-(--gutter-right) py-14 md:grid-cols-3 md:py-16 print:max-w-none print:grid-cols-2 print:px-0 print:py-2">
        <div className="print:hidden">
          <CardamomMark className="h-8 w-8 text-amber-glow" />
          <p className="mt-4 font-display text-2xl font-semibold print:mt-0">{restaurant.name}</p>
          <p className="mt-1 font-display text-cream-mute italic print:text-ink-soft">{restaurant.tagline}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-cream-mute uppercase print:text-ink-soft">
            Find us
          </h2>
          <address className="mt-4 leading-relaxed not-italic">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a
            href={toMapsUrl(restaurant.address)}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 inline-flex min-h-11 items-center ${linkClass} print:hidden`}
          >
            Get directions
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-cream-mute uppercase print:text-ink-soft">
            Say hello
          </h2>
          <ul className="mt-2">
            <li>
              <a href={toTelHref(restaurant.phone)} className={`inline-flex min-h-11 items-center ${linkClass}`}>
                <span className="sr-only">Phone: </span>
                {restaurant.phone}
              </a>
            </li>
            <li>
              <a
                href={toInstagramUrl(restaurant.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center ${linkClass}`}
              >
                <span className="sr-only">Instagram: </span>
                {restaurant.instagram}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <DemoStateSwitcher current={demoState} simulatedNow={simulatedNow} />
    </footer>
  );
}
