---
tags: [skill-creator]
max_turns: 40
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, WebSearch]
---

Here are my rough notes on speculative decoding. Turn them into clean revision notes I can keep (just in chat is fine, no page needed).

- big model is slow bc it generates 1 token per forward pass
- idea: small "draft" model guesses next K tokens fast
- big "target" model checks all K guesses in ONE parallel forward pass
- accept guess tokens while they match what big model wants, reject at first mismatch, resample from there
- output quality is slightly worse than big model alone since small model wrote some tokens, thats the tradeoff for speed
- speedup ~2-3x per the paper (Leviathan et al 2023)
- works best when draft model agrees with target a lot (easy tokens)
