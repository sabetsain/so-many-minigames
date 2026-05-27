## ADDED Requirements

### Requirement: Paddle movement via keyboard
The system SHALL move the paddle left when the left arrow key is held and right when the right arrow key is held. The paddle SHALL NOT move beyond the canvas boundaries.

#### Scenario: Paddle moves left
- **WHEN** the player presses and holds the left arrow key
- **THEN** the paddle moves left at a constant speed each frame

#### Scenario: Paddle moves right
- **WHEN** the player presses and holds the right arrow key
- **THEN** the paddle moves right at a constant speed each frame

#### Scenario: Paddle stops at left wall
- **WHEN** the paddle reaches x=0
- **THEN** the paddle SHALL NOT move further left

#### Scenario: Paddle stops at right wall
- **WHEN** the paddle's right edge reaches the canvas width (400)
- **THEN** the paddle SHALL NOT move further right

### Requirement: Paddle movement via pointer
The system SHALL position the paddle's center at the pointer's X coordinate relative to the canvas. The paddle SHALL be clamped to canvas boundaries.

#### Scenario: Pointer controls paddle position
- **WHEN** the player moves the pointer over the canvas
- **THEN** the paddle center tracks the pointer X position

#### Scenario: Pointer at canvas edge
- **WHEN** the pointer X is near the canvas edge (within half paddle width)
- **THEN** the paddle is clamped so it does not extend beyond the canvas

### Requirement: Ball movement
The system SHALL move the ball by its velocity vector each frame at 60fps. The ball SHALL have a constant speed magnitude.

#### Scenario: Ball moves each frame
- **WHEN** the game loop ticks
- **THEN** the ball position updates by (dx, dy)

### Requirement: Ball reflection off walls
The ball SHALL reflect off the top, left, and right walls. The ball SHALL NOT reflect off the bottom — passing the bottom boundary loses a life.

#### Scenario: Ball hits top wall
- **WHEN** the ball's top edge reaches y=0
- **THEN** the ball's dy is inverted (bounces downward)

#### Scenario: Ball hits side wall
- **WHEN** the ball's left or right edge reaches the canvas boundary
- **THEN** the ball's dx is inverted

#### Scenario: Ball passes bottom boundary
- **WHEN** the ball's top edge passes the canvas height
- **THEN** the player loses one life and the ball resets

### Requirement: Ball reflection off paddle
The ball SHALL reflect off the paddle with an angle determined by where it hits. Hitting the paddle center reflects the ball straight up; hitting the edges reflects at up to ±60 degrees from vertical.

#### Scenario: Ball hits paddle center
- **WHEN** the ball contacts the paddle at its center
- **THEN** the ball reflects nearly straight up (angle ≈ 0° from vertical)

#### Scenario: Ball hits paddle edge
- **WHEN** the ball contacts the paddle near its left or right edge
- **THEN** the ball reflects at a steep angle (up to ±60° from vertical)

### Requirement: Brick grid layout
The system SHALL display a grid of 5 rows × 8 columns of bricks at the top of the play area.

#### Scenario: Bricks arranged in grid
- **WHEN** a new level starts
- **THEN** 40 bricks are arranged in 5 rows of 8, with each row a different neon color

### Requirement: Ball-brick collision
When the ball contacts a brick, the brick SHALL be destroyed and the ball SHALL reflect. The player's score SHALL increase.

#### Scenario: Ball hits brick
- **WHEN** the ball contacts a brick
- **THEN** the brick is removed, the ball reflects, and the score increases by 10 points

### Requirement: Lives system
The player SHALL start with 3 lives. Losing all lives ends the game.

#### Scenario: Player starts with 3 lives
- **WHEN** a new game begins
- **THEN** the player has 3 lives

#### Scenario: Losing a life
- **WHEN** the ball passes the bottom boundary
- **THEN** lives decrease by 1 and the ball resets to the paddle

#### Scenario: Game over
- **WHEN** lives reach 0
- **THEN** the game ends and the game-over overlay is displayed

### Requirement: Level completion
Clearing all bricks SHALL advance to the next level with a fresh brick grid. Difficulty remains static (same ball speed, same layout).

#### Scenario: All bricks cleared
- **WHEN** all 40 bricks are destroyed
- **THEN** a new level starts with a fresh 5×8 brick grid and the level counter increments

#### Scenario: Static difficulty
- **WHEN** a new level starts
- **THEN** ball speed and brick layout are identical to the previous level

### Requirement: Score tracking
The system SHALL display the current score and persist the high score across sessions.

#### Scenario: Score displayed during play
- **WHEN** the game is running
- **THEN** the current score is visible in the arcade header

#### Scenario: High score persisted
- **WHEN** the game ends with a score higher than the stored high score
- **THEN** the new high score is saved to localStorage under key `breakout_highscore`
