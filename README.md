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

Unknown values fall back to `open`.

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
app/page.tsx              Server Component: ?state= → scenario → page
features/menu/*.ts        pure logic: hours, open status, special, formatting (unit tested)
features/menu/components  presentational components; CategoryNav is the only client component
data/menu.json            the brief's mock data, verbatim
```

- **State lives in the URL.** `?state=` is parsed once on the server into a simulated Lisbon time plus a set of sold-out items. Everything else — open/closed, next opening time, which hours row is today, how the special renders — is derived from that during render. There is no client state apart from the active nav tab.
- **Open/closed is computed, not hard-coded per state.** `getOpenStatus(hours, time)` handles closed days, before opening, after closing and wrapping round the week. The closed banner's "back tomorrow, Tuesday, from 08:00" comes from the hours data.
- **Data is checked twice.** `tsc` checks the JSON's shape against `RawMenu`. At load time, `normaliseMenu` parses the hours strings and tag codes and throws on anything it doesn't recognise, and a test runs it against the real file.
- **Minimal JavaScript.** About 4.5 kB of page JS on top of the framework. The category links are plain `#anchors`, so jumping between sections works with JavaScript off.

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/DECISIONS.md](docs/DECISIONS.md) · [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)

## Accessibility

Landmarks, one `h1`, headings per section and dish, a skip link, and visible focus rings everywhere, including on amber and dark surfaces. `aria-current` marks the active category, the demo state and today's row in the hours. Every colour pair was measured: body text is at least 4.5:1, including dimmed sold-out text. Open, closed, sold out and today are always spelled out in words, never shown by colour alone. Smooth scrolling and the entrance animation respect `prefers-reduced-motion`. An axe scan of all three states at 375 px and 1280 px reports 0 violations.

## Testing

`npm test` runs 47 unit tests on the logic that can fail silently:

- hours parsing and invalid input
- open/closed at exact opening and closing minutes
- next-opening lookup across the closed Monday and the week wrap
- `?state=` parsing
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

## What I'd build next

1. **A `?state=live` mode** that uses the real Europe/Lisbon time, since the status logic already supports any time.
2. **A dietary filter** (vegetarian / gluten-free), held in the URL like the demo state, with a friendly empty state for categories that have no match.
3. **Real-device QA** on iOS Safari and Android Chrome, plus Playwright end-to-end tests of the three states in CI.
4. **Dark mode**, a warm espresso theme built from the same tokens.
