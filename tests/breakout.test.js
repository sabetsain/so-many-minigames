const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const BREAKOUT_HTML = fs.readFileSync(
    path.join(__dirname, '..', 'games', 'breakout', 'index.html'), 'utf8');
const BREAKOUT_JS = fs.readFileSync(
    path.join(__dirname, '..', 'games', 'breakout', 'breakout.js'), 'utf8');

function createGameDOM() {
    const strippedHtml = BREAKOUT_HTML
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<link[^>]*stylesheet[^>]*>/gi, '');

    const dom = new JSDOM(strippedHtml, {
        runScripts: 'dangerously',
        url: 'http://localhost',
        pretendToBeVisual: true,
    });

    const win = dom.window;

    // Stub canvas getContext so rendering calls don't crash
    const canvasProto = win.HTMLCanvasElement.prototype;
    canvasProto.getContext = function() {
        return {
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            shadowBlur: 0,
            shadowColor: '',
            globalAlpha: 1,
            fillRect() {},
            strokeRect() {},
            clearRect() {},
            beginPath() {},
            moveTo() {},
            lineTo() {},
            stroke() {},
            fill() {},
            arc() {},
            closePath() {},
            fillText() {},
            measureText() { return { width: 0 }; },
            save() {},
            restore() {},
        };
    };

    // Load the game script
    win.eval(BREAKOUT_JS);

    return { dom, win };
}

// ----------------------------------------------------------------
// Helpers — build minimal state objects for pure-function tests
// ----------------------------------------------------------------
const BASE_PADDLE = { x: 170, y: 370, width: 60, height: 10 };
const BASE_BALL   = { x: 200, y: 300, dx: 2, dy: -4, radius: 7, trail: [] };

function makeState(overrides) {
    return Object.assign(
        {
            paddle: Object.assign({}, BASE_PADDLE),
            ball:   Object.assign({}, BASE_BALL),
            bricks: [],
            score: 0,
            lives: 3,
            level: 1,
            gameOver: false,
        },
        overrides
    );
}

// ----------------------------------------------------------------
// 2. Paddle Control
// ----------------------------------------------------------------
describe('Breakout — Paddle Control', () => {
    it('clamps paddle to left boundary (x cannot go below 0)', () => {
        const { win } = createGameDOM();
        const state = makeState({ paddle: { x: -10, y: 370, width: 60, height: 10 } });
        const result = win.clampPaddle(state);
        assert.strictEqual(result.paddle.x, 0, 'paddle.x should be clamped to 0');
    });

    it('clamps paddle to right boundary (right edge cannot exceed canvas width)', () => {
        const { win } = createGameDOM();
        const state = makeState({ paddle: { x: 380, y: 370, width: 60, height: 10 } });
        const result = win.clampPaddle(state);
        assert.strictEqual(result.paddle.x, 340, 'paddle.x should be clamped to 400-60=340');
    });

    it('movePaddle left updates x by speed', () => {
        const { win } = createGameDOM();
        const state = makeState({ paddle: { x: 170, y: 370, width: 60, height: 10 } });
        const result = win.movePaddle(state, 'left');
        assert.strictEqual(result.paddle.x, 165, 'paddle should move left by PADDLE_SPEED=5');
    });

    it('movePaddle right updates x by speed', () => {
        const { win } = createGameDOM();
        const state = makeState({ paddle: { x: 170, y: 370, width: 60, height: 10 } });
        const result = win.movePaddle(state, 'right');
        assert.strictEqual(result.paddle.x, 175, 'paddle should move right by PADDLE_SPEED=5');
    });

    it('movePaddle respects right boundary', () => {
        const { win } = createGameDOM();
        const state = makeState({ paddle: { x: 345, y: 370, width: 60, height: 10 } });
        const result = win.movePaddle(state, 'right');
        assert.strictEqual(result.paddle.x, 340, 'paddle should be clamped at right boundary');
    });
});

