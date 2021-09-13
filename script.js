const gameContainer = document.querySelector(".game-container");
let squares = Array.from(document.querySelectorAll(".game-container div"));
const scoreDisplay = document.querySelector("#score");
const start = document.querySelector("#start");
const width = 10;
let nextRandom = 0;
let timerId;
let score = 0;
const colors = ["red", "blue", "yellow", "green", "orange"];

//blocks
const lBlock = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zBlock = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tBlock = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oBlock = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iBlock = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const theBlocks = [lBlock, zBlock, tBlock, oBlock, iBlock];

let currentPosition = 4;
let currentRotation = 0;

//randomly select block and first rotation
let random = Math.floor(Math.random() * theBlocks.length);
let current = theBlocks[random][currentRotation];

//draw the first block
function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("blocks");
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
}

//undraw block

function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("blocks");
    squares[currentPosition + index].style.backgroundColor = "";
  });
}

//make blocks move

function control(e) {
  if (e.keyCode === 37 && timerId) {
    moveLeft();
  } else if (e.keyCode === 38 && timerId) {
    rotate();
  } else if (e.keyCode === 39 && timerId) {
    moveRight();
  } else if (e.keyCode === 40 && timerId) {
    moveDown();
  }
}
document.addEventListener("keydown", control);

//move down function
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );
    //start new block
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theBlocks.length);
    current = theBlocks[random][currentRotation];
    currentPosition = 4;
    draw();
    displayShape();
    addScore();
  }
}

//check to see if wall or block in direction so block can move
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );

  if (!isAtLeftEdge) currentPosition -= 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }
  draw();
}

function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );

  if (!isAtRightEdge) currentPosition += 1;

  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}

///FIX ROTATION OF BLOCKS AT THE EDGE
function isAtRight() {
  return current.some((index) => (currentPosition + index + 1) % width === 0);
}

function isAtLeft() {
  return current.some((index) => (currentPosition + index) % width === 0);
}

function checkRotatedPosition(P) {
  P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
  if ((P + 1) % width < 4) {
    //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
    if (isAtRight()) {
      //use actual position to check if it's flipped over to right side
      currentPosition += 1; //if so, add one to wrap it back around
      checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
    }
  } else if (P % width > 5) {
    if (isAtLeft()) {
      currentPosition -= 1;
      checkRotatedPosition(P);
    }
  }
}

//rotate the block
function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) {
    currentRotation = 0;
  }
  current = theBlocks[random][currentRotation];
  checkRotatedPosition();
  draw();
}

//show next-up block in next-up block.. in next-up block?
const displaySquares = document.querySelectorAll(".next-up div");
const displayWidth = 4;
let displayIndex = 0;

//blocks without rotations
const upNextBlocks = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lBlock
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zBlock
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //tBlock
  [0, 1, displayWidth, displayWidth + 1], //oBlock
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iBlock
];

//display the block in next-up
function displayShape() {
  displaySquares.forEach((square) => {
    square.classList.remove("blocks");
    square.style.backgroundColor = "";
  });
  upNextBlocks[nextRandom].forEach((index) => {
    displaySquares[displayIndex + index].classList.add("blocks");
    displaySquares[displayIndex + index].style.backgroundColor =
      colors[nextRandom];
  });
}

//start/pause game with button
start.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    timerId = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random() * theBlocks.length);
  }
});

//add score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains("taken"))) {
      score += 10;
      scoreDisplay.textContent = score;
      row.forEach((index) => {
        squares[index].classList.remove("taken");
        squares[index].classList.remove("blocks");
        squares[index].style.backgroundColor = "";
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }
}
