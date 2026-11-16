---
name: trip-planner
description: Plan complete, end-to-end trips and itineraries — interview the traveler, research and verify places, build a day-by-day plan clustered by area with meal, bar and activity options, handle flights, hotels, rental cars, insurance and credit-card perks, track bookings and budget, and publish a shareable itinerary page with maps and Google Maps links. Use this skill whenever someone wants to plan a trip, vacation, holiday, honeymoon, weekend getaway, road trip or "X days in some city", asks for an itinerary or travel plan, compares hotels, flights or rental cars for a trip, asks what to eat or drink at a destination, asks whether an attraction, add-on or insurance is worth it, or pastes booking confirmations and wants the plan updated — even if they never say "itinerary".
---

# Trip Planner

Turn a rough travel idea into a verified, bookable, end-to-end plan the traveler can follow on their phone, and keep it current as they book.

This skill is written to work with any capable model or agent framework. Where it says "ask", use whatever question mechanism you have (a multiple-choice tool if available, otherwise a short numbered list in chat). Where it says "search", use web search; if you have none, say which facts are unverified.

## Why this skill exists

Listing famous places is easy. What travelers actually need — and what planners usually miss until the traveler points it out — is:

1. **Asking about everything that affects the plan before drafting**, not one topic at a time after the fact.
2. **Verifying** the plan against reality: closed days, closed restaurants, ticket rules, travel times, fees.
3. **Sequencing** days so nothing backtracks, collides or ignores how the traveler likes to travel (late mornings, rest breaks).
4. **Owning the logistics layer**: flights vs ground cost, rental car rules, insurance, card perks, luggage, parking, reservations.
5. **Keeping a living document** that updates as bookings come in.

`references/gap-radar.md` lists the topics planners most often forget. Read it before the first draft and again before the final check.

## Workflow

| Phase | What you do | Output |
|---|---|---|
| 1. Intake | Ask the question bank in rounds (`references/intake-questions.md`) | A **trip brief** (`references/trip-brief-template.md`) |
| 2. Research | Verify weather, events, opening days, closures, prices, times | Notes with sources and "checked on" dates |
| 3. Draft | Build days using the planning rules below | Day-by-day plan + logistics + budget |
| 4. Publish | Build the itinerary page (`references/page-structure.md`); also offer a plain-text version for pasting into other tools/AIs | Shareable page |
| 5. Iterate | Process bookings and questions; re-verify after each change | Updated page + changelog |
| 6. Final check | Run `references/final-check.md`; score with `references/quality-rubric.md` | Clean plan + list of open items |

Keep the trip brief up to date throughout. It is the hand-off document: any other agent or model should be able to continue the work from the brief plus the current page.

## Phase 1 — Intake

Ask in short rounds (3–4 questions each), recommended option first, and never re-ask what the traveler already told you. Cover every section of `references/intake-questions.md` before drafting — especially the logistics sections (flights, car, cards, insurance, luggage), which travelers rarely volunteer and which drive the most corrections later.

Read answers literally. If a preference is ambiguous ("crab" — likes it or avoids it?), confirm in one line. Misreading a preference costs more trust than asking.

