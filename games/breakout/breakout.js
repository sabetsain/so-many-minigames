// ============================================================
// CONSTANTS
// ============================================================
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 60;
const PADDLE_HEIGHT = 10;
const PADDLE_SPEED = 5;
const PADDLE_Y = 370;
const BALL_RADIUS = 7;
const BALL_SPEED = 4;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 15;
const BRICK_PADDING = 4;
const BRICK_OFFSET_TOP = 50;
const BRICK_SLOT_W = CANVAS_WIDTH / BRICK_COLS; // 50px per column
const BRICK_W = BRICK_SLOT_W - BRICK_PADDING;   // 46px wide
const ROW_COLORS = ['#FF1493', '#00FFFF', '#FFFF00', '#39FF14', '#9400D3'];
const LS_KEY = 'breakout_highscore';

// ============================================================
// PURE LOGIC FUNCTIONS (testable without DOM)
// ============================================================

function createBricks() {
    const bricks = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let col = 0; col < BRICK_COLS; col++) {
            bricks.push({
                x: col * BRICK_SLOT_W + BRICK_PADDING / 2,
                y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
                width: BRICK_W,
                height: BRICK_HEIGHT,
                color: ROW_COLORS[row],
                active: true
            });
        }
    }
    return bricks;
}

function createInitialState() {
    return {
        paddle: {
            x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
            y: PADDLE_Y,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT
        },
        ball: {
            x: CANVAS_WIDTH / 2,
            y: PADDLE_Y - BALL_RADIUS - 5,
            dx: 0,
            dy: -BALL_SPEED,
            radius: BALL_RADIUS,
            trail: []
        },
        bricks: createBricks(),
        score: 0,
        lives: 3,
        level: 1,
        gameOver: false
    };
}

function clampPaddle(state) {
    const maxX = CANVAS_WIDTH - state.paddle.width;
    const clampedX = Math.max(0, Math.min(state.paddle.x, maxX));
    if (clampedX === state.paddle.x) return state;
    return Object.assign({}, state, {
        paddle: Object.assign({}, state.paddle, { x: clampedX })
    });
}

function movePaddle(state, direction) {
    const delta = direction === 'left' ? -PADDLE_SPEED
                : direction === 'right' ? PADDLE_SPEED
                : 0;
    const moved = Object.assign({}, state, {
        paddle: Object.assign({}, state.paddle, { x: state.paddle.x + delta })
    });
    return clampPaddle(moved);
}

function moveBall(state) {
    const b = state.ball;
    const trail = b.trail.concat([{ x: b.x, y: b.y }]).slice(-4);
    return Object.assign({}, state, {
        ball: Object.assign({}, b, {
            x: b.x + b.dx,
            y: b.y + b.dy,
            trail: trail
        })
    });
}

function reflectWalls(state) {
    const b = state.ball;
    let x = b.x, y = b.y, dx = b.dx, dy = b.dy;
    let lifeLost = false;

    // Top wall
    if (y - b.radius <= 0) {
        dy = Math.abs(dy);
        y = b.radius;
    }
    // Left wall
    if (x - b.radius <= 0) {
        dx = Math.abs(dx);
        x = b.radius;
    }
    // Right wall
    if (x + b.radius >= CANVAS_WIDTH) {
        dx = -Math.abs(dx);
        x = CANVAS_WIDTH - b.radius;
    }
    // Bottom boundary — life lost
    if (y > CANVAS_HEIGHT) {
        lifeLost = true;
    }

    return {
        newState: Object.assign({}, state, {
            ball: Object.assign({}, b, { x, y, dx, dy })
        }),
        lifeLost: lifeLost
    };
}

function reflectOffPaddle(state) {
    const ball = state.ball;
    const paddle = state.paddle;

    const ballBottom = ball.y + ball.radius;
    const ballMovingDown = ball.dy > 0;
    const ballOverPaddle = ball.x >= paddle.x && ball.x <= paddle.x + paddle.width;

    if (!ballMovingDown || ballBottom < paddle.y ||
        ball.y - ball.radius > paddle.y + paddle.height || !ballOverPaddle) {
        return state;
    }

    const paddleCenter = paddle.x + paddle.width / 2;
    const offset = (ball.x - paddleCenter) / (paddle.width / 2); // -1 to +1
    const maxAngle = 60 * (Math.PI / 180);
    const angle = offset * maxAngle;

    const newDx = BALL_SPEED * Math.sin(angle);
    // Ensure minimum vertical component to prevent horizontal-only bouncing
    const rawDy = -BALL_SPEED * Math.cos(angle);
    const newDy = Math.abs(rawDy) < 0.5 ? -0.5 : rawDy;

    return Object.assign({}, state, {
        ball: Object.assign({}, ball, {
            y: paddle.y - ball.radius,
            dx: newDx,
            dy: newDy
        })
    });
}

function checkBrickCollision(state) {
    const ball = state.ball;
    let newDx = ball.dx;
    let newDy = ball.dy;
    let scoreIncrease = 0;
    let hitOccurred = false;

    const newBricks = state.bricks.map(function(brick) {
        if (!brick.active || hitOccurred) return brick;

        // AABB overlap with ball radius expansion
        const hit = ball.x + ball.radius > brick.x &&
                    ball.x - ball.radius < brick.x + brick.width &&
                    ball.y + ball.radius > brick.y &&
                    ball.y - ball.radius < brick.y + brick.height;

        if (!hit) return brick;

        hitOccurred = true;
        scoreIncrease = 10;

        // Determine reflection axis by smallest overlap
        const overlapLeft   = (ball.x + ball.radius) - brick.x;
        const overlapRight  = (brick.x + brick.width) - (ball.x - ball.radius);
        const overlapTop    = (ball.y + ball.radius) - brick.y;
        const overlapBottom = (brick.y + brick.height) - (ball.y - ball.radius);
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapTop || minOverlap === overlapBottom) {
            newDy = -newDy;
        } else {
            newDx = -newDx;
        }

        return Object.assign({}, brick, { active: false });
    });

    return Object.assign({}, state, {
        ball: Object.assign({}, ball, { dx: newDx, dy: newDy }),
        bricks: newBricks,
        score: state.score + scoreIncrease
    });
}

