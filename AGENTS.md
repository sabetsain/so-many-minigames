# AGENTS.md — Agent Onboarding Guide

## ⚠️ PATH Setup (Critical!)

When the Copilot app runs bash, it uses a stripped PATH that **excludes `/opt/homebrew/bin`**.

**Before using any Homebrew-installed tools, run:**

```bash
export PATH="/opt/homebrew/bin:$PATH"
```

This is required for:
- `openspec` CLI
- Any `brew`-installed binaries
- Tools not in `/usr/bin` or `/usr/local/bin`

Without this, commands like `openspec` will fail with "command not found."

---

## Project Overview

**Purpose:** AI-friendly game jam site for browser-based mini-games.

**Key characteristics:**
- Static site (no build step), deployed to GitHub Pages
- Vanilla JS + HTML5 Canvas only — **no frameworks, no npm for game code**
- Games live in `games/<name>/index.html` + `games/<name>/<name>.js`
- Shared styles at `assets/styles.css` (import with `../../assets/styles.css`)
- Home page game grid is in `index.html` — add a card there for each new game

---

## Running & Testing

**No build step** — open HTML files directly or use:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

**Tests:**

```bash
npm test
```

- Node.js native test runner + jsdom
- Test files in `tests/` directory
- Stub canvas context, use JSDOM for DOM simulation

---

## OpenSpec Workflow

**OpenSpec CLI** is installed at `/opt/homebrew/bin/openspec` (not in Copilot's default PATH — see PATH fix above).

**Schema:** `spec-driven` (proposal → design → specs → tasks)

**Changes tracked in:** `openspec/changes/<name>/`

**Skills available in:** `.github/skills/` — use them via Copilot chat

**When to use OpenSpec:**
- For planned multi-phase features or complex changes
- For quick one-off games, OpenSpec is optional

**Typical flow:**

```bash
openspec new my-feature          # Start a change
openspec continue                # Create next artifact
openspec apply                   # Implement tasks
openspec archive                 # Complete and archive
```

---

## Coding Conventions

**JavaScript:**
- Vanilla JS (ES6 OK), no transpilation, no bundler
- Canvas 2D rendering, 60fps game loops
- localStorage for persistence (use unique prefixes, e.g., `tictactoe_highscore`)

**Input handling:**
- Handle both mouse and touch
- Use `pointerdown`, `pointermove`, `pointerup` events

**Aesthetic:**
- Arcade-style: CRT screens, retro fonts, game-over modals
- Consistent with existing games in the project

**Libraries:**
- Don't use CDN libraries except `playhtml` (for real-time sync features only)
- Keep games self-contained and portable

---

## New Game Checklist

1. **Create game files:**
   - `games/your-game/index.html`
   - `games/your-game/your-game.js`

2. **Link shared styles:**
   ```html
   <link rel="stylesheet" href="../../assets/styles.css">
   ```

3. **Add game card to `/index.html`:**
   - Use existing card structure
   - Include game name, description, and link

4. **Optionally add tests:**
   - Create `tests/your-game.test.js`
   - Follow existing test patterns (stub canvas, use jsdom)

5. **Test locally:**
   - Open `games/your-game/index.html` in a browser
   - Or serve with `python3 -m http.server 8000`

6. **Verify:**
   - Game loads and runs
   - Styles are applied
   - Input (mouse/touch) works
   - No console errors

---

## Quick Tips

- **PATH first:** Always export PATH before using `openspec` or Homebrew tools
- **Static site:** No build, no bundler, no npm dependencies in game code
- **Vanilla JS only:** Keep it simple, keep it portable
- **Test in browser:** The real environment is the best test
- **OpenSpec optional:** Use for complex features, skip for quick games
