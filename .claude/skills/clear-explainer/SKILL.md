---
name: clear-explainer
description: Use this skill for any request to teach, explain, study, revise or follow something - study guides, revision sheets or notes, exam or interview prep, turning messy lecture notes into clean notes, learning roadmaps and curricula for yourself or a team, deep "help me really understand X" explanations, 3Blue1Brown-style or animated or interactive explainers, "explain like a manual" or STE writing, and step-by-step plans, runbooks or SOPs that people will follow. It writes in ~80% ASD-STE100 Simplified Technical English, draws diagrams of the real mechanism, checks facts and links, and builds interactive study pages (animated walkthrough, recall prompts, quiz, flashcards) or a hub for a list of topics. Use it even when the user does not name it, and for a single concept they want to understand well. Not for pure coding, proofreading, translation, contract review, data dashboards or one-line trivia.
---

# Clear Explainer

Make material that a tired reader understands on the first pass and still remembers next week.
Four techniques, each removing a different kind of effort:

| Technique | Removes | Reference |
|---|---|---|
| ~80% STE writing | Parsing effort | `references/ste-rules.md`, `scripts/ste_lint.py` |
| Mechanism diagrams | Assembly effort (building the picture in your head) | `artifact-diagramming` skill |
| Interactive study page | Passive reading | `references/study-guide-page.md`, `assets/engine.js` |
| Animated walkthrough | Attention effort (one idea at a time) | `references/explainer-video.md` |

On top of these, the page adds what reading alone lacks: prediction, free recall, self-testing and spaced review.

## Step 1: Pick the depth tier

Use the **lowest tier that does the job**. A heavy page for a quick question wastes the user's time.

| Tier | Output | Use when |
|---|---|---|
| **T0** | Chat answer in STE, under ~250 words. No diagram. | A quick question, a definition, a "what's the difference". End with a one-line offer of more. |
| **T1** | Chat answer in STE + a Mermaid diagram + tables | An explanation the user reads once; a plan; notes cleanup; anything the user says to keep "in chat". |
| **T2** | One interactive study page (engine) | The user wants to study, revise or come back to one topic ("study guide", "revise from", "before interviews"). |
| **T3** | A hub page + topic pages on request | A list of topics. Build the hub and **one** sample topic first, then offer the rest. |

Plans and runbooks are T1 by default (`references/plan-and-runbook.md`). Make a tracker page only if the user asks or will follow it day to day.
When the user says "in chat" or "no page", stay at T0/T1 whatever the topic.
For anything unusual (non-technical topics, the user's own notes, no web access, other languages), read `references/edge-cases.md`.

## Step 2: Write in ~80% STE

Read `references/ste-rules.md`. The core: one idea per sentence (≤ 20 words for steps, ≤ 25 for descriptions),
active voice, present tense, one term per meaning, numbered steps that start with a verb, warnings before the step,
each term defined in plain words the first time. Keep a natural tone: analogies (with where they break) are welcome.

Check it: `python3 scripts/ste_lint.py <file>`. Aim for at least 80% clean sentences.

## Step 3: Get the facts and links right

Read `references/sources.md` before you add any link or non-obvious fact.
- Show a verification tier on every link: **official page found**, **confirmed by third party**, or **search link**.
- Never invent a URL, YouTube ID or timestamp.
- Run the code you show (or an equivalent check if a library can't be installed), recompute toy numbers, and list any claim you couldn't check.
- When the user gives notes, keep their content, and flag errors openly at the top ("Correction: …").

## Step 4: Draw the mechanism

Load `artifact-diagramming` before drawing for a page (`dataviz` for charts of numbers).
Draw what moves and what changes, label every arrow, one claim per figure, caption states the claim.
In chat, use a Mermaid fence.

## Step 5: Build the page (T2 / T3)

Use the engine. Don't hand-write the player, quiz and storage code again.

1. Call Artifact `quickstart` with `intent: "other"` once per new page (it loads the design contract).
2. Copy `assets/example-topic.js`. Fill it using `assets/topic.schema.md` and the section list in `references/study-guide-page.md`.
3. Build: `python3 scripts/build_page.py --artifact --out <scratchpad>/<id>.html <topic>.js` (add `--catalog` for a hub).
4. Check: `node scripts/check_page.js <file> --text <file>.txt`, then `python3 scripts/ste_lint.py <file>.txt`.
   Fix every FAIL before you publish.
5. Publish the built file with the Artifact tool. Keep the topic `.js` as the source for later edits.

If the session has no Artifact tool, build without `--artifact` and give the user the `.html` file.

## Step 6: Hand off to other skills when they fit

Read `references/skill-connections.md`: docs for an editable summary, Slides for a teaching deck, Sheets for a tracker,
deep-research when a topic needs multi-source research first, pdf for the user's papers, artifact-capabilities for synced progress.

## Before you reply

- [ ] The tier fits the request (no page for a quick question; no page when the user said "in chat").
- [ ] `ste_lint.py` passes, and each term keeps one name.
- [ ] Every diagram shows a mechanism, with a caption that states its claim.
- [ ] Every link has a tier. No link or fact is called checked unless you checked it.
- [ ] Code ran (or the page says it didn't), and the numbers match.
- [ ] Pages: `check_page.js` passes; the page has predict, recall, quiz and flashcards.
- [ ] The reply is short. It gives the link or answer, what was checked, what wasn't, and one next step.
