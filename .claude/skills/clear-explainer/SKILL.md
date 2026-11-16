---
name: clear-explainer
description: Turns any topic, plan or study list into clear, easy-to-process material using four techniques - writing in ~80% ASD-STE100 Simplified Technical English, diagrams of the real mechanism, interactive HTML pages, and animated or narrated explainer "videos". Use this skill whenever the user asks to explain, teach, summarize or break down a concept; make a study guide, revision notes, cheat sheet, learning roadmap or research list; write a detailed plan, runbook, SOP or step-by-step guide; or says "make it simple", "explain like a manual", "STE", "ASD-STE100", "3Blue1Brown style", "explainer video" or "study page" - even if they don't name the skill. Prefer it over a plain chat answer whenever the material is something the user will study, follow or come back to.
---

# Clear Explainer

Make material that a tired reader understands on the first pass. The skill stacks four
techniques. Each one removes a different kind of reading effort:

| Technique | Removes | Default for |
|---|---|---|
| 1. ~80% STE writing | Parsing effort (long sentences, vague words) | Every output |
| 2. Diagrams | Assembly effort (building the mechanism in your head) | Any process, flow, structure or comparison |
| 3. Interactive HTML page | Passive reading (the reader can poke the idea) | Study guides, calculators, anything kept and revisited |
| 4. Explainer "video" | Attention effort (one idea at a time, in order) | Concepts with a sequence of steps |

You don't need all four every time. Pick the smallest set that does the job, using the
routing table below.

## Step 1: Route the request

| The user wants… | Writing | Diagram | HTML page | Video |
|---|---|---|---|---|
| A quick explanation in chat | yes | only if it's a flow (Mermaid or ASCII) | offer in one line | no |
| A detailed plan, roadmap or runbook | yes, numbered steps | timeline or dependency graph | yes if it will be tracked (use a checklist) | no |
| A study guide for one topic | yes | 1–3 mechanism diagrams | **yes** | **yes**, an in-page animated walkthrough |
| A study plan across many topics | yes | roadmap map of how topics feed each other | yes, one hub page with a section per topic | no, one per topic later |
| A calculator or "show me how X changes" | short | a chart driven by inputs | **yes** | no |
| "Make a 3Blue1Brown-style video" | narration script | the scenes are the diagrams | yes, as the player | **yes**, see `references/explainer-video.md` |

If the request names a topic list (like a research list), build **one** topic first as a sample,
then offer the rest. Building one first lets the user correct the format before you spend effort on ten.

## Step 2: Write in ~80% STE

Read `references/ste-rules.md` for the full rule set and before/after examples. The short version:

- One idea per sentence. Instructions max ~20 words, descriptions max ~25.
- Active voice, present tense. "The model computes the score," not "The score is computed."
- One word for one meaning. If you say "token" once, never switch to "word" or "piece" for the same thing.
- Simple, common verbs: *use, make, show, give, find, keep, stop*. Avoid *leverage, utilize, facilitate*.
- Steps are numbered and start with a verb. Warnings come *before* the step they apply to.
- Define each technical term once, in plain words, the first time it appears.

**Why only ~80%:** strict STE bans many words and reads like a maintenance manual. Keep the rules
that cut effort (short sentences, active voice, fixed terms) and relax the ones that kill tone
(allowed-word dictionary, banned "-ing" forms). Analogies, a light sense of humor and the occasional
longer sentence are fine when they carry understanding.

## Step 3: Draw the mechanism

Load the **`artifact-diagramming`** skill before you draw anything for a page. Its core rule:
draw the mechanism, not its name. A box labeled "attention" teaches nothing; the arrows from
the queries to the keys, the score on each arrow and the masked future tokens teach the idea.

- Label every arrow with what moves or happens (`q · k`, `writes`, `masks future`).
- One figure, one claim. Write the claim in the caption.
- For charts of numbers (loss curves, compounding, benchmarks), load **`dataviz`** instead.
- In chat or Markdown, use a Mermaid fence. In HTML, hand-written inline SVG themed with `currentColor`.

## Step 4: Build the interactive page

For any study guide, calculator or plan the user will keep, make an HTML artifact:

1. Call the Artifact tool with `action: "quickstart"` and `intent: "other"` (this loads the
   `artifact-design` guidance). For a deck use `intent: "slides"`. For an editable shared doc use the docs skill.
2. If the page must remember progress across devices or viewers, load **`artifact-capabilities`**.
   For per-viewer progress (quiz answers, "done" checkboxes), `localStorage` inside try/catch is enough.
3. Follow the page blueprint in `references/study-guide-page.md`. It lists the sections, in order,
   that make a page that teaches rather than just displays.
4. `assets/example-self-attention.html` is a complete worked example (self-attention, LLM
   fundamentals list). Read it for the structure and level of finish. Don't copy its content.

Artifact constraints to remember: no iframes (so no embedded YouTube; use link cards instead),
scripts only from the allowed CDNs, both light and dark themes, works at phone width.

## Step 5: Add the explainer "video" (when it helps)

Read `references/explainer-video.md`. There are three levels. Pick the lightest one that fits:

1. **In-page animated walkthrough (default):** a scene player inside the HTML page with
   Prev / Play / Next, one caption per scene and optional read-aloud by the browser's voice.
   It needs no keys or installs, and it lives next to the material.
2. **Manim script:** real 3Blue1Brown-style rendered video. Write the Python scene file and
   the render command. The user runs it locally (`manim -pqh file.py Scene`).
3. **Narrated video:** level 2 plus voice-over audio from an ElevenLabs API key. Ask for the key
   through the secure credential flow, never in chat.

## Step 6: Check the resources

When the user's material lists videos, papers or repos, check them. Use web search to confirm that
each one exists and what it covers, then show the result as **verified / unverified / wrong**. Never
invent a timestamp, URL or video title. If you can't confirm one, say so and link the channel or a search instead.

## Output checklist

Before you hand over the result, confirm:

- [ ] Every sentence passes the ~80% STE rules (spot-check the five longest).
- [ ] Each term keeps one name from start to end.
- [ ] Each diagram shows a mechanism and has a caption that states its claim.
- [ ] The page has a self-check (quiz or recall prompts). Reading without retrieval doesn't stick.
- [ ] Every resource link is verified or marked unverified.
- [ ] The reply offers the next step: the next topic, the Manim version, or a printable summary.
