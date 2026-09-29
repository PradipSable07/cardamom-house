import { Pill } from "@/components/ui/Pill";
import { ArrowRight, CardamomMark, Sparkle } from "@/components/ui/icons";
import { menuItemAnchor } from "@/features/menu/constants/anchors";
import type { TodaysSpecial } from "@/features/menu/types/status";
import { formatPrice } from "@/features/menu/utils/format";
import { DietaryTags } from "./DietaryTags";

export function SpecialCallout({ special }: { special: TodaysSpecial }) {
  return special.kind === "available" ? (
    <AvailableSpecial special={special} />
  ) : (
    <SoldOutSpecial special={special} />
  );
}

function AvailableSpecial({ special }: { special: Extract<TodaysSpecial, { kind: "available" }> }) {
  const { item, blurb } = special;

  return (
    <section
      aria-labelledby="special-heading"
      className="relative isolate overflow-hidden rounded-3xl bg-amber p-6 text-cream shadow-[0_24px_48px_-28px_rgb(146_64_14/0.75)] sm:p-8 print:shadow-none"
    >
      <CardamomMark className="pointer-events-none absolute -right-10 -bottom-14 -z-10 h-52 w-52 text-amber-deep/50" />

      <h2 id="special-heading">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
          <Sparkle className="h-3.5 w-3.5" />
          Today&rsquo;s special
        </span>
        <span className="mt-3 block font-display text-3xl leading-tight font-semibold text-balance sm:text-[2.125rem]">
          {item.name}
        </span>
      </h2>

      <p className="mt-3 text-[0.9375rem] leading-relaxed">{blurb}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-5">
        <div className="flex items-center gap-3">
          <p className="font-display text-2xl font-medium tabular-nums">{formatPrice(item.price)}</p>
          <DietaryTags tags={item.tags} tone="inverse" />
        </div>
        <a
          href={`#${menuItemAnchor(item.id)}`}
          className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-cream print:hidden px-5 text-sm font-semibold text-amber-deep shadow-sm transition-colors hover:bg-paper outline-cream"
        >
          Find it on the menu
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}

function SoldOutSpecial({ special }: { special: Extract<TodaysSpecial, { kind: "sold-out" }> }) {
  const { item, category } = special;

  return (
    <section
      aria-labelledby="special-heading"
      className="rounded-3xl border border-line bg-paper p-6 sm:p-8"
    >
      <h2 id="special-heading">
        <span className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.18em] text-amber-deep uppercase">
          <Sparkle className="h-3.5 w-3.5" />
          Today&rsquo;s special
          <Pill tone="neutral" className="tracking-wide normal-case">
            Sold out
          </Pill>
        </span>
        <span className="mt-3 block font-display text-3xl leading-tight font-semibold text-balance text-ink-mute sm:text-[2.125rem]">
          {item.name}
        </span>
      </h2>

      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
        Today&rsquo;s batch has gone &mdash; thank you, Lisbon. Everything else on the{" "}
        {category.name.toLowerCase()} menu is still cooking.
      </p>

      <a
        href={`#${category.id}`}
        className="group mt-6 inline-flex print:hidden min-h-11 items-center gap-2 rounded-full border-2 border-amber px-5 text-sm font-semibold text-amber-deep transition-colors hover:bg-amber hover:text-cream"
      >
        See the rest of {category.name}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </section>
  );
}
