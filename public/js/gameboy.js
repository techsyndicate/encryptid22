var start = document.querySelector('#start'),
    reset = document.querySelector('#reset'),
    gameCanvas = document.querySelector('canvas')
    cheatCode = document.querySelector('.button-1');
start.addEventListener('click', () => {
    gameCanvas.style.display = 'block'
    gameCanvas.style.width = '15em';
    gameCanvas.style.height = '13.5em';
    SnakeLadder()
})
var cheatCodeInput  = document.createElement('div')
cheatCodeInput.classList.add('cheatcode')
cheatCode.addEventListener('click',()=>{
    gameCanvas.style.display = 'none'
    cheatCodeInput.innerHTML = `
        <input placeholder="enter code" class="cheat-input">
        <button>
            SUBMIT
        </button>
    `;
    document.querySelector('.glass').appendChild(cheatCodeInput)
})
reset.addEventListener('click', () => {
    gameCanvas.style.display = 'none';
    cheatCodeInput.style.display= 'none'
})
var cheatInput = document.querySelector('cheat-input')
// if (cheatInput.value().lower() == 'nevis'){
//     window.location.href = 'https://instgram.com'
// }
function SnakeLadder() {
    var canvas = document.getElementById('game');
    var context = canvas.getContext('2d');
    
    var grid = 16;
    var count = 0;
      
    var snake = {
      x: 160,
      y: 160,
      
      // snake velocity. moves one grid length every frame in either the x or y direction
      dx: grid,
      dy: 0,
      
      // keep track of all grids the snake body occupies
      cells: [],
      
      // length of the snake. grows when eating an apple
      maxCells: 4
    };
    var apple = {
      x: 20,
      y: 20
    };
    
    // get random whole numbers in a specific range
    // @see https://stackoverflow.com/a/1527820/2124254
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    
    // game loop
    function loop() {
      requestAnimationFrame(loop);
    
      // slow game loop to 15 fps instead of 60 (60/15 = 4)
      if (++count < 4) {
        return;
      }
    
      count = 0;
      context.clearRect(0,0,canvas.width,canvas.height);
    
      // move snake by it's velocity
      snake.x += snake.dx;
      snake.y += snake.dy;
    
      // wrap snake position horizontally on edge of screen
      if (snake.x < 0) {
        snake.x = canvas.width - grid;
      }
      else if (snake.x >= canvas.width) {
        snake.x = 0;
      }
      
      // wrap snake position vertically on edge of screen
      if (snake.y < 0) {
        snake.y = canvas.height - grid;
      }
      else if (snake.y >= canvas.height) {
        snake.y = 0;
      }
    
      // keep track of where snake has been. front of the array is always the head
      snake.cells.unshift({x: snake.x, y: snake.y});
    
      // remove cells as we move away from them
      if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
      }
    
      // draw apple
      context.fillStyle = '#e03137';
      context.fillRect(apple.x, apple.y, grid-1, grid-1);
    
      // draw snake one cell at a time
      context.fillStyle = '#465748';
      snake.cells.forEach(function(cell, index) {
        
        // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
        context.fillRect(cell.x, cell.y, grid-1, grid-1);  
    
        // snake ate apple
        if (cell.x === apple.x && cell.y === apple.y) {
          snake.maxCells++;
    
          // canvas is 400x400 which is 25x25 grids 
          apple.x = getRandomInt(0, 25) * grid;
          apple.y = getRandomInt(0, 25) * grid;
        }
    
        // check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < snake.cells.length; i++) {
          
          // snake occupies same space as a body part. reset game
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            snake.x = 100;
            snake.y = 100;
            snake.cells = [];
            snake.maxCells = 3;
            snake.dx = grid;
            snake.dy = 0;
    
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
          }
        }
      });
    }
    
    // listen to keyboard events to move the snake
    document.addEventListener('keydown', function(e) {
      // prevent snake from backtracking on itself by checking that it's 
      // not already moving on the same axis (pressing left while moving
      // left won't do anything, and pressing right while moving left
      // shouldn't let you collide with your own body)
      
      // left arrow key
      if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
      }
      // up arrow key
      else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
      }
      // right arrow key
      else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
      }
      // down arrow key
      else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
      }
    });
    
    // start the game
    requestAnimationFrame(loop);
}