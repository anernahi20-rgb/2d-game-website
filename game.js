const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreValue = document.getElementById('scoreValue');

// Game state
let gameRunning = false;
let gamePaused = false;
let score = 0;
let animationId;

// Player object
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 25,
    width: 50,
    height: 50,
    color: '#3498db',
    speed: 5,
    dx: 0,
    dy: 0
};

// Collectible items
let items = [];
const maxItems = 5;

// Keyboard controls
const keys = {};

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);

// Generate random items
function createItem() {
    return {
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * (canvas.height - 30),
        width: 30,
        height: 30,
        color: '#f39c12'
    };
}

// Initialize items
function initItems() {
    items = [];
    for (let i = 0; i < maxItems; i++) {
        items.push(createItem());
    }
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Add simple face
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x + 10, player.y + 15, 10, 10); // Left eye
    ctx.fillRect(player.x + 30, player.y + 15, 10, 10); // Right eye
}

// Draw items
function drawItems() {
    items.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x + 15, item.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Update player position
function updatePlayer() {
    player.dx = 0;
    player.dy = 0;
    
    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.dy = -player.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.dy = player.speed;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.dx = -player.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.dx = player.speed;
    
    player.x += player.dx;
    player.y += player.dy;
    
    // Boundary collision
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Check collision with items
function checkCollisions() {
    items.forEach((item, index) => {
        if (player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y) {
            
            items.splice(index, 1);
            score += 10;
            scoreValue.textContent = score;
            items.push(createItem());
        }
    });
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Game loop
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    clearCanvas();
    drawItems();
    drawPlayer();
    updatePlayer();
    checkCollisions();
    
    animationId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        initItems();
        startBtn.textContent = 'Running...';
        startBtn.disabled = true;
        gameLoop();
    }
}

// Toggle pause
function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
        if (!gamePaused) gameLoop();
    }
}

// Reset game
function resetGame() {
    cancelAnimationFrame(animationId);
    gameRunning = false;
    gamePaused = false;
    score = 0;
    scoreValue.textContent = score;
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height / 2 - 25;
    startBtn.textContent = 'Start Game';
    startBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    clearCanvas();
    initItems();
    drawItems();
    drawPlayer();
}

// Initialize game display
initItems();
drawItems();
drawPlayer();