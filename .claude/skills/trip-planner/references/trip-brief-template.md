# Trip brief (hand-off document)

Keep this updated during the conversation. Any agent or model should be able to continue the plan from this brief plus the current itinerary page. Store personal data here only if the conversation is private; never copy it to a shareable page.

```yaml
trip:
  destination: ""
  dates: { start: "", end: "", flexible_window: "" }
  travelers: [{ role: "", diet: "", spice: "", drinks: "" }]
  origin_airports: []
  budget: { total: "", includes_flights: true }
style:
  pace: "balanced"            # packed | balanced | relaxed
  wake_time: ""
  rest_blocks: "daily"
  interests_ranked: []
  must_do: []
  avoid: []
  sources: []                  # videos/notes the traveler shared, summarized
logistics:
  flights: [{ leg: "", airline: "", times: "", bags_per_person: "" }]
  lodging: [{ nights: "", name: "", fees: "", checkin: "", checkout: "", parking: "", refundable_until: "" }]
  car: { needed_days: "", pickup: "", dropoff: "", protection: "", toll_plan: "" }
  cards_and_insurance: { payment_card_perks: "", auto_policy: "", travel_insurance: "" }
bookings:                      # status: idea | chosen | booked | cancelled
  - { item: "", status: "", when: "", notes: "" }
open_questions: []
decisions_log: []              # date — decision — why
verified_facts:                # fact — source — checked_on
  - { fact: "", source: "", checked_on: "" }
```
