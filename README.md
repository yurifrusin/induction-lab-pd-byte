# Induction Lab

Induction Lab is a five-minute interactive segment for a 15-minute EDUC7604 PD Byte. It lets preservice teachers experience a Year 12 Tower of Hanoi task before revealing the mathematical induction underneath it.

## Live website

The published activity is available at:

**https://yurifrusin.github.io/induction-lab-pd-byte/**

Classroom tracking is also available as an optional mode. Teachers can create short join codes and watch pseudonymous learner progress update in real time. See `CLASSROOM_SETUP.md` for the one-time Supabase configuration.

## Use it immediately

Open `site/index.html` in a modern browser. For the most reliable clipboard and presentation behaviour, serve the folder locally instead:

```powershell
pnpm install
pnpm dev
```

Then open the local URL printed in the terminal and use browser full-screen mode.

## Five-minute facilitation run

| Time | Screen | Facilitation move |
|---|---|---|
| 0:00-2:00 | Play | Keep three discs selected. Invite the cohort to call out or make moves. Ask for predictions; do not name induction yet. |
| 2:00-3:00 | Notice | Ask, “What did finding seven moves actually prove?” Select the upper-bound response: it can be done in seven. |
| 3:00-4:30 | Prove | Focus on the largest disc. Select “all” to establish the unavoidable lower bound, then reveal the equality. |
| 4:30-5:00 | Debrief | Turn on Teacher lens. Name the design moves and copy the LLM build brief for participants. |

The header steps are directly selectable if the presenter needs to skip ahead. Teacher lens adds concise facilitation cues to the participant-facing screens.

## Mathematical and pedagogical through-line

- Put the problem before the method: exploration creates a need for proof.
- A found strategy establishes an upper bound (CAN); it does not prove a minimum.
- The largest disc forces every legal solution into `M(n) + 1 + M(n)` stages (MUST).
- The proposition must be strong enough to contain both achievability and minimality.
- Induction can explain recursive structure, not merely verify a supplied formula.
- A few checked examples are not the same as a universal claim.

These ideas were synthesised from the supplied deficient-chessboard/ordinary-induction chapters, the induction revision document, and the three-lesson Year 12 sequence. The EDUC7604 task description shaped the short timing, participant engagement, APST alignment, and safe/ethical ICT debrief.

## Interaction and access

- Click or tap a top disc, then choose a destination peg.
- Dragging is also supported on desktop.
- Keyboard users can activate discs and pegs with Enter or Space.
- Undo, reset, disc-count selection, live legal-move feedback and an optimal next-move hint are included.
- Optional classroom mode records stage, move count, hint count and conceptual responses for a live teacher dashboard.
- Motion respects `prefers-reduced-motion`, and all core controls have visible focus states and accessible names.

## Safe, responsible and ethical LLM use

The site models an LLM as a teacher's design collaborator, not an assessor or mathematical authority. It collects no student data, sends no prompts to an external service, and works entirely in the browser. Teachers should still verify the mathematics, test edge cases, review accessibility and keep a non-digital alternative available.

## Editable source

This repository contains the React + Vite project. Useful commands:

```powershell
pnpm install
pnpm dev
pnpm build
```

The production build is written to `dist`. The configured relative asset paths also allow the supplied `site/index.html` to open directly from disk.

## GitHub Pages deployment

Pushing to `main` automatically builds and publishes the site through the workflow in `.github/workflows/deploy-pages.yml`. The workflow deploys the generated `dist` directory and does not publish `node_modules` or local development files.
