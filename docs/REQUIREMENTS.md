# Requirements — Cardamom House Menu Page

Source: `Kwill-Frontend-Trial-Task.md 2.pdf` (9 pages, all read). This file restates the brief; where the brief is silent, the gap is listed under *Ambiguities / Assumptions* rather than filled in silently.

Priority key: **MUST** (explicitly required) · **SHOULD** (strongly implied by evaluation criteria) · **COULD** (stretch goal) · **OUT OF SCOPE**.

## Objective

A single public-facing menu page for **Cardamom House**, a brunch café in Lisbon. Customers mostly open it on a phone while standing outside. It must show the menu beautifully, communicate the brand, and feel like the café rather than a stock template — "a tiny, polished product, not a coding exercise".

## User Personas

| Persona | Context | Need |
| --- | --- | --- |
| Passer-by on the pavement | Phone, one hand, outdoor light, possibly a tourist | Is it open? What's good? What does it cost? |
| Returning regular | Phone or laptop | Today's special, opening hours |
| Kwill reviewer | Desktop + phone, keyboard | Switch between the three states, tab through the page, read the code |

## Core User Flows

1. Land → see name, tagline, open/closed status within the first viewport.
2. See today's special (or that it is sold out / the café is closed).
3. Jump to a category via the sticky nav; nav highlights the current section while scrolling.
4. Scan items: name, description, price, dietary tags.
5. Check weekly hours (today emphasised) and find address / phone / Instagram.
6. Reviewer: switch state via `?state=open | closed | special-sold-out`.

## Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| F1 | **Hero**: restaurant name, tagline, indication of whether currently open (from hours data + current time; hard-coding "Tuesday 11:30" is allowed) | MUST |
| F2 | **Today's special**: visually highlighted callout using the brand colour, somewhere prominent | MUST |
| F3 | **Category navigation**: sticky (top, or side on desktop), jumps between sections | MUST |
| F4 | Category nav: active section highlights as the user scrolls | MUST |
| F5 | **Menu sections**: Brunch, Sandwiches, Drinks, Sides — each with heading, optional description, clean list of items | MUST |
| F6 | **Menu items**: name, description, price in EUR with € formatting, tags (V = vegetarian, GF = gluten-free, spicy) | MUST |
| F7 | Tags visually distinct but subtle | MUST |
| F8 | **Hours block**: weekly opening hours, today's row visually emphasised | MUST |
| F9 | Closed days clearly different from open days | MUST |
| F10 | **Footer**: address, phone, Instagram handle | MUST |
| F11 | State switch via URL query param `?state=` (hard-coded toggling is fine) | MUST |
| F12 | `open` (default): Tuesday 11:30, open, special available | MUST |
| F13 | `closed`: a Monday; clear but friendly "We're closed today" banner **with the next opening time** | MUST |
| F14 | `special-sold-out`: open; Saffron French Toast dimmed with a "Sold out" pill; the special callout updates gracefully | MUST |

## Non-Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| N1 | Stack: Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS v4 | MUST |
| N2 | No backend, no CMS; hard-coded or JSON data | MUST (constraint) |
| N3 | No `any`; typed props; sensible component decomposition; clean Tailwind; reasonable file structure | MUST (evaluated) |
| N4 | Time budget 4–6 focused hours; stop and document if exceeded | MUST (constraint) |
| N5 | Work must be original — do not copy an existing menu page | MUST |

