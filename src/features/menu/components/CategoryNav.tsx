"use client";

import { useEffect, useRef, useState } from "react";

export interface CategoryNavLink {
  id: string;
  name: string;
  itemCount: number;
}

/**
 * A section counts as "current" once its heading passes under the sticky bar
 * and until it leaves the top ~45% of the viewport.
 */
const OBSERVER_MARGIN = "-96px 0px -55% 0px";

export function CategoryNav({ categories }: { categories: CategoryNavLink[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  // Scroll-spy: observe each section and highlight the first one in the band.
  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = categories.find((category) => visible.has(category.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: OBSERVER_MARGIN },
    );

    for (const { id } of categories) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [categories]);

  // On mobile the bar scrolls sideways: keep the active tab in view. Scrolling
  // the list itself (not scrollIntoView) never moves the page.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-category="${activeId}"]`);
    if (!list || !link || list.scrollWidth <= list.clientWidth) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({
      left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeId]);

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-0 z-30 -mx-5 border-b border-line bg-cream/95 backdrop-blur-md sm:-mx-8 lg:top-10 lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:backdrop-blur-none print:hidden"
    >
      <p className="mb-3 hidden text-xs font-semibold tracking-[0.18em] text-ink-mute uppercase lg:block">
        On the menu
      </p>
      <ul
        ref={listRef}
        className="no-scrollbar relative flex gap-1 overflow-x-auto px-3 py-1 sm:px-6 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:p-0"
      >
        {categories.map(({ id, name, itemCount }) => {
          const isActive = id === activeId;
          return (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                data-category={id}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActiveId(id)}
                className={`relative flex min-h-12 items-center gap-3 rounded-md px-3 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors focus-visible:outline-offset-[-2px] lg:min-h-11 lg:rounded-none lg:rounded-r-md lg:border-l-2 lg:pl-4 ${
                  isActive
                    ? "text-amber-deep after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-amber lg:border-amber lg:bg-amber-wash lg:after:hidden"
                    : "text-ink-soft hover:text-amber-deep lg:border-line lg:hover:border-amber/50"
                }`}
              >
                {name}
                <span aria-hidden="true" className="ml-auto hidden text-xs font-medium text-ink-mute tabular-nums lg:inline">
                  {itemCount}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
