# Connecting other skills

This skill decides **what** to make. Other skills know **how** to make specific outputs well.
Load the one you need at the moment you need it, not all of them up front.

| Need | Use | Notes |
|---|---|---|
| A mechanism diagram in a page | `artifact-diagramming` | Load before drawing. Draw the mechanism, label the arrows, one claim per figure. |
| A chart of numbers (loss curve, benchmark, compounding) | `dataviz` | Load before choosing chart colors or marks. |
| Any HTML page | Artifact `quickstart` with `intent: "other"` | It returns the page contract and design guidance (`artifact-design`). The engine already follows it, so a quickstart is enough. |
| Progress synced across devices or shared with a study group | `artifact-capabilities` | Only when the user's capability roster offers it. Otherwise keep `localStorage`. |
| An "Ask Claude about this page" box | `artifact-capabilities` | Same rule: only if the roster has it. |
| A printable or editable summary, notes, or a plan the user will edit | `anthropic-skills:docs` | Use `docx` or `pdf` only when the user asks for that file type. |
| A teaching deck | Slides artifact type (quickstart `intent: "slides"`) | Use `pptx` only when the user asks for a .pptx file. |
| A study schedule or tracker people will edit | Sheets artifact type | Use `xlsx` only when the user asks for an Excel file. |
| A topic that needs research across many sources first | `anthropic-skills:deep-research` | Use the research report as the source material, then explain it with this skill. |
| Reading the user's PDFs or papers | `anthropic-skills:pdf` | |
| Review reminders ("remind me to revise every 3 days") | Scheduled tasks | Only when the user asks. |

## Order of work for a study page

1. This skill: decide the tier, plan the sections, write in STE.
2. `sources.md`: check facts and links.
3. `artifact-diagramming` / `dataviz`: draw.
4. `assets/topic.schema.md`: fill the topic file → `scripts/build_page.py` → `scripts/check_page.js`.
5. Artifact publish (with `--artifact` build output).
