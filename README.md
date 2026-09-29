# Cardamom House — menu page

A single-page, phone-first menu for Cardamom House, a (fictional) brunch café in Lisbon. It is typography-led: warm cream paper, espresso ink, and the café's amber `#B45309` on the things that matter — today's special, buttons, the active section and today's hours.

## Run it locally

Requires Node 22+.

```bash
npm install
npm run dev          # http://localhost:3000
```

Three demo states, switchable by URL or from the strip at the bottom of the page:

| URL | Scenario |
| --- | --- |
| `/?state=open` (default) | Tuesday 11:30 — open until 15:00, special available |
| `/?state=closed` | Monday 11:30 — "We're closed today", back Tuesday from 08:00 |
| `/?state=special-sold-out` | Tuesday 11:30 — open, Saffron French Toast sold out |

Unknown values fall back to `open`; if the param repeats, the last value wins.

| Script | Does |
| --- | --- |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript) |
| `npm run typecheck` | `tsc --noEmit`, strict + `noUncheckedIndexedAccess` |
| `npm test` | Vitest unit tests for the domain logic |
| `npm run build` | Production build |
| `npm run check` | All four, in that order |

## Tech

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Vitest. Fonts: Fraunces and DM Sans via `next/font`. No other runtime dependencies.

## How it's put together

```text
next.config.ts               ?state=closed|special-sold-out → rewrite to /state/[state]
app/page.tsx                 static default state (open)
app/state/[state]/page.tsx   the other states, prerendered at build time
features/menu/components     MenuPage + presentational components; CategoryNav is the only client component
features/menu/constants      anchor ids, demo states, weekdays
features/menu/data           menu.json (the brief's data, verbatim) + typed normaliser
features/menu/types          raw/domain types, open status, scenario
features/menu/utils          pure logic: hours, open status, special, formatting (unit tested)
```

- **State lives in the URL, and every state is static.** `?state=` is resolved by a rewrite at the routing layer, so each state is a prerendered, CDN-cached page, and no server code runs on a request. Each page derives everything else from its scenario (a simulated Lisbon time plus the sold-out items): open/closed, the next opening time, today's hours row and whether the special is available. The only client state is the active nav tab.
- **Open/closed is computed, not hard-coded per state.** `getOpenStatus(hours, time)` handles closed days, before opening, after closing and wrapping round the week. The closed banner's "back tomorrow, Tuesday, from 08:00" comes from the hours data.
- **Data is checked twice.** `tsc` checks the JSON's shape against `RawMenu`. At load time, `normaliseMenu` parses the hours strings and tag codes and throws on anything it doesn't recognise, and a test runs it against the real file.
- **Minimal JavaScript.** 1.3 kB of page JS on top of the framework. The category links and demo-state links are plain anchors, so everything works with JavaScript off.

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/DECISIONS.md](docs/DECISIONS.md) · [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)

## Motion

There are two small moments, both CSS-only, so they run before hydration and add 0 KB of JS:

1. **Arrival.** On load, the cardamom mark appears large in the centre of the screen, then glides and turns into its place above the name. The tagline, status and special follow it in.
2. **Jump feedback.** "Find it on the menu" scrolls to the dish, and its row glows amber once it arrives.

The `<h1>` (the LCP element) is never animated. Everything is off under `prefers-reduced-motion` and in print.

## Performance

Measured with Lighthouse (mobile preset), median of 5 runs, production builds, before and after run alternately:

| | Before | After |
| --- | --- | --- |
| Score | 85 | **97** |
| LCP | 3.6 s | **2.4 s** |
| FCP | 0.95 s | 0.78 s |
| TBT | 236 ms | 122 ms |
| CLS | 0 | 0 |
| Weight | 439 KB | 242 KB |

What changed:

- All three states are prerendered (TTFB is a CDN hit).
- Fonts went from 308 KB to 120 KB.
- The LCP element is visible from the first frame.
- The `next/link` chunk was dropped.

Two experiments made things worse and were reverted: inlining the CSS, and dropping font preloads. [docs/DECISIONS.md](docs/DECISIONS.md) (D13–D18) has the measurements.

## Accessibility

Landmarks, one `h1`, headings per section and dish, a skip link, and visible focus rings everywhere, including on amber and dark surfaces. `aria-current` marks the active category, the demo state and today's row in the hours. Every colour pair was measured: body text is at least 4.5:1, including dimmed sold-out text. Open, closed, sold out and today are always spelled out in words, never shown by colour alone. Smooth scrolling and the entrance animation respect `prefers-reduced-motion`. An axe scan of all three states at 375 px and 1280 px reports 0 violations.

## Testing

`npm test` runs 46 unit tests on the logic that can fail silently:

- hours parsing and invalid input
- open/closed at exact opening and closing minutes
- next-opening lookup across the closed Monday and the week wrap
- `?state=` routing: every non-default state has a rewrite
- special resolution, including sold-out and missing items
- € formatting
- contact links
- the real data file

The UI was checked in Chrome at 375, 768 and 1280 px: screenshots of every state, a keyboard tab-through, scroll-spy tracking, the no-JS path, and a print-to-PDF check.

## Stretch goals

- **Done:** CSS entrance animation (off for reduced motion), and a one-page A4 print layout.
- **Not done, deliberately:** dark mode, dietary filter, photography. The required features came first.

## Known limitations

- Time is simulated per state. There is no real clock mode.
- Only tested in desktop Chrome and Chrome's mobile emulation, not on a physical phone or in Safari.
- During a smooth-scroll jump, the nav briefly highlights each section it passes.
- Print text is small (body about 6.7pt) so that the whole menu fits on one A4 page.

## Deploy

It's a standard Next.js app with no environment variables, so it deploys on Vercel as is:

1. Push to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo. The framework preset (Next.js), build command (`next build`) and Node version (22.x, from `engines`) are all picked up automatically.
3. Deploy. Every route is prerendered, so all three `?state=` URLs are served from the CDN.

Alternatively, from the CLI: `vercel` for a preview, `vercel --prod` for production.

GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs lint, typecheck, tests and build on every push and pull request. Responses also carry basic security headers (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) and no `X-Powered-By`.

## What I'd build next

1. **A `?state=live` mode** that uses the real Europe/Lisbon time, since the status logic already supports any time.
2. **A dietary filter** (vegetarian / gluten-free), held in the URL like the demo state, with a friendly empty state for categories that have no match.
3. **Real-device QA** on iOS Safari and Android Chrome, plus Playwright end-to-end tests of the three states in CI.
4. **Dark mode**, a warm espresso theme built from the same tokens.
