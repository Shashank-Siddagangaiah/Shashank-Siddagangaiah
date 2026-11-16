# ~80% ASD-STE100: writing rules

ASD-STE100 (Simplified Technical English) is a controlled language from aerospace
maintenance manuals. Mechanics read it under time pressure, often in a second language,
so every rule exists to stop a misreading. Follow the **keep** rules strictly. Treat the
**relax** rules as guidance.

## Keep (these cut most of the reading effort)

| # | Rule | Why |
|---|---|---|
| K1 | One topic per sentence. Split sentences that join two ideas with "and", "which" or a semicolon. | The reader holds one idea at a time. |
| K2 | Procedures: max ~20 words per sentence. Descriptions: max ~25. | Long sentences get re-read. |
| K3 | Active voice. Name who or what does the action. | Passive voice hides the actor ("the weights are updated" by what?). |
| K4 | Present tense for how things work. | "The model computes" is easier than "the model will have computed". |
| K5 | One word = one meaning, and one meaning = one word. Pick the term and never swap it. | Synonyms make the reader ask "is this a different thing?" |
| K6 | Number the steps. Start each step with a verb in command form. | The reader can find their place and act. |
| K7 | One instruction per step, unless two actions happen at the same time. | Combined steps get half-done. |
| K8 | Put a warning or caution **before** the step it applies to. | After the step is too late. |
| K9 | Define each technical term in plain words when it first appears. | The reader shouldn't need another tab. |
| K10 | Use articles ("the", "a") and don't drop words to make noun stacks. Write "the score of the query against each key", not "query-key score matrix value". | Noun stacks have several possible readings. |

## Relax (strict STE makes text robotic here)

| # | Strict STE rule | What to do instead |
|---|---|---|
| R1 | Use only words from the approved dictionary. | Use common everyday words. Avoid jargon you don't define and corporate verbs (*leverage, utilize, facilitate, synergize*). |
| R2 | No "-ing" forms. | Allowed when clear ("the training loop", "masking"). |
| R3 | No analogies or figurative language. | Use one good analogy per concept when it carries the idea, and mark where it stops working. |
| R4 | Never more than 25 words. | An occasional longer sentence is fine if it has only one idea. |
| R5 | Neutral, flat tone. | A light, human tone is fine. Keep it plain. |

## Before / after

**Before:** "Self-attention is a mechanism whereby, through the utilization of learned projections,
each token is enabled to selectively aggregate contextual information from other positions,
weighted by compatibility scores that are normalized via softmax."

**After (~80% STE):** "Self-attention lets each token collect information from the other tokens.
Each token asks a question (its *query*). Every token offers a label (its *key*). The model compares
the query with each key and gets a score. Softmax turns the scores into weights that add up to 1.
The token then takes a weighted mix of the other tokens' *values*."

**Before (plan):** "We should probably look at getting the data pipeline migrated sometime after the
schema stuff is sorted, assuming the team has bandwidth."

**After:**
1. Finish the schema changes. Owner: Priya. Due: 3 March.
2. Migrate the data pipeline. Start only after step 1 is done. Owner: Ravi. Due: 17 March.
   - Caution: Freeze writes to the old pipeline before you start the migration.

## Fast self-check

Read the draft and flag each sentence with:
- more than one main verb joined by "and" or "which" → split it (K1)
- "is/are/was/were + past participle" with no actor → make it active (K3)
- a new word for a term you already named → change it back (K5)
- a step that doesn't start with a verb → rewrite (K6)
