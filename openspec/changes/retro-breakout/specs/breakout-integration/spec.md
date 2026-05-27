## ADDED Requirements

### Requirement: Home page game card
The home page SHALL display a Breakout game card in position #03, replacing the "Coming Soon" placeholder. The card SHALL link to `./games/breakout/`.

#### Scenario: Breakout card on home page
- **WHEN** the user visits the home page
- **THEN** a game card with title "Breakout", a brick emoji (🧱), description, and "PLAY" button links to the breakout game

#### Scenario: Card replaces Coming Soon
- **WHEN** the home page renders
- **THEN** the third card slot is an active Breakout link, not a locked "Coming Soon" card

### Requirement: High score localStorage persistence
The system SHALL store the all-time high score in localStorage under key `breakout_highscore`. The high score SHALL persist across browser sessions.

#### Scenario: High score saved on game over
- **WHEN** the game ends and the score exceeds the stored high score
- **THEN** the new score is written to `localStorage.setItem('breakout_highscore', score)`

#### Scenario: High score loaded on game start
- **WHEN** the game initializes
- **THEN** it reads `localStorage.getItem('breakout_highscore')` and displays it (or 0 if none exists)

### Requirement: Game file structure
The game SHALL be self-contained in `games/breakout/` with an `index.html` that links shared styles and a `breakout.js` for all game logic and rendering.

#### Scenario: Game loads from directory
- **WHEN** a user navigates to `games/breakout/index.html`
- **THEN** the game loads and is playable with no external dependencies beyond `../../assets/styles.css`
