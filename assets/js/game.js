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

// // 2. Main Game Functions
// function moveSnake() 

// function checkCollision() 

// function generateFood() 

// // 3. Keyboard Controls - eventListener

// // 4. Game Loop
// function gameLoop() 


// Export for testing (bottom of file)
window.createGameBoard = createGameBoard;
window.onload = createGameBoard;