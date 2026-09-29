# Project context

Continuity notes: what exists, what was verified, what's left.

## Objective

Kwill Frontend Trial: a single phone-first menu page for Cardamom House (Lisbon) with three URL-switchable states. Brief: `Kwill-Frontend-Trial-Task.md 2.pdf` (git-ignored — Kwill's document). Requirements: [REQUIREMENTS.md](REQUIREMENTS.md).

## Status

**All MUST requirements implemented and verified. Stretch goals S1 (entrance animation) and S2 (one-page print) done; S3–S5 intentionally skipped.** Not yet pushed or deployed.

## Architecture (one paragraph)

`app/page.tsx` (Server Component) awaits `searchParams`, turns `?state=` into a `Scenario` (simulated Lisbon time + sold-out ids), derives open status and today's special, and composes presentational components. Pure logic lives in `features/menu/*.ts` and is unit tested. `CategoryNav` is the only client component (scroll-spy). See [ARCHITECTURE.md](ARCHITECTURE.md) and [DECISIONS.md](DECISIONS.md).

## Files

| Path | Role |
| --- | --- |
| `src/app/{layout,page}.tsx`, `globals.css`, `icon.svg` | Route, fonts, tokens, print, favicon |
| `src/data/menu.json` | Brief's mock data, verbatim |
| `src/features/menu/{types,menu-data,hours,scenario,special,format,anchors}.ts` | Domain |
| `src/features/menu/*.test.ts` | 47 unit tests |
| `src/features/menu/components/*.tsx` | Hero, SpecialCallout, ClosedBanner, CategoryNav, MenuSection, MenuItemRow, DietaryTags, HoursBlock, SiteFooter, DemoStateSwitcher |
| `src/components/ui/{Pill,icons}.tsx` | Shared primitive + decorative SVGs |

## Verification log

| Check | Result |
| --- | --- |
| `npm run lint` | pass |
| `npm run typecheck` | pass |
| `npm test` | 47/47 pass |
| `npm run build` | pass — `/` dynamic, 4.51 kB page JS, 107 kB first load |
| `npm audit` | 0 vulnerabilities (with PostCSS override, D11) |
| axe-core (wcag2a/aa, 21aa, 22aa, best-practice) | 0 violations — 3 states × 375/1280 px |
| Horizontal overflow | 0 px at 320/360/375/768/1280 in all states |
| Scroll-spy | Correct tab after each click and through a full scroll sweep, mobile + desktop |
| Keyboard | Logical order, visible ring on every stop, skip link moves focus to the menu |
| No-JS | Correct state rendered; category anchors work |
| Invalid `?state=` | bogus / empty / repeated → handled |
| Console | No errors or warnings during load and client-side state switching |
| Print | 1 A4 page in all three states (Chrome PDF) |

QA scripts (Playwright + axe) were run from the session scratchpad, not committed — see *Remaining work*.

## Known issues / limitations

- Not tested on a physical phone or in Safari/Firefox.
- Scroll-spy briefly highlights intermediate sections during a smooth jump.
- Print body text ≈ 6.7pt (trade-off for one page).
- Simulated time only.

## Remaining work (candidate)

1. Test on a real phone (tap targets, sticky bar, iOS Safari scroll behaviour).
2. Create the GitHub repo and push (`git remote add origin … && git push -u origin main`).
3. Import into Vercel (framework preset: Next.js; no env vars needed).
4. Record the 3–5 min Loom. Suggested talking points:
   - *Proud of:* open/closed logic is a pure, tested function of (hours, time) — the closed banner's "back tomorrow, Tuesday, from 08:00" is computed, so any day works, not just Monday.
   - *Would revisit:* no real-clock mode; would add `?state=live` and the dietary filter.
   - *Question for Kwill:* should today's special stay visible on a closed day? (Assumed no — D3.)
5. Email hello@getkwill.com, subject `Frontend Trial — [Your Name]`.

Optional next engineering steps: commit the Playwright/axe checks as an e2e suite in CI; dietary filter; dark mode.
