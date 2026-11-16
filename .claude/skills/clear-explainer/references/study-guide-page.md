# Study page blueprint

A study page teaches when it moves the reader through
**check prerequisites → predict → see → understand → poke → work it out → recall → review → go deeper**.
Reading alone feels like learning but fades fast. Recall, self-testing and spaced review make it last,
so the page builds them in.

## Build with the engine (default)

Don't hand-write the player, quiz, storage and theme code for each page. The engine already has them,
tested at phone width, in both themes, with storage blocked and with reduced motion.

1. Copy `assets/example-topic.js` to a new file. Fill the fields in `assets/topic.schema.md`.
2. Write the topic's own sections in `html` (list below), and its lab in `init(root)`.
3. Build: `python3 scripts/build_page.py --artifact --out <scratchpad>/<id>.html <topic>.js`
   (leave off `--artifact` for a standalone file to download).
4. Check: `node scripts/check_page.js <file> --text <file>.txt`, then `python3 scripts/ste_lint.py <file>.txt`.
5. Publish the built file with the Artifact tool. Keep the topic `.js` as the source for later edits.

Hand-write a page only when the engine truly doesn't fit (a game, a tool with no learning sections).

## Sections, in order

The engine renders the rows marked **E** from data. You write the others in `html`.

| # | Section | Holds | Who |
|---|---|---|---|
| 1 | Header | Breadcrumb, title, one-sentence definition, checked date, "mark as done" | E |
| 2 | Before you start | 2–3 things the reader must already know, linked to their topics | E |
| 3 | Predict first | One question answered **before** the explanation | E |
| 4 | Walkthrough | 5–8 scenes, one idea each, real numbers | E (you write the scenes) |
| 5 | Where it fits | A small map: what feeds this topic, what builds on it | you |
| 6 | The idea in steps | Numbered STE steps. **Bold** each term where it's defined. One analogy, with where it breaks. | you |
| 7 | Mechanism diagram | The full pipeline with labeled arrows (and tensor shapes for ML) | you |
| 8 | Lab | 1–2 controls that change the real computation, with live numbers | you (`init`) |
| 9 | Work it out by hand | One small calculation or trace, answer behind a `details.reveal` | you |
| 10 | Code | The smallest real implementation, with shape comments and a copy button | you |
| 11 | Key facts / common mistakes | Two short lists. The mistakes list helps most in interviews and exams. | you |
| 12 | Explain it back | 1–3 free-recall prompts with model answers | E |
| 13 | Quiz | 4–6 multiple-choice questions with an explanation for every answer | E |
| 14 | Flashcards | 6–10 cards with spaced review | E |
| 15 | Watch and read | Resources in watch order, each with a verification tier | E |
| 16 | Next | The next topic and how it connects | E |

For non-technical topics, see `edge-cases.md`: swap 7, 8 and 10 for a cause map, a timeline or a worked case.

## Rules that make the page teach

- **One source of numbers.** The walkthrough, the lab and the hand exercise all compute from one function.
  Hand-typed numbers drift out of sync and teach wrong facts.
- **One color per role**, used the same way in prose, diagrams, lab and code comments, and always with a text label.
- **Honest simplifications.** When the toy example simplifies something (2-D values, one head), say so in one line.
- **Good distractors.** Wrong quiz options are real misconceptions, about the same length as the right one.
  Every explanation says why the right answer is right, not only that it is.
- **Recall before recognition.** Free-recall prompts come before the multiple-choice quiz.
- **No iframes.** Artifacts block embedded YouTube. Use resource cards that open in a new tab.

## Hub for a list of topics

For a list of more than one topic, build a hub with `CE.setCatalog` (see `topic.schema.md`):
a roadmap diagram of how topics feed each other, one row per topic with status, verified links, and due flashcards.
Build full topic pages one or two at a time, when the user asks. All pages share one storage area through the hub.
