// Elements
const boardEl = document.getElementById("board");
const twoPlayerBtn = document.getElementById("two-player-btn");
const vsAiBtn = document.getElementById("vs-ai-btn");
const symbolChoiceEl = document.getElementById("symbol-choice");
const chooseXBtn = document.getElementById("choose-x");
const chooseOBtn = document.getElementById("choose-o");
const difficultyChoiceEl = document.getElementById("difficulty-choice");
const easyBtn = document.getElementById("easy-btn");
const hardBtn = document.getElementById("hard-btn");
const colorChoiceEl = document.getElementById("color-choice");
const colorXInput = document.getElementById("color-x");
const colorOInput = document.getElementById("color-o");
const colorBoardInput = document.getElementById("color-board");
const applyColorsBtn = document.getElementById("apply-colors");
const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");
const scoreTieEl = document.getElementById("score-tie");
const resetBtn = document.getElementById("reset-scores");

// Game variables
let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameMode = "two-player";
let playerSymbol = "X";
let aiSymbol = "O";
let aiDifficulty = "easy";
let gameOver = false;

let scoreX = 0;
let scoreO = 0;
let tieScore = 0;

// Functions
function createBoard() {
  boardEl.innerHTML = "";
  boardEl.style.backgroundColor = colorBoardInput?.value || "#eee";
  board.forEach((cell, idx) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.textContent = cell;
    div.style.color = (cell === "X") ? (colorXInput?.value || "red") : (cell === "O") ? (colorOInput?.value || "blue") : "";
    div.addEventListener("click", () => handleClick(idx));
    boardEl.appendChild(div);
  });
}

function handleClick(idx) {
  if(gameOver || board[idx] !== "") return;

  if(gameMode === "two-player") {
    board[idx] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  } else {
    board[idx] = playerSymbol;
    if(!checkWinner()) aiMove();
  }

  createBoard();
  checkWinner();
}

function aiMove() {
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  if(empty.length === 0) return;

  let move;
  if(aiDifficulty === "easy") {
    move = empty[Math.floor(Math.random()*empty.length)];
  } else {
    // Hard: simple strategy to block or win
    move = empty[0]; // placeholder, can improve with minimax
  }

  board[move] = aiSymbol;
}

function checkWinner() {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for(const combo of winCombos) {
    const [a,b,c] = combo;
    if(board[a] && board[a] === board[b] && board[a] === board[c]) {
      alert(board[a] + " wins!");
      if(board[a] === "X") scoreX++; else scoreO++;
      updateScores();
      gameOver = true;
      return true;
    }
  }

  if(board.every(cell=>cell!=="")) {
    alert("It's a tie!");
    tieScore++;
    updateScores();
    gameOver = true;
    return true;
  }

  return false;
}

function updateScores() {
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
  scoreTieEl.textContent = tieScore;
}

// Event listeners
twoPlayerBtn.addEventListener("click", ()=>{
  gameMode="two-player";
  board.fill("");
  gameOver=false;
  createBoard();
});

vsAiBtn.addEventListener("click", ()=>{
  gameMode="vs-ai";
  symbolChoiceEl.classList.remove("hidden");
});

chooseXBtn.addEventListener("click", ()=>{
  playerSymbol="X";
  aiSymbol="O";
  symbolChoiceEl.classList.add("hidden");
  difficultyChoiceEl.classList.remove("hidden");
});

chooseOBtn.addEventListener("click", ()=>{
  playerSymbol="O";
  aiSymbol="X";
  symbolChoiceEl.classList.add("hidden");
  difficultyChoiceEl.classList.remove("hidden");
});

easyBtn.addEventListener("click", ()=>{
  aiDifficulty="easy";
  difficultyChoiceEl.classList.add("hidden");
  colorChoiceEl.classList.remove("hidden");
  board.fill("");
  gameOver=false;
  createBoard();
});

hardBtn.addEventListener("click", ()=>{
  aiDifficulty="hard";
  difficultyChoiceEl.classList.add("hidden");
  colorChoiceEl.classList.remove("hidden");
  board.fill("");
  gameOver=false;
  createBoard();
});

applyColorsBtn.addEventListener("click", ()=>{
  createBoard();
});

resetBtn.addEventListener("click", ()=>{
  scoreX=0; scoreO=0; tieScore=0;
  updateScores();
});

// Initial board
createBoard();
updateScores();









