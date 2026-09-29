import { Pill } from "@/components/ui/Pill";
import { Sparkle } from "@/components/ui/icons";
import { menuItemAnchor } from "@/features/menu/constants/anchors";
import type { MenuItem } from "@/features/menu/types/menu";
import { formatPrice } from "@/features/menu/utils/format";
import { DietaryTags } from "./DietaryTags";

interface MenuItemRowProps {
  item: MenuItem;
  /** Today's special — only set while the café is open. */
  isSpecial: boolean;
  isSoldOut: boolean;
}

export function MenuItemRow({ item, isSpecial, isSoldOut }: MenuItemRowProps) {
  const highlighted = isSpecial && !isSoldOut;

  return (
    <li
      id={menuItemAnchor(item.id)}
      className={
        highlighted
          ? "arrive-glow relative -mx-4 my-2 rounded-2xl border-transparent bg-amber-wash px-4 py-5 before:absolute before:inset-y-5 before:left-0 before:w-1 before:rounded-r-full before:bg-amber sm:-mx-5 sm:px-5 print:my-0.5 print:py-1.5"
          : "py-5 print:py-1.5"
      }
    >
      {isSpecial || isSoldOut ? (
        <p className="mb-1.5 flex flex-wrap items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.16em] text-amber-deep uppercase">
          {isSpecial ? (
            <span className="inline-flex items-center gap-1.5">
              <Sparkle className="h-3 w-3" />
              Today&rsquo;s special
            </span>
          ) : null}
          {isSoldOut ? (
            <Pill tone="neutral" className="tracking-wide normal-case">
              Sold out
            </Pill>
          ) : null}
        </p>
      ) : null}

      <div className="flex items-baseline gap-3">
        <h3
          className={`font-display text-lg leading-snug font-medium sm:text-xl ${isSoldOut ? "text-ink-mute" : ""}`}
        >
          {item.name}
        </h3>
        <span aria-hidden="true" className="min-w-6 flex-1 -translate-y-1 border-b border-dotted border-ink/25" />
        <p
          className={`shrink-0 font-medium tabular-nums ${isSoldOut ? "text-ink-mute" : "text-ink"}`}
        >
          {formatPrice(item.price)}
        </p>
      </div>

      {item.description ? (
        <p
          className={`mt-1.5 max-w-prose text-[0.9375rem] leading-relaxed print:mt-0.5 print:leading-snug ${isSoldOut ? "text-ink-mute" : "text-ink-soft"}`}
        >
          {item.description}
        </p>
      ) : null}

      {item.tags.length > 0 ? (
        <div className="mt-2.5 print:mt-1">
          <DietaryTags tags={item.tags} tone={isSoldOut ? "neutral" : undefined} />
        </div>
      ) : null}
    </li>
  );
}
