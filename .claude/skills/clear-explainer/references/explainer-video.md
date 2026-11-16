# Explainer "videos"

Pick the lightest level that does the job. Level 1 is the default inside study pages.

## Level 1: in-page animated walkthrough (no installs, no keys)

A scene player built into the HTML page.

- **Structure:** an `<svg>` stage, a caption area, and controls: Prev, Play/Pause, Next, scene dots,
  and a "Read aloud" toggle.
- **Scenes:** 5–8. One idea per scene. Each scene is a function that draws the stage from the shared
  toy data, so the numbers match the lab further down the page.
- **Caption:** one or two ~80% STE sentences per scene. The caption is also the narration text.
- **Read aloud:** `window.speechSynthesis` with `SpeechSynthesisUtterance`. Wrap it in try/catch and
  hide the toggle if the API is missing. Start speech only from a click (browsers block autoplay audio).
- **Autoplay:** when playing, move to the next scene when the speech ends, or after ~7 s without speech.
- **Motion:** a short fade or slide per scene. Under `prefers-reduced-motion`, switch scenes with no transition.
- **Keyboard:** left and right arrow keys step through scenes when the player has focus.

### Scene plan template

| Scene | Shows | Caption (narration) |
|---|---|---|
| 1 | The input | What goes in, in one sentence |
| 2 | The first transformation | What each part becomes |
| 3 | The key comparison or computation | The core idea, with a real number |
| 4 | The constraint or trick | Why it's needed |
| 5 | The result | What comes out, with a real number |
| 6 | The general form | The same thing for all inputs at once (matrix or formula) |

## Level 2: Manim script (true 3Blue1Brown style)

Manim Community Edition is the open-source library used for 3Blue1Brown-style videos.

1. Write one Python file with one `Scene` class per scene from the plan above.
2. Use `MathTex` for formulas, `Matrix` for small matrices, and `Transform` or `ReplacementTransform`
   to morph one step into the next. Keep each scene at 10–25 seconds.
3. Give the user the commands to run, each in its own block:
   - `pip install manim`
   - `manim -pqh explainer.py AttentionScene` (`-ql` for a fast low-quality preview)
4. Manim needs FFmpeg and, for `MathTex`, a LaTeX install. Say so up front.

## Level 3: narrated video (Manim + ElevenLabs)

1. Write the narration script: the scene captions, expanded to about 150 words per minute of video.
2. Get an ElevenLabs API key through the secure credential request (host `api.elevenlabs.io`,
   header `xi-api-key`). Never ask the user to paste a key in chat.
3. Generate one audio file per scene with the text-to-speech endpoint, so each scene's length
   can match its audio.
4. Join the audio and the rendered scenes with FFmpeg, or use the `manim-voiceover` plugin,
   which syncs animation timing to the audio.

The user's ElevenLabs plan sets limits on characters per month. Estimate the character count
of the script before you generate audio.
