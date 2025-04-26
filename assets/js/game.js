console.log('Hello');

// Core Game Variables
const gridSize = 20;
const board = document.getElementById('game-board');
let dachshund = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let direction = 'RIGHT';

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
    dachshund.pop();  // remove the last element of the array (tail\) 
}

function checkCollision() {
    // get current head position
    const head = dachshund[0];

    // wall collison check
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
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


// 3. Keyboard Controls - eventListener
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'DOWN') direction = 'UP';
            break;
        case 'ArrowDown':
            if (direction !== 'UP') direction = 'DOWN';
            break;
        case 'ArrowLeft':
            if (direction !== 'RIGHT') direction = 'LEFT';
            break;
        case 'ArrowRight':
            if (direction !== 'LEFT') direction = 'RIGHT';
            break;
    }
});

// 4. Game Loop
function gameLoop() {
    moveDachshund();

    if (checkCollision()) {

    }
}


// Export for testing (bottom of file)
// window.createGameBoard = createGameBoard;
// window.onload = createGameBoard;