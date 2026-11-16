# Plans, runbooks and SOPs

A plan is read once and then **followed**. Optimize it for the person who comes back to it on
week 3 and needs to know what to do tonight.

## Detailed plan (study plan, project plan, roadmap)

Use this structure. Drop sections the request doesn't need.

1. **Goal and constraints:** one sentence each. Repeat the user's numbers (5 h/week, 6 weeks, evenings only)
   so they can see you used them.
2. **Order and why:** the sequence, plus one line for each change from the user's own order
   ("BPE before attention, because attention reads BPE's token ids").
3. **Dependency or timeline diagram:** Mermaid `flowchart LR` or `gantt` in chat. Inline SVG in a page.
   Label the arrows with what flows ("token ids", "gradients").
4. **Week by week (or phase by phase).** For each one:
   - hours planned (the total must fit the budget; show it)
   - numbered steps, each starting with a verb, each with a time estimate
   - **Done when:** a checkable deliverable ("your micrograd matches PyTorch's gradients to 1e-6")
   - one self-check question
5. **Buffer:** at least 10% of the time, at the end, for slips.
6. **Risks:** the 2–3 places people usually get stuck, and what to do then.

Default output: Markdown in chat (the user asked for a plan, not a page). Offer a tracker page with
checkboxes in one line. Build the tracker only when the user asks, or when they say they will follow it day to day.

## Runbook or SOP (operations, deployment, setup)

- **Before you start:** access, tools, and the state the system must be in.
- **Steps:** numbered, one action each, starting with a verb. Put the exact command in a code block.
- **Check:** after each risky step, the command that proves it worked and the expected output.
- **Warnings come before the step** they apply to (STE rule K8). Use "Warning:" for risk to people or data,
  "Caution:" for risk to equipment or service.
- **Rollback:** for each irreversible step, how to undo it, or "cannot be undone" in bold.
- **Owner and date** at the top, for every runbook.

## Self-check for plans

- [ ] Every week fits the time budget, and the total is shown.
- [ ] Prerequisites come before what depends on them.
- [ ] Every step starts with a verb, and `ste_lint.py` passes.
- [ ] Every week has a "done when".
- [ ] Nothing in the plan needs a tool or account the user didn't mention, unless the plan says how to get it.
