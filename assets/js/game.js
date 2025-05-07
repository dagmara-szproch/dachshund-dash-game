/* jshint esversion: 6, browser: true, devel: true, jquery: false */
/* globals document, window */
// Core Game Variables
const board = document.getElementById('game-board');
let dachshund;
let food;
let direction = 'right';
let gameInterval;
let score = 0;
let gridSize;
let touchStartX = 0;
let touchStartY = 0;
// detects if it is touch device from stack overflow
const isTouchDevice = 'ontouchstart' in window ||
                        navigator.maxTouchPoints > 0 ||
                        navigator.msMaxTouchPoints > 0;


function getBoardSize() {
    return window.innerWidth > 768 ? 20 : 15;
}

//1. Initialise Board 
function createGameBoard() {
    gridSize = getBoardSize(); //update grid size
    board.innerHTML= ''; //clear previous content
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i =0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        board.appendChild(cell);
    }
}

// handle window resize
function handleResize() {
    const newSize = getBoardSize();
    if (newSize !== gridSize) {
        initGame();
    }
}

// 2. Main Game Functions
// moving the dachshund
function moveDachshund() {
    //get current head position; (...) creates a copy of the head object
    const head = {...dachshund[0]};
    // update position based on direction
    switch (direction) {
        // move up (decrease y)
        case 'up':
            head.y--;
            break;
        // move down (increase y)    
        case 'down':
            head.y++;
            break;
        // move left (decrease x)    
        case 'left':
            head.x--;
            break;
        // move right (increase x)
        case 'right':
            head.x++;
            break;
    }

    // add new head and remove tail
    dachshund.unshift(head); // add to the beginnig of the array (make the new head)

    // check if food was eaten
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
    } else {
        dachshund.pop();  // remove the last element of the array (tail\)
    }
}

function checkCollision() {
    // get current head position
    const head = dachshund[0];

    // wall collison check
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        return true;
    }

    // self collision
    for (let i = 1; i < dachshund.length; i++) {
        if (head.x === dachshund[i].x && head.y === dachshund[i].y) {
            console.log('Self collision');
            return true;
        }
    }
    return false; // no collision
}

// function generate with AI help
function generateFood() {
    // Generate all possible positions first
    const allPositions = [];
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            allPositions.push({x, y});
        }
    }

    // Filter out positions occupied by the dachshund
    const validPositions = allPositions.filter(pos => 
        !dachshund.some(segment => 
            segment.x === pos.x && segment.y === pos.y)
    );

    // Return random valid position
    return validPositions[Math.floor(Math.random() * validPositions.length)];
}

// function generate with AI help
function draw() {
    const cells = board.children;

    // clear all cells
    for (let i = 0; i < cells.length; i++) {
        cells[i].className = '';
    }

    // Draw dachshund
    dachshund.forEach((segment, index) => {
        const cellIndex = segment.y * gridSize + segment.x;
        if (cellIndex >= 0 && cellIndex < cells.length) {
            cells[cellIndex].classList.add('dachshund');
            if (index === 0) cells[cellIndex].classList.add('head');
        }
    });

    // Draw food
    const foodIndex = food.y * gridSize + food.x;
    if (foodIndex >= 0 && foodIndex < cells.length) {
        cells[foodIndex].classList.add('food');
    }
}

function showGameOver() {
    document.getElementById('final-score').textContent = score;
    const screen = document.getElementById('game-over-screen');
    
    // Show screen
    screen.classList.add('visible');
    
    // Hide when clicked or any key pressed
    const hide = () => screen.classList.remove('visible');
    screen.onclick = hide;
    document.onkeydown = hide;
}

// 3. Keyboard Controls - eventListener. This () also prevent opposite direction changes
document.addEventListener('keydown', (e) => {
    // Prevent default for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// touch controls (only if touch device detected) - function generated with AI help
if (isTouchDevice) {
    const swipeArea = document.getElementById('swipe-area');
    swipeArea.style.display = 'flex';

    let touchStartX, touchStartY;

    swipeArea.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });

    swipeArea.addEventListener('touchmove', (e) => {
        if (!touchStartX || !gameInterval) return;
    
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        const threshold = 30; //minimum swioe distance px

        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
            if (Math.abs(dx) > Math.abs(dy)) {
              // Horizontal swipe
              direction = dx > 0 && direction !== 'left' ? 'right' : 
                         dx < 0 && direction !== 'right' ? 'left' : direction;
            } else {
              // Vertical swipe
              direction = dy > 0 && direction !== 'up' ? 'down' : 
                         dy < 0 && direction !== 'down' ? 'up' : direction;
            }
            touchStartX = null; // Reset to prevent multi-triggers
            e.preventDefault();
          }
        }, { passive: false });
}

// Initialise Game
function initGame() {
    gridSize = getBoardSize();
    dachshund = [{x: 5, y: 10}];
    food = generateFood();
    direction = 'right';
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    
    if (gameInterval) clearInterval(gameInterval);

    createGameBoard();

    if (isTouchDevice) {
        document.getElementById('swipe-area').style.display = 'flex';
      } else {
        swipeArea.style.display = 'none';
      }

    gameInterval = setInterval(gameLoop, 200);
}

// 4. Game Loop
function gameLoop() {
    moveDachshund();

    if (checkCollision()) {
        clearInterval(gameInterval);
        showGameOver();
        return;
    }

    draw();
}

// Start the game
window.addEventListener('DOMContentLoaded', initGame);
window.addEventListener('resize', handleResize);

document.getElementById('restart-btn').addEventListener('click', initGame);
