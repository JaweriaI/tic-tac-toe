const gameEl = document.getElementById("game");
const twoPlayerBtn = document.getElementById("two-player");
const vsAIBtn = document.getElementById("vs-ai");
const symbolChoiceEl = document.getElementById("symbol-choice");
const chooseXBtn = document.getElementById("choose-x");
const chooseOBtn = document.getElementById("choose-o");
const difficultyChoiceEl = document.getElementById("difficulty-choice");
const easyBtn = document.getElementById("easy");
const hardBtn = document.getElementById("hard");
const resetBtn = document.getElementById("reset");
const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");
const scoreTieEl = document.getElementById("score-tie");
const winSound = document.getElementById("win-sound");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameMode = "two-player"; 
let gameOver = false;
let playerSymbol = "X";
let aiSymbol = "O";
let aiDifficulty = "hard";

let xScore = parseInt(localStorage.getItem("scoreX")) || 0;
let oScore = parseInt(localStorage.getItem("scoreO")) || 0;
let tieScore = parseInt(localStorage.getItem("scoreTie")) || 0;

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function createBoard() {
  gameEl.innerHTML = "";
  board.forEach((cell,i) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = i;
    div.addEventListener("click", () => handleCellClick(i));
    gameEl.appendChild(div);
  });
}

function handleCellClick(index) {
  if (board[index] !== "" || gameOver) return;

  if (gameMode === "two-player") {
    board[index] = currentPlayer;
    updateCell(index, currentPlayer);
    if (checkWin(currentPlayer)) {
      updateScore(currentPlayer);
      gameOver = true;
    } else if (board.every(c => c !== "")) {
      tieScore++; saveScores(); updateScores(); gameOver = true;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  } else if (gameMode === "vs-ai") {
    board[index] = playerSymbol;
    updateCell(index, playerSymbol);
    if (checkWin(playerSymbol)) {
      updateScore(playerSymbol);
      gameOver = true;
      return;
    } else if (board.every(c => c !== "")) {
      tieScore++; saveScores(); updateScores(); gameOver = true; return;
    }
    setTimeout(aiMove, 300);
  }
}

function updateCell(index, symbol) {
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = symbol;
}

function checkWin(symbol) {
  let won = false;
  winningCombos.forEach(combo => {
    if (combo.every(i => board[i] === symbol)) {
      won = true;
      combo.forEach(i => document.querySelector(`.cell[data-index='${i}']`).classList.add("winning"));
    }
  });
  if (won) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    winSound.currentTime = 0; winSound.play();
  }
  return won;
}

function checkWinForMinimax(testBoard, symbol) {
  return winningCombos.some(combo => combo.every(i => testBoard[i] === symbol));
}

function updateScore(symbol) {
  if (symbol === "X") xScore++;
  else oScore++;
  saveScores();
  updateScores();
}

function saveScores() {
  localStorage.setItem("scoreX", xScore);
  localStorage.setItem("scoreO", oScore);
  localStorage.setItem("scoreTie", tieScore);
}

function updateScores() {
  scoreXEl.textContent = xScore;
  scoreOEl.textContent = oScore;
  scoreTieEl.textContent = tieScore;
}

function resetBoard() {
  board = ["","","","","","","","",""];
  gameOver = false;
  currentPlayer = "X";
  createBoard();
}

function aiMove() {
  if (gameOver) return;
  let moveIndex;

  if (aiDifficulty === "easy") {
    const availSpots = board.map((c,i)=>c===""?i:null).filter(v=>v!==null);
    moveIndex = availSpots[Math.floor(Math.random() * availSpots.length)];
  } else {
    moveIndex = minimax(board, aiSymbol).index;
  }

  board[moveIndex] = aiSymbol;
  updateCell(moveIndex, aiSymbol);

  if (checkWin(aiSymbol)) { updateScore(aiSymbol); gameOver = true; return; }
  if (board.every(c=>c!=="")) { tieScore++; saveScores(); updateScores(); gameOver = true; return; }
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((c,i)=>c===""?i:null).filter(v=>v!==null);

  if (checkWinForMinimax(newBoard, playerSymbol)) return { score: -10 };
  else if (checkWinForMinimax(newBoard, aiSymbol)) return { score: 10 };
  else if (availSpots.length === 0) return { score: 0 };

  const moves = [];
  for (let i=0;i<availSpots.length;i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots








