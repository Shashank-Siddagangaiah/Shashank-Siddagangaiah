---
name: trip-planner
description: Plan complete, end-to-end trips and itineraries — interview the traveler, research and verify places, build a day-by-day plan clustered by area with meal and bar options, bookings tracker, budget, and a shareable itinerary page with maps and Google Maps links. Use this skill whenever someone wants to plan a trip, vacation, holiday, honeymoon, weekend getaway, road trip, or "X days in some city", asks for an itinerary or travel plan, compares hotels/flights/rental cars for a trip, wants restaurant, food or bar suggestions for a destination they're visiting, or sends booking confirmations and asks to update their plan — even if they never say the word "itinerary".
---

# Trip Planner

Turn a rough travel idea into a verified, bookable, end-to-end itinerary the traveler can follow on their phone — and keep it current as they book things.

The value of this skill is not listing famous places (anyone can do that). It is: asking the right questions up front, **verifying** what's actually open and feasible on the exact dates, sequencing days so nothing backtracks or collides, and turning the plan into a living document the traveler updates as they book.

## Workflow at a glance

1. **Interview** — gather preferences in short rounds (see "Intake").
2. **Research & verify** — weather, events, opening days, closures, prices, travel times.
3. **Draft the plan** — cluster by area, best-first, rest built in, 2–3 options per meal.
4. **Publish the itinerary page** — see `references/page-structure.md`.
5. **Iterate with bookings** — as the traveler books flights, hotels, cars, tables, update status, times and budget, then re-verify.
6. **Final check loop** — run `references/final-check.md` before calling it done.

## 1. Intake (ask in rounds, not all at once)

Use a multiple-choice question tool if available; 3–4 questions per round, with a recommended option first. Don't re-ask what the user already said. Typical rounds:

- **Round 1 — shape:** dates and flexibility (which days are free?), who's traveling, origin city and nearest airports, total budget (and whether flights are included).
- **Round 2 — style:** pace (packed / balanced / relaxed), what time they like to start the day, interests (culture, beaches, nature, nightlife, shopping, food), must-dos and must-avoids, any videos/articles/notes they've collected (ask them to paste or upload; links to video sites may be unreachable).
- **Round 3 — logistics:** lodging style (one base vs split stays; splurge where they rest, save where they only sleep), getting around (rideshare vs rental car vs tours — consider parking cost/hassle), day trips worth a full day vs not.
- **Round 4 — food & drink:** every diet restriction per traveler (e.g. "no beef", "vegetarian but eats eggs and seafood"), spice tolerance, cuisines they love, breakfast style, whether they drink (and want mocktails).

**Read answers literally and confirm when ambiguous.** A misread preference (e.g. treating "I like crab" as "no crab") damages trust; when unsure, ask in one line.

## 2. Research & verify (this is where plans usually fail)

Search the web for each of these and cite sources at the end:

- **Weather & conditions for the exact dates** — rain chance, wind; marine forecasts if boats/snorkeling are involved. Put weather-sensitive activities on the best day and give every day a backup.
- **Events & holidays** — big events (traffic near arenas/convention centers), holiday travel surges (airport buffers of 2–2.5 h).
- **Opening days and hours** — museums and attractions often close 1–2 weekdays. Schedule around closed days instead of discovering them on site.
- **"Permanently closed" check** — restaurants close often; aggregator lists are stale. Tell the user to confirm on Google Maps before going, and swap immediately when they report a closure.
- **Ticket types** — e.g. which pass includes a cruise; whether a voucher must be exchanged and how early; afternoon vs morning tour departures.
- **Travel times** — realistic drive/transit times, and whether stops are on the way or require backtracking.
- **Prices & hidden fees** — resort/destination fees, parking, auto-gratuity on bills, card surcharges, one-way rental fees, toll plans, bag fees on budget airlines. Always label prices as estimates unless they come from the user's own checkout screen.

When a source can't confirm something (hours for 2026, cover charges), say so plainly rather than guessing.

## 3. Planning principles

- **One area per block, in walking order.** Each day moves through neighborhoods in a line; no zig-zag. Use zoomed walking maps (A → B → C) for dense clusters.
- **Best first.** Tag each stop **Top pick** or **If time** so the traveler knows what to drop when tired.
- **Rest built in.** At least one slow block per day; respect their preferred wake-up time.
- **Feasibility checks on every timeline:** no lunch at 10 am because an early car pickup shifted the day; no sunset activity at the same time a tour returns; rental drop-off well before the flight (not after it); check-in/check-out times vs. arrival/departure.
- **Transport:** rideshare for dense city days; rent a car only for the days that need it; compare a full-trip car (rental + nightly parking) vs partial rental + rideshare with a short cost table. Note insurance options (own policy, credit-card coverage — primary vs secondary — and that liability is separate).
- **Meals:** for every meal give **2–3 nearby options**, each with its signature dishes, a rough rating if found, and diet tags for each traveler. Vary breakfasts beyond sandwiches (shakshuka, local specialties, smoothie bowls, diner classics). Highlight the destination's must-try dishes (and seasonal ones).
- **Bars/nightlife:** for each bar give the **famous drink to order**, why go, cover-charge status, and mocktail availability. Warn about tourist-trap pricing.
- **Options, not overload:** when the user asks "is X worth it?", give an honest verdict with the trade-off (time, cost, fit with their preferences), then a recommendation.

## 4. The itinerary page

Publish a single shareable page (an Artifact if available, otherwise an HTML file). Follow `references/page-structure.md` for sections, map conventions, link formats and visual rules. Key rules:

- Every place gets a 📍 Google Maps link; every day gets a route button whose stop order matches the numbered pins.
- Keep personal data off the page (names, confirmation/ticket/policy numbers, home address, phone, email) — the page may be shared.
- Mobile-first: verify no horizontal scrolling at ~390 px; use the theme the user asks for (e.g. white background only).

## 5. Iterating with bookings

When the user pastes a confirmation or checkout screen:
- Read the **actual** times, fees and inclusions; flag mismatches immediately (e.g. a drop-off time after the flight, a room type they didn't intend, a non-refundable rate in a stormy week).
- Update the bookings tracker, the affected day, the map, the to-do list and the budget together, then re-run the relevant final checks.
- If they ask whether an add-on is needed (travel insurance, rental protection, stay protection), compare it against what they already have (credit card benefits, personal auto policy) and give a clear keep/skip.

## 6. Final check

Before declaring the plan done (and after major edits), go through `references/final-check.md`. It is the list of mistakes that actually happened in real planning sessions.

## Tone

Plain, friendly, decisive. Lead with the recommendation, then the short why. Use small tables for comparisons. Don't pad; the traveler is often reading on a phone.