// ----------------------------------------------------------------
// 3. Ball Physics
// ----------------------------------------------------------------
describe('Breakout — Ball Physics', () => {
    it('moveBall updates ball position by (dx, dy)', () => {
        const { win } = createGameDOM();
        const state = makeState({ ball: { x: 100, y: 200, dx: 3, dy: -4, radius: 7, trail: [] } });
        const result = win.moveBall(state);
        assert.strictEqual(result.ball.x, 103);
        assert.strictEqual(result.ball.y, 196);
    });

    it('ball reflects off top wall — dy inverts when y reaches 0', () => {
        const { win } = createGameDOM();
        const state = makeState({ ball: { x: 200, y: 3, dx: 2, dy: -4, radius: 7, trail: [] } });
        const { newState, lifeLost } = win.reflectWalls(state);
        assert.ok(newState.ball.dy > 0, 'dy should invert to positive after top-wall hit');
        assert.strictEqual(lifeLost, false);
    });

    it('ball reflects off left side wall — dx inverts', () => {
        const { win } = createGameDOM();
        const state = makeState({ ball: { x: 4, y: 200, dx: -4, dy: 2, radius: 7, trail: [] } });
        const { newState, lifeLost } = win.reflectWalls(state);
        assert.ok(newState.ball.dx > 0, 'dx should invert to positive after left-wall hit');
        assert.strictEqual(lifeLost, false);
    });

    it('ball reflects off right side wall — dx inverts', () => {
        const { win } = createGameDOM();
        const state = makeState({ ball: { x: 396, y: 200, dx: 4, dy: 2, radius: 7, trail: [] } });
        const { newState, lifeLost } = win.reflectWalls(state);
        assert.ok(newState.ball.dx < 0, 'dx should invert to negative after right-wall hit');
        assert.strictEqual(lifeLost, false);
    });

    it('ball passing bottom boundary returns lifeLost: true', () => {
        const { win } = createGameDOM();
        const state = makeState({ ball: { x: 200, y: 410, dx: 2, dy: 4, radius: 7, trail: [] } });
        const { lifeLost } = win.reflectWalls(state);
        assert.strictEqual(lifeLost, true, 'lifeLost should be true when ball passes bottom');
    });

    it('ball not at bottom boundary returns lifeLost: false', () => {
        const { win } = createGameDOM();
        const state = makeState({ ball: { x: 200, y: 300, dx: 2, dy: 4, radius: 7, trail: [] } });
        const { lifeLost } = win.reflectWalls(state);
        assert.strictEqual(lifeLost, false);
    });
});

