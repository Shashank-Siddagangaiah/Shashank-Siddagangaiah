# Edge cases

| Situation | What to do |
|---|---|
| A quick question ("quick q", "what's the difference between…") | Tier T0: a short chat answer in STE, under ~250 words. Offer a page in one line. Don't build one. |
| "Just in chat", "no page" | Respect it, even for a study guide. Use Markdown and a Mermaid diagram. |
| A non-technical topic (history, economics, law, biology) | Replace code and a math lab with a timeline, a cause-and-effect map, a worked case, or a comparison table. A lab is optional: use one only when a real model exists (for example, leverage vs. capital loss). |
| A math-heavy topic | Use HTML entities and `<sub>`/`<sup>` for short formulas. For heavy LaTeX, load KaTeX from cdnjs as a script, and inline its CSS, because stylesheet hosts other than Google Fonts are blocked. |
| A topic with no ordered process (a taxonomy, a comparison) | Skip the walkthrough. Use a comparison table or a concept map instead. |
| The user gives notes, slides or a PDF | Treat the user's material as the source of truth for scope and order. Keep every point. **Flag** errors clearly ("Correction: …"); don't silently fix them. Read PDFs with the `pdf` skill. |
| The user's material has a factual error | Put the correction first, quote the original line, give the right statement and its source. |
| Unknown level | Infer the level from the request (a research list with papers means an intermediate learner). If you can't infer it and the choice changes the output a lot, ask one question: beginner, working knowledge, or interview prep. |
| Web search not available | Mark every link `search` and say in the reply that you couldn't check links. |
| Network blocks direct page fetches | Use web search results to set tiers (see `sources.md`). Never report a link as checked when you only remembered it. |
| No Artifact tool (another surface, or a subagent told not to publish) | Write a standalone file: `build_page.py` without `--artifact`. In chat-only surfaces, use Markdown + Mermaid. |
| A language other than English | Apply the STE principles (short sentences, active voice, one term per meaning) in that language. Keep technical terms in English with a one-time gloss. |
| A long list (20+ topics) | Build the hub first. Build topic pages on request, one or two at a time. |
| Several topics in one request | Build one full topic as a sample, then offer the rest. Building one first lets the user correct the format before you spend effort on ten. |
| Fast-changing topic (tools, prices, model names) | Fill the `checked` date. Use "as of <date>" in the text for numbers that change. |
| Color-blind readers | Never use color alone. Every role color also has a label (Q/K/V, "draft"/"target"). |
| Speech API missing, reduced motion, phone width, storage blocked | The engine already handles these. Run `check_page.js` to confirm. |
| The user asks for a real video file | Follow `explainer-video.md` levels 2–3. Say what must be installed and what costs money (ElevenLabs characters). |
| Sensitive topics (medical, legal, financial decisions) | Teach the concept. Say the page is for learning, not advice, and link the primary authority (official guidance). |
