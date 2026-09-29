import { Pill, type PillTone } from "@/components/ui/Pill";
import type { DietaryTag } from "@/features/menu/types/menu";

const DIETARY: Record<DietaryTag, { code: string; label: string; tone: PillTone }> = {
  vegetarian: { code: "V", label: "Vegetarian", tone: "sage" },
  "gluten-free": { code: "GF", label: "Gluten-free", tone: "wheat" },
  spicy: { code: "Spicy", label: "Spicy", tone: "paprika" },
};

interface DietaryTagsProps {
  tags: DietaryTag[];
  /** Force every pill to one tone, e.g. `inverse` on an amber surface. */
  tone?: PillTone;
}

export function DietaryTags({ tags, tone }: DietaryTagsProps) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Dietary information">
      {tags.map((tag) => {
        const { code, label, tone: tagTone } = DIETARY[tag];
        return (
          <li key={tag}>
            <Pill tone={tone ?? tagTone}>
              {code === label ? (
                label
              ) : (
                <>
                  <span aria-hidden="true">{code}</span>
                  <span className="sr-only">{label}</span>
                </>
              )}
            </Pill>
          </li>
        );
      })}
    </ul>
  );
}

/** The key that explains V / GF, shown once above the menu. */
export function DietaryLegend() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft">
      {Object.values(DIETARY).map(({ code, label, tone }) =>
        code === label ? null : (
          <span key={code} className="inline-flex items-center gap-1.5">
            <Pill tone={tone}>{code}</Pill>
            {label}
          </span>
        ),
      )}
    </p>
  );
}
