## Context

The VOTD Games site is a static GitHub Pages site with vanilla JS + HTML5 Canvas games. Two games exist (Snake, Word Guesser), both using an arcade-cabinet CRT wrapper with scanlines. The site has no build step, no frameworks, and no external dependencies. Games are self-contained in `games/<name>/` directories.

The user wants an early-90s internet aesthetic — specifically the neon, loud, GeoCities-era look rather than terminal green. The existing CRT scanline overlay provides the retro hardware feel; the color palette provides the era-specific nostalgia.

## Goals / Non-Goals

**Goals:**
- Deliver a complete, playable Breakout game with satisfying core loop
- Create a visually distinctive neon retro aesthetic that's memorable and bold
- Maintain consistency with the site's arcade-cabinet UI pattern
- Structure code for testability (pure game logic separated from rendering)
- Responsive canvas that scales to any viewport without breaking game physics

**Non-Goals:**
- Sound effects (silent game — consistent with existing games)
- Power-ups or complex mechanics (pure classic Breakout)
- Difficulty progression between levels (static difficulty, zen arcade loop)
- Mobile-specific UI (pointer events work on touch, but no dedicated mobile layout)
- Multiplayer or online features

## Decisions

### 1. Game Architecture: Separable Logic + Renderer

**Choice**: Split game into pure logic module (state, physics, collisions) and a thin rendering layer.

**Rationale**: Pure logic functions are testable without DOM/Canvas. The game loop calls logic functions that return new state, then renders that state. This enables TDD — tests exercise collision detection, scoring, and lives without mocking Canvas.

**Alternative considered**: Single monolithic game file (simpler but untestable without jsdom + canvas stubs for everything).

### 2. Visual Direction: Neon GeoCities Maximalism (frontend-design informed)

**Choice**: Commit to a **neon arcade maximalist** aesthetic:
- **Palette**: Hot pink (#FF1493), electric cyan (#00FFFF), acid yellow (#FFFF00), lime green (#39FF14), deep purple (#9400D3) — each brick row a different neon color on pure black (#000000) canvas background
- **Typography**: The existing site uses its arcade font stack. Game chrome (score, lives, headers) uses the same. On-canvas text (GAME OVER, LEVEL) rendered in bold pixelated style via canvas fillText with shadow glow
- **Atmosphere**: Neon glow effects on ball and paddle (canvas shadowBlur), CRT scanline overlay from shared styles, subtle pulsing glow on active elements
- **Differentiation**: The ball leaves a brief afterimage trail (3-4 frames of fading positions) — this is the one thing players will remember

**Rationale**: The frontend-design skill demands a bold, intentional aesthetic that avoids generic choices. Neon-on-black with glow effects is distinctly 90s-internet and visually striking. The ball trail adds a "wow" moment without gameplay complexity.

**Alternative considered**: Green phosphor monochrome (too similar to terminal aesthetic, less fun), amber CRT (warm but not exciting enough for a game).

### 3. Ball Physics: Position-Based Paddle Reflection

**Choice**: Ball reflection angle determined by where it hits the paddle. Center = straight up, edges = steep angles (up to ±60°).

**Rationale**: This is the universally expected Breakout mechanic. It gives players agency and skill expression. Without it, the game feels random.

**Implementation**: Calculate offset from paddle center as ratio (-1 to +1), map to angle range. Ball speed (magnitude) stays constant; only direction vector changes.

### 4. Canvas Sizing: Fixed Logic, CSS-Responsive Display

**Choice**: Canvas element has fixed `width="400" height="400"` attributes (game logic coordinates). CSS scales it to fit viewport with `max-width: 100%; height: auto`.

**Rationale**: Game physics use absolute pixel coordinates (paddle at y=380, bricks start at y=50, etc.). CSS scaling means zero math changes for different screen sizes. The pixelated upscale is intentionally retro — `image-rendering: pixelated` preserves the chunky aesthetic.

### 5. Input: Pointer Events + Keyboard

**Choice**: Use `pointermove` for paddle tracking (works for mouse and touch) and `ArrowLeft`/`ArrowRight` keys. Pointer input maps X position relative to canvas bounds.

**Rationale**: Pointer events unify mouse and touch. Keyboard provides desktop alternative. No need for separate touch handlers.

## Risks / Trade-offs

- **[Ball getting stuck in horizontal bounce]** → Enforce minimum vertical velocity component; if ball angle is too shallow, nudge it slightly toward vertical
- **[Canvas scaling on high-DPI displays]** → The pixelated look is intentional, but test on Retina to ensure scanlines still align. If needed, add `devicePixelRatio` scaling
- **[Pointer input on mobile with scroll]** → Use `touch-action: none` CSS on the canvas to prevent scroll interference
- **[Ball trail performance]** → Limit trail to 4 positions, use semi-transparent canvas fills rather than storing trail objects. At 60fps on a 400×400 canvas this is negligible