// ----------------------------------------------------------------
// 4. Paddle Collision
// ----------------------------------------------------------------
describe('Breakout — Paddle Collision', () => {
    it('ball hitting paddle center reflects nearly straight up (|dx| ≈ 0)', () => {
        const { win } = createGameDOM();
        // Ball center exactly at paddle center, moving down, touching paddle top
        const state = makeState({
            paddle: { x: 170, y: 370, width: 60, height: 10 },
            ball:   { x: 200, y: 363, dx: 0, dy: 4, radius: 7, trail: [] }
            //       ball bottom = 363+7=370 = paddle.y  ✓  ball x = paddle center = 200  ✓
        });
        const result = win.reflectOffPaddle(state);
        assert.ok(result.ball.dy < 0, 'ball should move upward after paddle hit');
        assert.ok(Math.abs(result.ball.dx) < 0.5, `|dx| should be near 0 for center hit, got ${result.ball.dx}`);
    });

    it('ball hitting paddle left edge reflects at steep angle (dx < -2)', () => {
        const { win } = createGameDOM();
        // Ball at left edge of paddle
        const state = makeState({
            paddle: { x: 170, y: 370, width: 60, height: 10 },
            ball:   { x: 170, y: 363, dx: 0, dy: 4, radius: 7, trail: [] }
        });
        const result = win.reflectOffPaddle(state);
        assert.ok(result.ball.dy < 0, 'ball should move upward');
        // At left edge offset=-1, angle=-60°, |dx| = BALL_SPEED * sin(60°) ≈ 3.46
        assert.ok(result.ball.dx < -2, `dx should be steep negative for left-edge hit, got ${result.ball.dx}`);
    });

    it('ball hitting paddle right edge reflects at steep positive angle (dx > 2)', () => {
        const { win } = createGameDOM();
        // Ball at right edge of paddle
        const state = makeState({
            paddle: { x: 170, y: 370, width: 60, height: 10 },
            ball:   { x: 230, y: 363, dx: 0, dy: 4, radius: 7, trail: [] }
        });
        const result = win.reflectOffPaddle(state);
        assert.ok(result.ball.dy < 0, 'ball should move upward');
        assert.ok(result.ball.dx > 2, `dx should be steep positive for right-edge hit, got ${result.ball.dx}`);
    });

    it('ball moving upward does not trigger paddle collision', () => {
        const { win } = createGameDOM();
        const state = makeState({
            paddle: { x: 170, y: 370, width: 60, height: 10 },
            ball:   { x: 200, y: 363, dx: 0, dy: -4, radius: 7, trail: [] }
        });
        const result = win.reflectOffPaddle(state);
        assert.strictEqual(result.ball.dy, -4, 'upward-moving ball should not be affected');
    });
});

// ----------------------------------------------------------------
// 5. Brick Grid & Collision
// ----------------------------------------------------------------
describe('Breakout — Brick Grid', () => {
    it('createBricks returns 40 bricks (5 rows × 8 cols)', () => {
        const { win } = createGameDOM();
        const bricks = win.createBricks();
        assert.strictEqual(bricks.length, 40);
    });

    it('createBricks row 0 uses hot pink (#FF1493)', () => {
        const { win } = createGameDOM();
        const bricks = win.createBricks();
        // First 8 bricks are row 0
        for (let i = 0; i < 8; i++) {
            assert.strictEqual(bricks[i].color, '#FF1493');
        }
    });

    it('createBricks each row has a distinct neon color', () => {
        const { win } = createGameDOM();
        const bricks = win.createBricks();
        const rowColors = ['#FF1493', '#00FFFF', '#FFFF00', '#39FF14', '#9400D3'];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 8; col++) {
                assert.strictEqual(bricks[row * 8 + col].color, rowColors[row]);
            }
        }
    });

    it('all bricks start active', () => {
        const { win } = createGameDOM();
        const bricks = win.createBricks();
        assert.ok(bricks.every(b => b.active), 'all bricks should be active initially');
    });

    it('checkBrickCollision deactivates hit brick, inverts dy, adds 10 to score', () => {
        const { win } = createGameDOM();
        // Place a brick; ball center is inside brick
        const brick = { x: 100, y: 100, width: 46, height: 15, color: '#FF1493', active: true };
        const state = makeState({
            ball:   { x: 123, y: 107, dx: 2, dy: 4, radius: 7, trail: [] },
            bricks: [brick],
            score: 0
        });
        const result = win.checkBrickCollision(state);
        assert.strictEqual(result.bricks[0].active, false, 'brick should be deactivated');
        assert.strictEqual(result.score, 10, 'score should increase by 10');
        assert.strictEqual(result.ball.dy, -4, 'ball dy should be inverted');
    });

    it('checkBrickCollision ignores inactive bricks', () => {
        const { win } = createGameDOM();
        const brick = { x: 100, y: 100, width: 46, height: 15, color: '#FF1493', active: false };
        const state = makeState({
            ball:   { x: 123, y: 107, dx: 2, dy: 4, radius: 7, trail: [] },
            bricks: [brick],
            score: 0
        });
        const result = win.checkBrickCollision(state);
        assert.strictEqual(result.score, 0, 'inactive brick should not score');
    });

    it('all bricks cleared triggers level complete — level increments and fresh grid', () => {
        const { win } = createGameDOM();
        const state = makeState({
            bricks: win.createBricks().map(b => Object.assign({}, b, { active: false })),
            level: 1
        });
        const result = win.checkLevelComplete(state);
        assert.strictEqual(result.level, 2, 'level should increment');
        assert.ok(result.bricks.some(b => b.active), 'new grid should have active bricks');
        assert.strictEqual(result.bricks.length, 40, 'new grid should have 40 bricks');
    });

    it('checkLevelComplete does nothing when bricks remain', () => {
        const { win } = createGameDOM();
        const state = makeState({ bricks: win.createBricks(), level: 1 });
        const result = win.checkLevelComplete(state);
        assert.strictEqual(result.level, 1, 'level should not change when bricks remain');
    });
});

