import type { MenuCategory } from "@/features/menu/types/menu";
import { MenuItemRow } from "./MenuItemRow";

interface MenuSectionProps {
  category: MenuCategory;
  specialItemId: string | null;
  soldOutItemIds: ReadonlySet<string>;
}

export function MenuSection({ category, specialItemId, soldOutItemIds }: MenuSectionProps) {
  const headingId = `${category.id}-heading`;

  return (
    <section id={category.id} aria-labelledby={headingId} className="mt-14 first:mt-8 print:mt-0 print:break-inside-avoid print:pt-4">
      <h2 id={headingId} className="font-display text-3xl font-semibold tracking-tight sm:text-4xl print:text-2xl">
        {category.name}
      </h2>
      <span aria-hidden="true" className="mt-4 block h-0.5 w-10 rounded-full bg-amber print:mt-1.5" />
      {category.description ? (
        <p className="mt-4 max-w-prose font-display text-lg text-ink-soft italic print:mt-1.5 print:text-base">{category.description}</p>
      ) : null}

      <ul className="mt-4 divide-y divide-line print:mt-1">
        {category.items.map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            isSpecial={item.id === specialItemId}
            isSoldOut={soldOutItemIds.has(item.id)}
          />
        ))}
      </ul>
    </section>
  );
}