function checkLevelComplete(state) {
    if (state.bricks.some(function(b) { return b.active; })) return state;
    return Object.assign({}, state, {
        bricks: createBricks(),
        level: state.level + 1,
        ball: Object.assign({}, state.ball, {
            x: CANVAS_WIDTH / 2,
            y: PADDLE_Y - BALL_RADIUS - 5,
            dx: 0,
            dy: -BALL_SPEED,
            trail: []
        })
    });
}

function loseLife(state) {
    const newLives = state.lives - 1;
    if (newLives <= 0) {
        return Object.assign({}, state, { lives: 0, gameOver: true });
    }
    return Object.assign({}, state, {
        lives: newLives,
        ball: Object.assign({}, state.ball, {
            x: CANVAS_WIDTH / 2,
            y: PADDLE_Y - BALL_RADIUS - 5,
            dx: 0,
            dy: -BALL_SPEED,
            trail: []
        })
    });
}

function updateHighScore(score) {
    var stored = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
    if (score > stored) {
        localStorage.setItem(LS_KEY, String(score));
        return true;
    }
    return false;
}

// ============================================================
// BROWSER GAME — RENDERING + LOOP + INPUT
// ============================================================

function initGame() {
    var canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var scoreEl   = document.getElementById('score');
    var livesEl   = document.getElementById('lives');
    var levelEl   = document.getElementById('level');
    var gameOverEl  = document.getElementById('gameOver');
    var finalScoreEl = document.getElementById('finalScore');
    var highScoreEl  = document.getElementById('highScore');

    var gameState = createInitialState();
    var gameRunning = false;
    var rafId = null;
    var keysDown = {};

    // ---- Rendering ----

    function render(state) {
        // Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Bricks
        state.bricks.forEach(function(brick) {
            if (!brick.active) return;
            ctx.fillStyle = brick.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = brick.color;
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            ctx.shadowBlur = 0;
        });

        // Ball trail (afterimage)
        var trail = state.ball.trail;
        trail.forEach(function(pos, i) {
            var alpha = (i + 1) / (trail.length + 1) * 0.5;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#00FFFF';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, state.ball.radius * 0.8, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Ball
        ctx.fillStyle = '#00FFFF';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00FFFF';
        ctx.beginPath();
        ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Paddle
        ctx.fillStyle = '#FF1493';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#FF1493';
        ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);
        ctx.shadowBlur = 0;
    }

    function updateUI(state) {
        scoreEl.textContent = String(state.score).padStart(4, '0');
        livesEl.textContent = state.lives;
        levelEl.textContent = state.level;
    }

    // ---- Game loop ----

    function tick() {
        if (!gameRunning) return;

        // Keyboard paddle movement
        if (keysDown['ArrowLeft'])  gameState = movePaddle(gameState, 'left');
        if (keysDown['ArrowRight']) gameState = movePaddle(gameState, 'right');

        // Physics
        gameState = moveBall(gameState);
        var wallResult = reflectWalls(gameState);
        gameState = wallResult.newState;

        if (wallResult.lifeLost) {
            gameState = loseLife(gameState);
            updateUI(gameState);
            if (gameState.gameOver) {
                endGame();
                return;
            }
            render(gameState);
            rafId = requestAnimationFrame(tick);
            return;
        }

        gameState = reflectOffPaddle(gameState);
        gameState = checkBrickCollision(gameState);
        gameState = checkLevelComplete(gameState);

        updateUI(gameState);
        render(gameState);
        rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
        if (gameRunning) return;
        gameRunning = true;
        rafId = requestAnimationFrame(tick);
    }

    function stopLoop() {
        gameRunning = false;
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function endGame() {
        stopLoop();
        updateHighScore(gameState.score);
        finalScoreEl.textContent = gameState.score;
        highScoreEl.textContent = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
        gameOverEl.style.display = 'block';
    }

    // Exposed for the restart button (onclick="restartGame()")
    window.restartGame = function() {
        gameState = createInitialState();
        updateUI(gameState);
        gameOverEl.style.display = 'none';
        gameRunning = false;
        keysDown = {};
        render(gameState);
        startLoop();
    };

    // ---- Input ----

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            keysDown[e.key] = true;
            if (!gameRunning && !gameState.gameOver) startLoop();
        }
    });

    document.addEventListener('keyup', function(e) {
        keysDown[e.key] = false;
    });

    canvas.addEventListener('pointermove', function(e) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = CANVAS_WIDTH / rect.width;
        var pointerX = (e.clientX - rect.left) * scaleX;
        var newX = pointerX - PADDLE_WIDTH / 2;
        gameState = clampPaddle(Object.assign({}, gameState, {
            paddle: Object.assign({}, gameState.paddle, { x: newX })
        }));
        if (!gameRunning && !gameState.gameOver) startLoop();
    });

    canvas.style.touchAction = 'none';

    // Initial render — loop starts on first user interaction
    render(gameState);
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
}
