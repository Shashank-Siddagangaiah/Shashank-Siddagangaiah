# Topic file schema (engine.js)

A topic file is one JS file that calls `CE.register({...})`. The engine draws every shared part
of the page from these fields, so a new topic is mostly data. `assets/example-topic.js` is a
complete, working example. Copy it and replace each field.

| Field | Required | What it is |
|---|---|---|
| `id` | yes | URL-safe name, also the `#hash` route and the storage key (`self-attention`) |
| `title` | yes | Page heading and `<title>` |
| `lede` | yes | One or two STE sentences. HTML allowed (`<b>`, role-color spans). |
| `num`, `total`, `list`, `phase` | no | Breadcrumb chips ("Topic 3 of 10") |
| `checked` | yes for fast-moving topics | Date the facts and links were checked (`2026-11-16`) |
| `prereqs` | recommended | `[{ text, id?, label? }]`. `id` links to another topic in the same hub. |
| `predict` | recommended | One multiple-choice question asked **before** the walkthrough: `{ q, o: [..], a: index, why }` |
| `playerTitle`, `playerIntro` | no | Heading and one-line intro above the scene player |
| `scenes` | recommended | `[{ title: "1 · Name", text, draw() }]`. `draw()` returns SVG markup for a 720×340 stage. `text` is the caption and the read-aloud script. |
| `html` | yes | The topic's own sections: steps, diagrams, lab, hand exercise, code, facts. Plain HTML string. |
| `recall` | yes | 1–3 free-recall prompts: `[{ q, model }]`. `model` is the model answer (HTML allowed). |
| `quiz` | yes | 4–6 questions: `[{ q, o, a, why }]`. The engine shuffles the options (a stable order per question), so you may list the right answer first. Keep option lengths similar so the longest isn't always right. |
| `cards` | yes | 6–10 flashcards: `[{ f, b }]` (front, back) |
| `resources` | yes | `[{ kind, title, url, tier, note }]`. `tier` is `source`, `third` or `search` (see `references/sources.md`). |
| `next` | no | `{ title, text, id? }`. With `id`, the engine links to that topic. |
| `init(root)` | no | Runs after the page renders. Wire up the lab here. Return a cleanup function. |

## What the engine renders, in order

1. Header (chips, title, lede, checked date, "mark as done")
2. Before you start (`prereqs`)
3. Predict first (`predict`)
4. Animated walkthrough (`scenes`): progress bar, Prev/Play/Next, speed 0.75–1.5×, read-aloud,
   transcript, arrow keys, reduced-motion support
5. Your `html`
6. Explain it back (`recall`): text box saved per viewer, model answer, self-grade
7. Quiz (`quiz`): answers and explanations saved per viewer
8. Flashcards (`cards`): Again/Good, review gaps of 1, 3, 7, 14 and 30 days
9. Watch and read (`resources`) with verification tiers
10. Next (`next`)

## Rules for `html` and `draw()`

- Use the engine's CSS classes: `.steps`, `.analogy`, `.lab` + `.panel`, `.code` + `[data-ce-copy="#id"]`,
  `details.reveal`, `.two` + `.card`, `figure` + `.scroll.wide` + `svg.diagram`.
- Color SVG with the classes `s-fg s-muted s-box s-hi s-q s-k s-v s-mask` (fills), `l-q l-k l-v l-muted` (strokes)
  and `t-q t-k t-v` (text). They follow light and dark themes. Never use literal hex colors.
- A scene may use the arrow marker `url(#ce-arrow)`. A static figure in `html` defines its own marker id.
- Compute every number from one function shared by the scenes and the lab. Never type numbers in by hand.
- Escape `<` as `&lt;` inside `<pre>` code. Don't write `</script` anywhere: the build inlines the file in a script tag.

## Hub (several topics)

A catalog file calls `CE.setCatalog({ storeKey, title, lede, mapHtml, footer, phases: [{ name, topics: [{ num, id, title, blurb, resources }] }] })`.
Topics without a topic file show as "not built yet". With a catalog, `#hub` (or no hash) shows the hub, and `#<id>` shows a topic.
All topics share one storage area, so the hub can show status and due flashcards.

Build: `python3 scripts/build_page.py --artifact --catalog catalog.js --out hub.html topics/*.js`