// ----------------------------------------------------------------
// 6. Lives & Game Over
// ----------------------------------------------------------------
describe('Breakout — Lives & Game Over', () => {
    it('createInitialState starts with 3 lives', () => {
        const { win } = createGameDOM();
        const state = win.createInitialState();
        assert.strictEqual(state.lives, 3);
    });

    it('loseLife decrements lives and resets ball position', () => {
        const { win } = createGameDOM();
        const state = makeState({ lives: 3 });
        const result = win.loseLife(state);
        assert.strictEqual(result.lives, 2, 'lives should decrement by 1');
        assert.strictEqual(result.gameOver, false, 'game should not be over yet');
        assert.ok(result.ball.dy < 0, 'ball should be reset moving upward');
    });

    it('loseLife with 1 life remaining sets gameOver to true', () => {
        const { win } = createGameDOM();
        const state = makeState({ lives: 1 });
        const result = win.loseLife(state);
        assert.strictEqual(result.lives, 0, 'lives should reach 0');
        assert.strictEqual(result.gameOver, true, 'gameOver should be true');
    });

    it('losing life resets ball to center above paddle', () => {
        const { win } = createGameDOM();
        const state = makeState({ lives: 2, ball: { x: 50, y: 390, dx: 3, dy: 4, radius: 7, trail: [] } });
        const result = win.loseLife(state);
        assert.strictEqual(result.ball.x, 200, 'ball x should reset to canvas center');
        assert.ok(result.ball.dy < 0, 'ball should be moving upward after reset');
    });
});

// ----------------------------------------------------------------
// 7. Scoring & Persistence
// ----------------------------------------------------------------
describe('Breakout — High Score Persistence', () => {
    it('updateHighScore saves to localStorage when score exceeds stored value', () => {
        const { win } = createGameDOM();
        win.localStorage.setItem('breakout_highscore', '100');
        win.updateHighScore(200);
        assert.strictEqual(
            win.localStorage.getItem('breakout_highscore'), '200',
            'high score should update to new high');
    });

    it('updateHighScore does NOT update when score is lower than stored', () => {
        const { win } = createGameDOM();
        win.localStorage.setItem('breakout_highscore', '100');
        win.updateHighScore(50);
        assert.strictEqual(
            win.localStorage.getItem('breakout_highscore'), '100',
            'high score should remain unchanged when new score is lower');
    });

    it('updateHighScore returns true when a new high score is set', () => {
        const { win } = createGameDOM();
        win.localStorage.removeItem('breakout_highscore');
        const updated = win.updateHighScore(150);
        assert.strictEqual(updated, true);
    });

    it('updateHighScore returns false when score does not beat high score', () => {
        const { win } = createGameDOM();
        win.localStorage.setItem('breakout_highscore', '500');
        const updated = win.updateHighScore(100);
        assert.strictEqual(updated, false);
    });

    it('updateHighScore treats missing localStorage value as 0', () => {
        const { win } = createGameDOM();
        win.localStorage.removeItem('breakout_highscore');
        win.updateHighScore(1);
        assert.strictEqual(win.localStorage.getItem('breakout_highscore'), '1');
    });
});
