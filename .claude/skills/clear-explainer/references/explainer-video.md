# Explainer "videos"

Pick the lightest level that does the job. Level 1 is the default inside study pages.

## Level 1: in-page animated walkthrough (default; built and tested)

The engine's scene player (`assets/engine.js`) does this. You only write the `scenes` array
(see `assets/topic.schema.md`). It gives: an SVG stage, a progress bar, Prev/Play/Next, scene dots,
speed 0.75–1.5×, read-aloud with the browser's voice, a transcript, arrow-key control, autoplay that
waits for the speech to end, and no motion under `prefers-reduced-motion`.

What makes scenes good:
- **5–8 scenes, one idea each.** The caption is one or two STE sentences. It is also the narration script.
- **Real numbers.** Each `draw()` reads from the same function as the lab, so the walkthrough and the lab agree.
- **Change one thing per scene.** Keep the layout fixed and change only what the scene is about,
  so the eye goes straight to the change (this is most of what makes 3Blue1Brown-style animation readable).
- **Follow one example all the way.** One token, one query point, one mortgage. Generalize only in the last scene.
- **Stage size is 720×340.** Keep text 11–14px, labels short. Sentences go in the caption, not on the stage.

### Scene plan template

| Scene | Shows | Caption (narration) |
|---|---|---|
| 1 | The input | What goes in, in one sentence |
| 2 | The first transformation | What each part becomes |
| 3 | The key comparison or computation | The core idea, with a real number |
| 4 | The constraint or trick | Why it's needed |
| 5 | The result | What comes out, with a real number |
| 6 | The general form | The same thing for all inputs at once (matrix or formula) |

## Level 2: Manim script (true 3Blue1Brown style; on request, not tested here)

Manim Community Edition is the open-source library used for 3Blue1Brown-style videos.

1. Write one Python file with one `Scene` class per scene from the plan above.
2. Use `MathTex` for formulas, `Matrix` for small matrices, and `Transform` or `ReplacementTransform`
   to morph one step into the next. Keep each scene at 10–25 seconds.
3. Give the user the commands to run, each in its own block:
   - `pip install manim`
   - `manim -pqh explainer.py AttentionScene` (`-ql` for a fast low-quality preview)
4. Manim needs FFmpeg and, for `MathTex`, a LaTeX install. Say so up front.

## Level 3: narrated video (Manim + ElevenLabs; on request, not tested here)

1. Write the narration script: the scene captions, expanded to about 150 words per minute of video.
2. Get an ElevenLabs API key through the secure credential request (host `api.elevenlabs.io`,
   header `xi-api-key`). Never ask the user to paste a key in chat.
3. Generate one audio file per scene with the text-to-speech endpoint, so each scene's length
   can match its audio.
4. Join the audio and the rendered scenes with FFmpeg, or use the `manim-voiceover` plugin,
   which syncs animation timing to the audio.

The user's ElevenLabs plan sets limits on characters per month. Estimate the character count
of the script before you generate audio.