## UI Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| U1 | Brand colour `#B45309` used meaningfully: buttons, accent lines, hover states, today's-special highlight | MUST |
| U2 | Feels warm, human, like Cardamom House — not a Notion/generic template | MUST (evaluated #1 and #4) |
| U3 | Intentional spacing, type hierarchy, visual weight | SHOULD (evaluated #1) |
| U4 | Imagery optional: typography-led with no photos is explicitly a defensible call | COULD |

## Technical Constraints

- Next.js 15 App Router (not 16, the current `latest`), React 19, TS strict, Tailwind v4.
- Deployable to Vercel.
- No server/database; the query param is the only runtime input.

## Data Requirements

- Source: the mock JSON in the brief, used verbatim.
- `today_special.item_id` references an item (`brunch_07`) — must be resolved by id, not duplicated.
- Shape irregularities present in the data and which must render correctly:
  - `sides` category has `"description": ""` → treat as "no description".
  - All `sides` items have **no** `description` field → optional.
  - Several items have `"tags": []`.
  - Hours are strings: `"Closed"` or `"HH:MM – HH:MM"` (en dash).
  - Tag values are mixed case: `"V"`, `"GF"`, `"spicy"`.
- Nav label: the brief calls the section "Sandwiches"; the data name is "Sandwiches & Toasties". Data name is used.

## Validation Requirements

No forms or user input exist. The only input is `?state=`:
- Unknown / missing / repeated values → fall back to `open` (the documented default).
- Data is validated where it is parsed (hours strings); malformed hours are a programming error and fail loudly in tests.

## Error States

- Unknown `?state=` value → default state, no error page.
- Special references a non-existent item → callout is omitted, page still renders.
- Unexpected render failure → Next.js default error handling (no data fetching exists that could fail).

## Loading States

None required: data is local and the page is server-rendered, so there is no client-side loading phase. OUT OF SCOPE.

## Empty States

- Category without description → description line omitted (no empty gap).
- Item without description → name/price only, row layout stays aligned.
- Special unavailable (sold out) → callout changes copy and emphasis instead of disappearing.
- Café closed → closed banner replaces the "open" status.

## Responsive Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| R1 | Works cleanly on mobile, tablet, desktop | MUST |
| R2 | Extra attention to mobile: tap targets, scrolling, sticky nav behaviour | MUST (evaluated #5) |

## Accessibility Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| A1 | Semantic HTML (`<nav>`, `<section>`, etc.) | MUST |
| A2 | Keyboard navigable — "we will tab through your page" | MUST |
| A3 | Visible focus | MUST |
| A4 | Sufficient contrast | MUST |
| A5 | Sensible alt text | MUST (applies to any image used) |
| A6 | "Real, not theatrical" — no ARIA for show | MUST (evaluated #6) |

## Performance Requirements

None stated. Implied by "mostly read on phones standing outside": fast first paint on mobile networks, minimal client JS. SHOULD.

## Stretch Goals (only after all MUST items are done)

| ID | Goal | Priority |
| --- | --- | --- |
| S1 | Subtle entrance animation (Motion or pure CSS), tasteful | COULD |
| S2 | Printer-friendly layout via `@media print`, one page | COULD |
| S3 | Light/dark mode toggle respecting `prefers-color-scheme` | COULD |
| S4 | Dietary filter (vegetarian / gluten-free / all) | COULD |
| S5 | Real food photography (free stock) | COULD |

## Submission Requirements

Email **hello@getkwill.com**, subject `Frontend Trial — [Your Name]`, containing:

1. GitHub repo link (public or shared privately).
2. Vercel deployment link.
3. 3–5 min Loom: 30-second demo; one decision you're proud of; one you'd revisit; one question you wish had been answered up front.
4. Short README: how to run locally, tech used, what you'd build next.

"No PowerPoint, no design doc, no résumé update." Repo hosting, deployment, Loom and the email are done by the candidate, not by code.

## Acceptance Criteria

- [ ] All F1–F14 visible and correct in each of the three states.
- [ ] `?state=` with an invalid value renders the default state.
- [ ] Nav jumps to each section and highlights the section in view on scroll, on mobile and desktop.
- [ ] Prices render as € with two decimals.
- [ ] Today's row in hours is emphasised; Monday reads clearly as closed.
- [ ] Tab order is logical; every interactive element shows a visible focus ring.
- [ ] Text contrast ≥ 4.5:1 (normal) / 3:1 (large), including dimmed sold-out text.
- [ ] No horizontal page scroll at 360px width; tap targets ≥ 44px tall in the nav.
- [ ] `lint`, `typecheck`, `test`, `build` all pass.
- [ ] README covers run instructions, tech, what's next.

## Ambiguities / Assumptions

| # | Question | Assumption | Reason | Risk |
| --- | --- | --- | --- | --- |
| Q1 | Real clock or hard-coded time? | Each state pins a simulated Lisbon time: `open` and `special-sold-out` = Tuesday 11:30, `closed` = Monday 11:30. Open/closed logic is a pure function of (hours, time), so a real clock could be plugged in later. | The three states fix the day; a real clock would make `open` show "closed" on Mondays and evenings, contradicting the brief. | Low. |
| Q2 | Does today's special show when closed? | No special callout on a closed day; the closed banner takes that slot. The item stays in the menu. | "Chef's pick today" on a day the chef isn't cooking is misleading. | Reviewer may expect the callout; easy to reinstate. |
| Q3 | Where does the closed banner go? | Directly under the hero, in the position the special would occupy — the first thing after the café name. | "Clear" — it must be seen before the menu. | Low. |
| Q4 | "Next opening time" format | Day + time: "Back tomorrow, Tuesday, from 08:00". Computed from the hours data, not hard-coded. | Works for any day, not just Monday. | Low. |
| Q5 | € formatting locale | English copy with `en-IE` currency formatting → `€11.50`. | Page copy is English; `pt-PT` would render `11,50 €`, mixing conventions. | Portuguese customers may prefer `11,50 €`; one-line change. |
| Q6 | How should a reviewer switch states? | URL param is authoritative; a small, clearly-labelled "Preview states" strip in the footer links to all three. | Saves reviewers typing URLs; kept out of the customer-facing hierarchy. | Low. |
| Q7 | Sold-out special: remove callout or update? | Keep the callout, drop the amber fill, mark it "Sold out", and say when it's back. | "Update gracefully" rather than disappear. | Low. |
| Q8 | Photos? | Typography-led, no photography. | Brief explicitly allows it; avoids stock-photo sameness. | Reviewer taste. |
