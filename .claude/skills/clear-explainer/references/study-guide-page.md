# Study guide page blueprint

A study page teaches when it moves the reader through **see → understand → poke → recall → go deeper**.
Use these sections in this order. Drop a section only when the topic truly has nothing for it.

| # | Section | What it holds | Technique |
|---|---|---|---|
| 1 | Header | Where the topic sits in the user's list (for example "Phase 2 · Topic 3"), the title, a one-sentence definition, and a "mark as done" control | STE |
| 2 | Where it fits | A small map: what feeds this topic, what builds on it. Use the user's own list. | Diagram |
| 3 | Animated walkthrough | Scene player: 5–8 scenes, one idea each, a caption per scene, optional read-aloud | Video level 1 |
| 4 | The idea in steps | A numbered explanation. Each term in **bold** where it's defined. | STE |
| 5 | Mechanism diagram | The full pipeline with labeled arrows and tensor shapes | Diagram |
| 6 | Interactive lab | One or two controls that change the real math, with live numbers (sliders, toggles, clickable rows) | HTML |
| 7 | Code | The smallest real implementation (about 15–30 lines), with shape comments and a copy button | — |
| 8 | Key facts and common mistakes | Two short lists. Mistakes are the most useful part for interviews. | STE |
| 9 | Self-check quiz | 4–6 multiple-choice questions with an explanation for each answer. Save answers per viewer. | HTML |
| 10 | Watch and read | Link cards for the user's resources, each marked verified or unverified, with what to focus on | — |
| 11 | Next | The next topic in the list and how it connects | — |

## Rules that make the page work

- **Real numbers.** The walkthrough and the lab compute their numbers with the same small toy example,
  in JavaScript. Numbers you type by hand drift out of sync and teach wrong facts.
- **Consistent color encoding.** If a concept has roles (query/key/value, actor/critic, draft/target model),
  give each role one color and use it in prose, diagrams, lab and code comments.
- **Honest simplifications.** When the toy example simplifies something (2-D values, a single head),
  say so in one line.
- **No iframes.** Artifacts block embedded YouTube. Use link cards that open in a new tab.
- **Progress in `localStorage` in try/catch.** The page must still work when storage is blocked.
- **Respect `prefers-reduced-motion`.** The player should still step through scenes, just without transitions.
- **Phone width.** Wide SVGs and tables sit in their own `overflow-x: auto` wrapper.

## A hub page for a whole list

For a multi-topic list, make one page with a phase-by-phase roadmap at the top (a diagram of how
topics feed each other), then one collapsible section per topic using sections 1, 4, 8, 9 and 10 only.
Give each topic its own full page later, when the user asks for that topic.
