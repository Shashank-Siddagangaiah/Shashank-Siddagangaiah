# Itinerary page structure

A single page the traveler opens on their phone during the trip.

## Sections (in this order)

1. **Header facts** — dates, flights, stays, getting around, estimated total. A jump-link nav row.
2. **Overview** — one card per day (linking to the day), a whole-trip map, a weather note, and a legend for the chips.
3. **Part 1 — Day by day.** For each day:
   - Eyebrow (Day N · date), title, meta line (areas in order · where they sleep · pace).
   - A schematic day map with numbered pins + a legend + an "Open <day> in Google Maps" route button.
   - A timeline of rows: time · title · chips · details. Meal rows list 2–3 options (⭐ top pick) with signature dishes and a 📍 link each. Rest rows are shaded.
   - An optional zoomed walking map (pins A, B, C) for dense clusters, with a "Walking route" button.
   - A rain/backup line.
4. **Part 2 — Food & drinks.** A must-try dishes table (dish · what it is · where on the route) and a bar table (night · bar · famous drink/order · why go) plus hidden-charge tips.
5. **Part 3 — Bookings & logistics.** Bookings tracker (item · status · details), a to-do checklist (persisted per viewer), budget table with total and easy savings, expert tips, sources with check date.

## Chips (small inline labels)

Diet tags per traveler (e.g. "Veg / egg / seafood", "Chicken / pork"), "Sweet", "From videos", "Top pick", "If time", "✅ Booked …", and transport chips ("Uber", "Bus", "Car day 1"). Keep chips in a flex row — never full-width blocks.

## Links

- Place search: `https://www.google.com/maps/search/?api=1&query=<url-encoded name + address>`
- Route: `https://www.google.com/maps/dir/?api=1&origin=<A>&destination=<Z>&waypoints=<B>|<C>&travelmode=driving|walking`
  - Waypoint order must equal the pin order. Leave out legs the traveler doesn't do themselves (tour buses, boats), and use `walking` for walkable clusters.
- Avoid unofficial `/data=` URL hacks; they break.

## Maps

Schematic SVG maps drawn from approximate lat/lon are fine (label them "approximate"); tile maps usually can't load in sandboxed pages. Coordinates only need to be close enough to show order and relative position. After every edit, check: pins count = legend count = timeline badges, and the route button lists the same stops.

## Visual rules

- Respect the requested theme (e.g. white background only — then don't add dark-mode overrides).
- Mobile first: no horizontal scroll at 390 px; long chips must wrap.
- Use tables for comparisons; keep paragraphs short.
- No personal data on the page.

## Extra sections that add real value
- **Before you go** — a dated timeline (e.g. 3 days before: confirm bookings; 24 h before: mobile check-in; night before: pack and charge).
- **Morning-of checklists** per day (tickets, cash, chargers, swimsuits).
- **Apps to install**, **what to wear** (dress codes), **money** (which card to use where, cash spots), **emergency info**.
- **Plain-text version** in a copyable block with a Copy button, for pasting into another assistant, a calendar or notes.
