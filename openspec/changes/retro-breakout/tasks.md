## 1. Project Scaffolding

- [ ] 1.1 Create `games/breakout/index.html` with arcade-cabinet structure (header, CRT screen, canvas 400×400, footer, game-over overlay) linking `../../assets/styles.css` and `./breakout.js`
- [ ] 1.2 Create `games/breakout/breakout.js` with module structure: game state object, pure logic functions, render function, and game loop skeleton
- [ ] 1.3 Create `tests/breakout.test.js` with test infrastructure (jsdom setup, canvas context stub)

## 2. Paddle Control (TDD vertical slices)

- [ ] 2.1 RED: Write test — paddle clamps to left boundary (x cannot go below 0)
- [ ] 2.2 GREEN: Implement `clampPaddle(state)` function that constrains paddle x to [0, canvasWidth - paddleWidth]
- [ ] 2.3 RED: Write test — paddle clamps to right boundary
- [ ] 2.4 GREEN: Verify passes with existing clamp implementation
- [ ] 2.5 RED: Write test — `movePaddle(state, direction)` updates paddle x by speed
- [ ] 2.6 GREEN: Implement `movePaddle` that adjusts x and calls clampPaddle
- [ ] 2.7 Wire up keyboard (ArrowLeft/ArrowRight) and pointermove event handlers in breakout.js

## 3. Ball Physics (TDD vertical slices)

- [ ] 3.1 RED: Write test — `moveBall(state)` updates ball position by (dx, dy)
- [ ] 3.2 GREEN: Implement `moveBall` as pure state transform
- [ ] 3.3 RED: Write test — ball reflects off top wall (dy inverts when y ≤ 0)
- [ ] 3.4 GREEN: Implement top-wall reflection in `reflectWalls(state)`
- [ ] 3.5 RED: Write test — ball reflects off side walls (dx inverts at x ≤ 0 or x ≥ canvasWidth)
- [ ] 3.6 GREEN: Implement side-wall reflection
- [ ] 3.7 RED: Write test — ball passing bottom returns `lifeLost: true`
- [ ] 3.8 GREEN: Implement bottom-boundary detection

## 4. Paddle Collision (TDD vertical slice)

- [ ] 4.1 RED: Write test — ball contacting paddle center reflects nearly straight up (angle ≈ 0)
- [ ] 4.2 GREEN: Implement `reflectOffPaddle(state)` with position-based angle calculation
- [ ] 4.3 RED: Write test — ball contacting paddle edge reflects at steep angle (±60°)
- [ ] 4.4 GREEN: Verify angle calculation covers edge cases

## 5. Brick Grid & Collision (TDD vertical slices)

- [ ] 5.1 RED: Write test — `createBricks()` returns 5×8 grid (40 bricks) with row colors
- [ ] 5.2 GREEN: Implement `createBricks()` returning array of brick objects with position, width, height, color, active flag
- [ ] 5.3 RED: Write test — `checkBrickCollision(state)` detects hit, removes brick, inverts ball dy, adds 10 to score
- [ ] 5.4 GREEN: Implement brick collision detection (AABB overlap check)
- [ ] 5.5 RED: Write test — all bricks cleared triggers level complete (fresh grid, level increments)
- [ ] 5.6 GREEN: Implement level completion logic

## 6. Lives & Game Over (TDD vertical slices)

- [ ] 6.1 RED: Write test — new game starts with 3 lives
- [ ] 6.2 GREEN: Implement initial state with lives = 3
- [ ] 6.3 RED: Write test — losing a life decrements lives and resets ball to paddle
- [ ] 6.4 GREEN: Implement life loss handling
- [ ] 6.5 RED: Write test — lives reaching 0 sets gameOver flag
- [ ] 6.6 GREEN: Implement game-over state transition

## 7. Scoring & Persistence (TDD vertical slice)

- [ ] 7.1 RED: Write test — high score updates in localStorage when current score exceeds stored value
- [ ] 7.2 GREEN: Implement `updateHighScore(score)` with localStorage read/write
- [ ] 7.3 RED: Write test — high score does NOT update when current score is lower
- [ ] 7.4 GREEN: Verify conditional logic passes

## 8. Rendering & Visual Effects

- [ ] 8.1 Implement `render(state, ctx)` — clear canvas black, draw bricks with row colors, draw paddle with glow, draw ball with glow
- [ ] 8.2 Add ball afterimage trail (store last 4 positions, render with decreasing alpha)
- [ ] 8.3 Add `image-rendering: pixelated` and `touch-action: none` CSS to canvas
- [ ] 8.4 Add responsive scaling CSS (max-width: 100%, height: auto on CRT screen / canvas)

## 9. Integration

- [ ] 9.1 Wire game loop (requestAnimationFrame) calling logic functions then render
- [ ] 9.2 Implement game-over overlay show/hide and restart button
- [ ] 9.3 Update home page `index.html` — replace "Coming Soon" card #03 with Breakout card (🧱 emoji, link to `./games/breakout/`)
- [ ] 9.4 Run `npm test` and verify all tests pass