If the traveler shares material (videos, notes, other planners' drafts), ask for it as text or an upload; video links are often unreachable. Extract every place and tip, tag what you use as "from your sources", and say what you dropped and why.

## Phase 2 — Research and verify

For each item, search, then record the fact, the source and the date checked:

- **Weather for the exact dates** (rain chance, wind; marine forecast if boats or snorkeling). Put weather-sensitive activities on the best day; give every day a backup.
- **Events and holidays** that cause traffic, crowds or price spikes; airport buffers for holiday weeks.
- **Opening days and hours** of every attraction (many close one or two weekdays) — schedule around them.
- **Restaurant status** — search for "permanently closed"; tell the traveler to confirm on a live map app the day before.
- **Ticket mechanics** — what a pass includes, vouchers to exchange and how early, morning vs afternoon departures, reservation release windows (some restaurants release tables weeks ahead at a fixed time).
- **Travel times and order** — are stops on the way or a detour?
- **Prices and hidden fees** — see the money section of the gap radar. Label prices as estimates unless they come from the traveler's own checkout.

When a source can't confirm something, say so instead of guessing. Prefer official sites; treat aggregator snapshots as rough.

## Phase 3 — Draft: planning rules

**Shape of each day**
- One area per block, in a line, no backtracking. Dense clusters get a walking order (A → B → C).
- Start at the traveler's preferred wake-up time; at least one rest block per day; note the one or two days that must start early and why.
- Best first: tag stops **Top pick** or **If time**.
- Feasibility: meals at sensible times after any schedule shift; no activity overlapping a tour's return; check-in/check-out vs arrival/departure; rental drop-off well before the flight; voucher exchanges and reservation times with buffers; sunset times for sunset activities.
- Backups: a rain or cancellation option for every day, and confirm the backup is open that day.

**Food and drink**
- Every meal: 2–3 nearby options, ⭐ one, each with signature dishes, an approximate rating if found, and diet tags per traveler. Vary breakfasts (local specialties, egg dishes, bowls, diner classics), not just sandwiches.
- A must-try list for the destination, including seasonal specialties, mapped to where they are on the route.
- Bars: for each, the famous drink to order, why go, cover-charge status and mocktail options; warn about tourist-trap pricing.
- When the traveler names a famous/celebrity restaurant, give an honest fit check against their diet and taste, not just its reputation.

**Getting around**
- Compare options with a small cost-and-hassle table: rideshare, transit, tour transport, partial car rental, full-trip rental (include nightly parking, tolls, one-way fees, airport fees).
- Rent cars only for the days that need them unless the numbers say otherwise.

**"Is it worth it?" questions**
- Give a verdict, the trade-off (time, cost, fit), and an alternative. Don't hedge everything.

## Phase 4 — Publish

Build one shareable page following `references/page-structure.md`: every place has a map-app link, every day has a route whose stop order matches its numbered pins, and there's a bookings tracker, a to-do checklist, a budget and sources. Keep personal data off the page (names, confirmation/ticket/policy numbers, addresses, phone, email). Respect the visual theme the traveler asks for, and check the page at phone width.

Also offer a **plain-text version** of the itinerary (day, time, place, notes, bookings) that the traveler can paste into another assistant, a calendar or a note app.

## Phase 5 — Iterate with bookings

When the traveler pastes a confirmation, checkout screen or policy:
- Extract actual times, fees, inclusions and deadlines. Flag mismatches at once (e.g. a car drop-off after the flight, a non-refundable rate, a room type they didn't intend, an expired insurance card).
- Update together: bookings tracker, affected days, maps and routes, to-do list, budget. Then re-run the relevant final checks.
- For add-ons (travel insurance, rental protection, stay protection, roadside assistance), compare against what they already have — credit-card benefits (primary vs secondary coverage), personal auto policy (collision, comprehensive, liability limits, deductible) — and give a keep/skip.
- Never copy confirmation numbers or personal details into the shareable page.

## Phase 6 — Final check and score

Run `references/final-check.md` end to end, fix what fails, then score the plan with `references/quality-rubric.md`. Report the score, what's still open, and the next three things the traveler should book or confirm.

## Tone

Plain, friendly, decisive. Lead with the recommendation, then the short why. Use small tables for comparisons. The traveler is often reading on a phone, so keep paragraphs short and avoid jargon.

## Reference files

- `references/intake-questions.md` — the full question bank, by round.
- `references/gap-radar.md` — topics planners forget; read before drafting and before the final check.
- `references/trip-brief-template.md` — the hand-off document for other agents and models.
- `references/page-structure.md` — sections, links, maps and visual rules for the itinerary page.
- `references/final-check.md` — the pre-delivery checklist.
- `references/quality-rubric.md` — how to score a plan (and this skill) out of 10.
