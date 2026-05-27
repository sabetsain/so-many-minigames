## Why

The VOTD Games site currently has two games (Snake, Word Guesser) and a "Coming Soon" placeholder. Adding a Breakout-style game fills the third slot with a classic arcade experience that evokes early-90s internet nostalgia — neon colors, CRT aesthetics, and simple pick-up-and-play gameplay.

## What Changes

- Add a new Breakout game at `games/breakout/` (HTML + vanilla JS Canvas game)
- Replace the "Coming Soon" card on the home page with a playable Breakout link
- Introduce a neon multi-color GeoCities-era visual theme for the game
- Add test coverage for core game mechanics

## Capabilities

### New Capabilities
- `breakout-gameplay`: Core Breakout mechanics — paddle control (keyboard + pointer), ball physics with position-based reflection, 5×8 brick grid, collision detection, 3 lives, scoring, and static-difficulty level progression
- `breakout-frontend`: Retro visual presentation — neon multi-color palette (hot pink, cyan, yellow, lime on dark), CRT scanline overlay, arcade-cabinet wrapper, responsive CSS-scaled 400×400 canvas, game-over modal
- `breakout-integration`: Home page integration — game card in slot #03, localStorage high score persistence (`breakout_highscore`)

### Modified Capabilities
<!-- None — this is a new addition with no changes to existing specs -->

## Impact

- **New files**: `games/breakout/index.html`, `games/breakout/breakout.js`, `tests/breakout.test.js`
- **Modified files**: `index.html` (home page — replace Coming Soon card)
- **Dependencies**: None (vanilla JS, no external libraries)
- **Styles**: Uses existing `assets/styles.css` arcade-cabinet/CRT classes; game-specific colors rendered on canvas
