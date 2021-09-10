const gameContainer = document.querySelector(".game-container");
let squares = Array.from(document.querySelectorAll(".game-container div"));
const scoreDisplay = document.querySelector("#score");
const start = document.querySelector("#start");
const width = 10;

//blocks
const lBlock = [
  [1, width + 1, width * 2, 2],
  [width, width + 1, width + 2, 3],
  [2, width + 1, width * 2 + 1, width * 2],
  [width * 3 - 1, width * 2, width * 2 + 1, width * 2 + 2],
];

const zBlock = [
  [1, width, width + 1, width * 2],
  [width + 1, width + 2, width * 2, width * 2 - 1],
  [1, width, width + 1, width * 2],
  [width + 1, width + 2, width * 2, width * 2 - 1],
];

const tBlock = [
  [0, 1, width, 2],
  [3, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, 2],
  [1, width, width + 1, width * 2 - 1],
];

const oBlock = [
  [0, 1, width, width - 1],
  [0, 1, width, width - 1],
  [0, 1, width, width - 1],
  [0, 1, width, width - 1],
];

const iBlock = [
  [1, width, width * 2 - 1, width * 3 - 2],
  [width, width + 1, width + 2, width + 3],
  [1, width, width * 2 - 1, width * 3 - 2],
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
  });
}

draw();

//undraw block

function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("blocks");
  });
}
