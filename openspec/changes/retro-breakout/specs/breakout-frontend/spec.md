## ADDED Requirements

### Requirement: Neon multi-color brick palette
Each brick row SHALL use a distinct neon color from the GeoCities-era palette: hot pink (#FF1493), electric cyan (#00FFFF), acid yellow (#FFFF00), lime green (#39FF14), deep purple (#9400D3).

#### Scenario: Brick rows have distinct colors
- **WHEN** bricks are rendered on the canvas
- **THEN** each of the 5 rows displays a unique neon color on a black background

### Requirement: Ball glow effect
The ball SHALL render with a neon glow effect using canvas shadowBlur to create an arcade feel.

#### Scenario: Ball renders with glow
- **WHEN** the ball is drawn on canvas
- **THEN** a colored shadow glow surrounds the ball (shadowBlur > 0, shadowColor matches ball color)

### Requirement: Ball afterimage trail
The ball SHALL leave a brief afterimage trail showing 3-4 previous positions with decreasing opacity.

#### Scenario: Trail renders behind ball
- **WHEN** the ball moves across the canvas
- **THEN** semi-transparent circles are drawn at the ball's 3-4 previous frame positions, fading from ~0.5 alpha to ~0.1 alpha

### Requirement: Paddle glow effect
The paddle SHALL render with a neon glow matching its color, consistent with the ball's glow treatment.

#### Scenario: Paddle renders with glow
- **WHEN** the paddle is drawn on canvas
- **THEN** a colored shadow glow surrounds the paddle

### Requirement: CRT scanline overlay
The game SHALL use the existing CRT screen wrapper with scanline overlay from `assets/styles.css`.

#### Scenario: Scanlines visible over game
- **WHEN** the game is displayed
- **THEN** the CRT scanline overlay from the shared styles is visible over the canvas

### Requirement: Responsive canvas scaling
The canvas SHALL scale to fit the viewport while maintaining its aspect ratio. The internal resolution remains 400×400.

#### Scenario: Canvas fills available width
- **WHEN** the viewport is narrower than 400px
- **THEN** the canvas scales down proportionally via CSS (max-width: 100%, height: auto)

#### Scenario: Pixel art preserved on scale
- **WHEN** the canvas is CSS-scaled
- **THEN** `image-rendering: pixelated` preserves the chunky retro look

### Requirement: Arcade cabinet wrapper
The game page SHALL use the existing arcade-cabinet HTML structure (header with back link, title, score; CRT screen; footer with controls).

#### Scenario: Game uses arcade-cabinet layout
- **WHEN** the breakout page is loaded
- **THEN** it displays within the arcade-cabinet div with header (MENU link, title, score), CRT screen, and footer

### Requirement: Game-over modal
When the game ends, a game-over overlay SHALL display the final score and a restart button.

#### Scenario: Game over displays overlay
- **WHEN** the player loses all lives
- **THEN** a game-over overlay appears showing the final score and an "INSERT COIN" restart button

### Requirement: Touch input prevention of scroll
The canvas SHALL prevent default touch scrolling behavior so mobile pointer input works without page scroll.

#### Scenario: No scroll on touch
- **WHEN** the player touches and moves on the canvas on mobile
- **THEN** the page does not scroll (touch-action: none applied)
