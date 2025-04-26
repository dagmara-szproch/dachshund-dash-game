// console.log('Hello');

// Core Game Variables
const gridSize = 20;
const board = document.getElementById('game-board');
let dachshund = [{x: 5, y: 10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let score = 0;

//1. Initialise Board 
function createGameBoard() {
    board.innerHTML= ''; //clear previous content
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i =0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        board.appendChild(cell);
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
    if (head.x < 0 || head.x > gridSize -1 || head.y < 0 || head.y > gridSize -1) {
        console.log('Wall collision');
        return true
    }

    // self collision
    for (let i = 1; i < dachshund.length; i++) {
        if (head.x === dachshund[i].x && head.y === dachshund[i].y) {
            console.log('Self collision');
            return true;
        }
    }
    return false // no collision
}

// function 
function generateFood() {
    let newFood;
    let isPositionValid = false;
    while (!isPositionValid) {
        // 1. Generate position 
        newFood = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };

        // ensure food not on snake segment
        isPositionValid = !dachshund.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y);
    }

    return newFood
}

function draw() {
    const cells = board.children;

    // clear all cells
    for (let i = 0; i < cells.length; i++) {
        cells[i].className = '';
    }

    // Draw dachshund
    dachshund.forEach(segment => {
        const index = segment.y * gridSize + segment.x;
        if (index >= 0 && index < cells.length) {
            cells[index].classList.add('dachshund');
            if (index === 0) cells[cellIndex].classList.add('head');
        }
    });

    // Draw food
    const foodIndex = food.y * gridSize + food.x;
    if (foodIndex >= 0 && foodIndex < cells.length) {
        cells[foodIndex].classList.add('food');
    }
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


// 4. Game Loop
function gameLoop() {
    moveDachshund();

    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('Game Over! Score: &{score}');
        return
    }

    draw();
}

// Mobile Controls
function initMobileControls() {
    const directions = {
      up: () => { if (direction !== 'down') direction = 'up'; },
      down: () => { if (direction !== 'up') direction = 'down'; },
      left: () => { if (direction !== 'right') direction = 'left'; },
      right: () => { if (direction !== 'left') direction = 'right'; }
    };
  
    // Add event listeners for both touch and click
    Object.keys(directions).forEach(dir => {
      const btn = document.querySelector(`.${dir}`);
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        directions[dir]();
      });
      btn.addEventListener('click', directions[dir]);
    });
  }
  

// Initialise Game
function initGame() {
    createGameBoard();
    dachshund = [{x: 5, y: 10}];
    food = generateFood();
    direction = 'right';
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;

    initMobileControls();
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 200);

    
}

// Start the game
initGame();

// Restart button
document.getElementById('restart-btn').addEventListener('click', initGame);
