# Decisions

Short records of the calls that shaped the build. Each: context → options → choice → trade-off → when to revisit.

---

## D1. Render the demo state on the server from `searchParams`

- **Context:** The page must switch between three states via `?state=`.
- **Options:** (a) Server Component awaits `searchParams`; (b) static page + `useSearchParams` on the client; (c) middleware rewrites.
- **Choice:** (a).
- **Why:** HTML arrives already in the right state — no flash of the default state, no Suspense boundary, no client parsing. Keeps every component except the nav server-only.
- **Trade-off:** The route is dynamic (rendered per request) instead of static. On Vercel that costs a few ms; there's nothing to fetch.
- **Revisit if:** The page needs to be fully static/CDN-cached — then (b) with a small client island.

## D2. Each state pins a simulated Lisbon time

- **Context:** The brief allows "use the current time" or "hard-code Tuesday 11:30", and defines `closed` as "use a Monday".
- **Choice:** `open` and `special-sold-out` → Tuesday 11:30; `closed` → Monday 11:30. The open/closed logic is a pure function of `(hours, time)` and knows nothing about demo states.
- **Why:** A real clock would make the default `open` state show "closed" on Mondays and evenings, contradicting the brief. Keeping the logic generic means a real clock is a one-line change.
- **Trade-off:** The live site never reflects the actual time.
- **Revisit if:** This became a real café page → add `?state=live` / make it the default.

## D3. No "today's special" on a closed day

- **Context:** The brief doesn't say what the special does when the café is closed.
- **Choice:** The closed banner takes the special's slot; the in-menu "Today's special" marker is also hidden. The dish stays on the menu.
- **Why:** Advertising "Chef's pick today" on a day the kitchen is shut is misleading, and two competing callouts dilute the closed message.
- **Revisit if:** Kwill expects the special to remain visible — it's a one-line condition in `page.tsx`.

## D4. Sold-out special degrades, it doesn't disappear

- **Choice:** Callout drops the amber fill for a quiet paper card, adds a "Sold out" pill, mutes the dish name, and redirects to the rest of the category. In the menu the row is muted with a "Sold out" pill and neutral tags.
- **Why:** "Update gracefully" — the customer learns why it's missing and where to look next. Dimming uses a muted colour that still passes 4.5:1 rather than opacity, which would fail contrast.

## D5. Price formatting: `en-IE` → `€11.50`

- **Options:** `pt-PT` (`11,50 €`) or an English locale.
- **Choice:** `en-IE`.
- **Why:** The page copy is English; mixing Portuguese number conventions into English copy reads as an error to most visitors.
- **Revisit if:** A Portuguese-language version is added — format per locale.

## D6. Typography-led, no photography

- **Choice:** Fraunces (soft, warm serif with optical sizing) for display and dish names; DM Sans for body. Cream paper, espresso ink, amber accents, a cardamom-pod mark as the only illustration.
- **Why:** The brief explicitly allows it, and stock food photos are the fastest way to look like a template. Type and colour carry the café's character with zero image weight on a phone.
- **Trade-off:** Less appetite appeal than good photography.

## D7. One responsive `<nav>`, not separate mobile and desktop navs

- **Choice:** A single `CategoryNav` that is a sticky horizontal bar below `lg` and a sticky sidebar at `lg`+, via Tailwind responsive classes.
- **Why:** One element in the DOM and accessibility tree, one observer, no duplicate links for screen readers.
- **Trade-off:** Denser class lists on that component.

## D8. Scroll-spy with `IntersectionObserver`

- **Options:** scroll listener + `getBoundingClientRect` per section; `IntersectionObserver`.
- **Choice:** `IntersectionObserver` with a band from just under the sticky bar to 55% down the viewport; the first section in the band wins. The mobile bar scrolls its own `scrollLeft` to keep the active tab visible (not `scrollIntoView`, which can move the page and cancel an in-progress smooth scroll).
- **Why:** No layout reads on every scroll frame, no throttling code.
- **Trade-off:** During a long smooth jump, intermediate sections briefly highlight.

## D9. Strict data normalisation

- **Choice:** Hours strings and tag codes are parsed once at module load; anything unrecognised throws with a descriptive message. The JSON is also type-checked against `RawMenu`.
- **Why:** The data is ours — malformed data is a bug. Failing loudly in tests beats silently rendering "Closed" for a typo'd opening time.
- **Revisit if:** Data came from a CMS or API — then validate at the boundary and degrade per item instead of throwing.

## D10. Focus ring colour set on the element, not on `:focus-visible`

- **Context:** Tailwind v4's `transition-colors` also transitions `outline-color`. Setting the colour only on focus made rings visibly fade in from the text colour.
- **Choice:** Ring colour is a static property of focusable elements (`outline-cream` etc. on dark/amber surfaces); `:focus-visible` only switches the outline on.

## D11. PostCSS override instead of upgrading to Next 16

- **Context:** `npm audit` flagged the PostCSS bundled by `next@15.5`; the suggested fix was Next 16, which the brief rules out.
- **Choice:** `overrides: { postcss: "^8.5.23" }` in `package.json`. Build verified; audit is clean.
- **Revisit if:** Next 15 ships the patched PostCSS itself — remove the override.

## D12. Scope: two stretch goals, then stop

- **Choice:** Entrance animation (CSS-only, `prefers-reduced-motion` aware) and one-page A4 print. Not done: dark mode, dietary filter, photography.
- **Why:** The brief: "Don't stretch unless you've fully nailed the requirements first" and "crisp judgment about scope". The two chosen were cheap and low-risk; the dietary filter needs an empty-state design and more testing than the time box allows.
