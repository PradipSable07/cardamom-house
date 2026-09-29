# Decisions

Short records of the calls that shaped the build. Each: context → options → choice → trade-off → when to revisit.

---

## D1. Render the demo state on the server from `searchParams` — *superseded by D13*

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

---

## Performance pass

Measured with Lighthouse (mobile preset: simulated slow 4G, 4× CPU) against production builds, before and after run **interleaved** on the same machine (5 runs each, median), because background load on the dev machine moved TBT by ±100 ms between sessions.

| | Before | After |
| --- | --- | --- |
| Performance score | 85 | **97** |
| LCP (simulated) | 3628 ms | **2354 ms** |
| FCP | 952 ms | 777 ms |
| TBT | 236 ms | 122 ms |
| CLS | 0 | 0 |
| Page weight | 439 KB | 242 KB |

The 9 s LCP in the original DevTools trace was not representative: it was recorded against `next dev` (7.8 MB of unminified dev JavaScript) with the QuillBot extension injecting a 6 MB content script. Two findings from it were real, though — D14 and D15.

## D13. Prerender every state; resolve `?state=` in the router

- **Context:** D1 made `/` dynamic, so every request paid for a server render (and a serverless cold start on Vercel) before the first byte.
- **Options:** (a) keep D1; (b) static page + client-side state; (c) `rewrites` with `has: query` to prerendered routes.
- **Choice:** (c). `/?state=closed` and `/?state=special-sold-out` are rewritten in `next.config.ts` to `/state/[state]`, prerendered via `generateStaticParams` with `dynamicParams = false`. `/` is the static default. Every URL is served from the CDN; no function runs.
- **Trade-off:** State resolution moved from a unit-tested parser into routing config. Repeated params now resolve to the **last** value (Next's matcher), not the first. A test asserts every non-default state has a rewrite. `/state/*` is reachable directly and marked `noindex`.
- **Revisit if:** A state depends on request-time data (e.g. a real clock) — that one state becomes dynamic.

## D14. Fonts: drop the extra variable axes

- **Context:** Fraunces was loaded with `SOFT` and `opsz` axes in two styles: 270 KB of the 308 KB of fonts, all preloaded at high priority — on slow 4G, ~2 s of bandwidth competing with the HTML.
- **Choice:** Weight axis only. Preloaded fonts: 308 KB → 120 KB (Fraunces normal 46 KB, italic 37 KB, DM Sans 37 KB). Visual difference at these sizes is negligible.
- **Tested and rejected:** `preload: false`. Observed FCP went from ~330 ms to ~1420 ms — Chrome held text painting until the late-discovered fonts arrived. Preloading stays.

## D15. The LCP element is never animated

- **Context:** The original entrance faded the `<h1>` in from `opacity: 0`. Chrome doesn't count an invisible element as painted, so LCP was deferred to a later candidate (element render delay: 2.8 s in Lighthouse's breakdown).
- **Choice:** The `<h1>` is visible in the first frame, always. Motion lives on the mark (SVG — not an LCP candidate) and on smaller supporting content.

## D16. Inline CSS: tested and rejected

- **Context:** Lighthouse flagged the 8 KB stylesheet as render-blocking (~200 ms est.). `experimental.inlineCss` removes that request.
- **Result:** Score 92 without vs 85 with (back-to-back). Inlining folds style parsing into the HTML parse task, creating one long main-thread task: first-render long tasks 277 ms → 417 ms (4× CPU), TBT +~190 ms. FCP didn't improve either.
- **Choice:** Keep the external stylesheet.

## D17. Motion: two moments, CSS only

- **Choice:**
  1. *Intro.* The cardamom mark appears large at the viewport centre, holds for a beat, then glides and turns into its place above the name (~1.15 s). Tagline, status and the special/closed card rise in behind it (650–860 ms delays). The mark's resting position is derived in CSS from the hero's layout constants; if those drift, only the start point moves — it always lands exactly because the animation ends at no transform.
  2. *Arrival.* Jumping to the special via "Find it on the menu" gives its row a short amber glow, delayed so it peaks after the smooth scroll lands.
- **Why CSS, not a motion library:** Runs before hydration (no flash of static-then-animated), costs 0 KB of JS, and is fully compositor-driven (`opacity`, `translate`, `scale`, `rotate`). Individual transform properties let the flight and the settle use different curves without fighting over `transform`.
- **Tried and removed:** scroll-driven (`animation-timeline: view()`) accent rules drawing in per section. Isolated by stripping it from the HTML: ~135 ms of extra first-render main-thread time at 4× CPU for an effect nobody would notice.
- **Guards:** all motion off under `prefers-reduced-motion` and in print; `body { overflow-x: clip }` so the scaled mark can never widen the page mid-flight (`clip`, unlike `hidden`, keeps the sticky nav working).

## D18. Demo-state links are plain `<a>`, not `next/link`

- **Why:** Every state is a static, CDN-cached page, so a full load is effectively instant. Dropping `Link` removes a client chunk and the RSC prefetches it triggered when the footer scrolled into view. Side effect: switching state replays the intro, which is what a reviewer wants to see.
