# Architecture

Proportional to the task: one route, local data, one small client component. No state library, no data-fetching layer, no component library.

## Product & UX analysis

| Question | Answer |
| --- | --- |
| Primary user | Someone on the pavement outside, on a phone, deciding whether to walk in |
| Primary goal | "Are they open, and what's good?" — then scan dishes and prices |
| Visual dominance | 1. Café name + open/closed status · 2. Today's special (or closed banner) · 3. Menu · 4. Hours · 5. Contact |
| Navigation | Single page. Sticky category nav (horizontal on mobile, vertical sidebar on desktop). Skip link to the menu. |
| Interaction model | Read-only. No create/edit/delete/search/sort. Interactions: jump to category, jump to the special, tap phone/Instagram/address links, switch demo state. |
| Primary CTA | "Find it on the menu" on the special (jumps to the dish) |

UI states that exist here:

| State | Where |
| --- | --- |
| Populated | Default — all data is local |
| Open / closed / closing boundaries | Hero status pill, closed banner, hours block |
| Special available / sold out / missing | Special callout, menu item row |
| Empty sub-states | Category without description, item without description or tags |
| Loading, API error, validation, confirmation, destructive | Do not exist — no network, no forms, no mutations |

## Layers

```text
next.config.ts rewrites (?state= → /state/[state])
    ↓
app/page.tsx · app/state/[state]/page.tsx   (static, prerendered per state)
    ↓
features/menu/components/MenuPage.tsx       (composes the page for one DemoState)
    ↓
features/menu/components/*   (presentational, typed props, server-rendered)
    │   └── CategoryNav      (the only Client Component: scroll-spy)
    ↓
features/menu/*.ts           (pure domain logic — unit tested)
    scenario.ts   ?state= → simulated Lisbon time + sold-out ids
    hours.ts      parse hours strings, open/closed status, next opening
    special.ts    resolve today's special by id + availability
    format.ts     € prices, times
    ↓
features/menu/menu-data.ts   (typed load + normalisation of the JSON)
    ↓
data/menu.json               (mock data from the brief, verbatim)
```

## Folder structure

```text
src/
├── app/
│   ├── layout.tsx       fonts, metadata, viewport
│   ├── page.tsx         static default state
│   ├── state/[state]/   prerendered non-default states (reached via rewrites)
│   ├── globals.css      Tailwind v4 @theme tokens, base, print, motion
│   └── icon.svg
├── components/ui/
│   ├── Pill.tsx         the one shared primitive (tags, sold-out, today)
│   └── icons.tsx        decorative SVGs (cardamom mark, arrows, moon, sparkle)
├── data/
│   └── menu.json
└── features/menu/
    ├── types.ts
    ├── menu-data.ts
    ├── scenario.ts  hours.ts  special.ts  format.ts   (+ *.test.ts)
    ├── anchors.ts       in-page anchor ids shared by links and targets
    └── components/
        MenuPage, Hero, ClosedBanner, SpecialCallout, CategoryNav, MenuSection,
        MenuItemRow, DietaryTags, HoursBlock, SiteFooter, DemoStateSwitcher
```

## State strategy

| Kind | Where it lives |
| --- | --- |
| Server state | None. Data is a static JSON import. |
| URL state | `?state=`: the single source of truth for the demo scenario. Resolved by rewrites in `next.config.ts` to a prerendered route. |
| Derived state | Open status, next opening, special availability, today's row — all computed from (data, scenario) during render. Nothing is copied into React state. |
| Local UI state | `activeCategoryId` inside `CategoryNav`, driven by an `IntersectionObserver`. |
| Global client state | None. |

## Data strategy

- The JSON is typed against a `RawMenu` interface at import, so a shape change fails `tsc`.
- `menu-data.ts` normalises once at module load: hours strings → `{ kind: "open", opens, closes }` in minutes, `"Closed"` → `{ kind: "closed" }`, tag codes → `"vegetarian" | "gluten-free" | "spicy"`, empty descriptions → `undefined`.
- Malformed hours or unknown tags throw with a descriptive message. The data is ours, so bad data is a bug; a unit test loads the real file so it fails in CI, not in production.

## Rendering strategy

- Every state is **static**. `next.config.ts` rewrites `/?state=closed` and `/?state=special-sold-out` to `/state/[state]`, which is prerendered with `generateStaticParams` (`dynamicParams = false`). `/` is the static default. No request runs server code, and TTFB is a CDN hit. (This supersedes the first version, which read `searchParams` and rendered on every request.)
- The only JavaScript shipped beyond the framework is the scroll-spy, 1.3 kB. Category links and demo-state links are plain anchors, so everything works without JS.
- Motion is CSS-only and never touches the LCP element (`<h1>`). See DECISIONS D15 and D17.

## Error handling

- Unknown `?state=` values match no rewrite and get `/` (open). A repeated param resolves to its last value, following Next’s matcher.
- Special pointing at a missing item → callout not rendered; the page still works.
- There is no fetch that can fail; Next's default error boundary covers unexpected render errors.

## Responsive strategy

Mobile-first. Below `lg`: single column, horizontally scrolling sticky category bar under the hero (active tab scrolls itself into view). At `lg`+: hero with the special beside it, a two-column body with a sticky vertical category sidebar, and wider measure.

## Accessibility strategy

Landmarks (`header`, `nav`, `main`, `section`, `footer`, `address`), one `h1`, `h2` per section, `h3` per dish. Skip link. Native anchors. `aria-current` on the active nav link, on the active demo state and (`date`) on today's hours row. A global `:focus-visible` ring in amber, switched to cream on amber and dark surfaces. Dietary codes have visible legends plus screen-reader full names. Colour never carries state alone (open/closed/sold-out/today are all written in words). Smooth scroll and entrance motion only apply under `prefers-reduced-motion: no-preference`.

## Testing strategy

Unit tests (Vitest) for the logic that can be wrong silently: hours parsing, open/closed status at boundaries, next-opening calculation across the week, `?state=` parsing, special resolution, € formatting, and that the real data file normalises. UI is verified in a real browser with screenshots at 360 / 768 / 1280 px, keyboard tab-through, and an axe scan.
