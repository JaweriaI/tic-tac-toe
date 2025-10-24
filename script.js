const boardEl = document.getElementById("board");
const twoPlayerBtn = document.getElementById("two-player");
const vsAIBtn = document.getElementById("vs-ai");
const symbolChoiceEl = document.getElementById("symbol-choice");
const chooseXBtn = document.getElementById("choose-x");
const chooseOBtn = document.getElementById("choose-o");
const difficultyChoiceEl = document.getElementById("difficulty-choice");
const easyBtn = document.getElementById("easy");
const hardBtn = document.getElementById("hard");
const resetBtn = document.getElementById("reset");

const colorChoiceEl = document.getElementById("color-choice");
const colorXInput = document.getElementById("color-x");
const colorOInput = document.getElementById("color-o");
const colorBoardInput = document.getElementById("color-board");
const applyColorsBtn = document.getElementById("apply-colors");

const overlay = document.getElementById("overlay");
const overlayMessage = document.getElementById("overlay-message");
const overlayReset = document.getElementById("overlay-reset");

const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");
const scoreTieEl = document.getElementById("score-tie");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameMode = null;
let playerSymbol = "X";
let aiSymbol = "O";
let aiDifficulty = "easy";
let gameOver = false;

let colorX = "#FF0000";
let colorO = "#0000FF";
let colorBoard = "#f0f0f0";

let scoreX = 0, scoreO = 0, tieScore = 0;

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function showOverlay(message){
  overlayMessage.textContent = message;
  overlay.classList.remove("hidden");
}

function hideOverlay(){
  overlay.classList.add("hidden");
}

overlayReset.addEventListener("click", ()=>{
  hideOverlay();
  resetBoard();
});

function createBoard(){
  boardEl.innerHTML = "";
  board.forEach((cell,i)=>{
    const cellEl = document.createElement("div");
    cellEl.classList.add("cell");
    cellEl.dataset.index = i;
    cellEl.addEventListener("click", ()=>handleCellClick(i));
    boardEl.appendChild(cellEl);
  });
  updateBoardColors();
}

function updateCell(index, symbol){
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = symbol;
  cell.style.color = symbol==="X"?colorX:colorO;
  cell.style.backgroundColor = colorBoard;
}

function updateBoardColors(){
  document.querySelectorAll(".cell").forEach((cell,i)=>{
    if(board[i]!==""){
      cell.style.color = board[i]==="X"?colorX:colorO;
    }
    cell.style.backgroundColor = colorBoard;
  });
}

function checkWin(symbol){
  let won = false;
  let winningCells = [];
  winningCombos.forEach(combo=>{
    if(combo.every(i=>board[i]===symbol)){
      won = true;
      winningCells = combo;
    }
  });
  if(won){
    winningCells.forEach(i=>{
      document.querySelector(`.cell[data-index='${i}']`).classList.add("winning");
    });
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }
  return won ? winningCells : false;
}

function handleCellClick(i){
  if(gameOver || board[i]!=="") return;

  board[i] = currentPlayer;
  updateCell(i,currentPlayer);

  const result = checkWin(currentPlayer);
  if(result){
    updateScore(currentPlayer);
    gameOver=true;
    showOverlay(`Player ${currentPlayer} Wins!`);
    return;
  } else if(board.every(c=>c!=="")){
    tieScore++;
    saveScores();
    updateScores();
    gameOver=true;
    showOverlay("It's a Tie!");
    return;
  }

  if(gameMode==="two-player"){
    currentPlayer = currentPlayer==="X"?"O":"X";
  } else if(gameMode==="vs-ai"){
    currentPlayer = aiSymbol;
    aiMove();
  }
}

function aiMove(){
  if(gameOver) return;

  let moveIndex;
  if(aiDifficulty==="easy"){
    const empty = board.map((v,i)=>v===""?i:null).filter(i=>i!==null);
    moveIndex = empty[Math.floor(Math.random()*empty.length)];
  } else {
    moveIndex = minimax(board, aiSymbol).index;
  }

  setTimeout(()=>{
    board[moveIndex]=aiSymbol;
    updateCell(moveIndex,aiSymbol);

    const result = checkWin(aiSymbol);
    if(result){
      updateScore(aiSymbol);
      gameOver=true;
      showOverlay(`${aiSymbol} Wins!`);
    } else if(board.every(c=>c!=="")){
      tieScore++;
      saveScores();
      updateScores();
      gameOver=true;
      showOverlay("It's a Tie!");
    }

    currentPlayer = playerSymbol;
  },300);
}

function updateScore(player){
  if(player==="X") scoreX++;
  else scoreO++;
  saveScores();
  updateScores();
}

function updateScores(){
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
  scoreTieEl.textContent = tieScore;
}

function saveScores(){
  localStorage.setItem("tttScoreX",scoreX);
  localStorage.setItem("tttScoreO",scoreO);
  localStorage.setItem("tttTie",tieScore);
}

function loadScores(){
  scoreX = parseInt(localStorage.getItem("tttScoreX"))||0;
  scoreO = parseInt(localStorage.getItem("tttScoreO"))||0;
  tieScore = parseInt(localStorage.getItem("tttTie"))||0;
  updateScores();
}

function resetBoard(){
  board = ["","","","","","","","",""];
  gameOver = false;
  currentPlayer = (gameMode==="vs-ai") ? playerSymbol : "X";
  document.querySelectorAll(".cell").forEach(c=>c.classList.remove("winning"));
  createBoard();
}

// Event Listeners
twoPlayerBtn.addEventListener("click",()=>{
  gameMode="two-player";
  currentPlayer="X";
  symbolChoiceEl.classList.add("hidden");
  difficultyChoiceEl.classList.add("hidden");
  colorChoiceEl.classList.remove("hidden");
  resetBoard();
});

vsAIBtn.addEventListener("click",()=>{
  gameMode="vs-ai";
  symbolChoiceEl.classList.remove("hidden");
  difficultyChoiceEl.classList.add("hidden");
  colorChoiceEl.classList.add("hidden");
});

chooseXBtn.addEventListener("click",()=>{
  playerSymbol="X"; aiSymbol="O";
  symbolChoiceEl.classList.add("hidden");
  difficultyChoiceEl.classList.remove("hidden");
});

chooseOBtn.addEventListener("click",()=>{
  playerSymbol="O"; aiSymbol="X";
  symbolChoiceEl.classList.add("hidden");
  difficultyChoiceEl.classList.remove("hidden");
});

easyBtn.addEventListener("click",()=>{
  aiDifficulty="easy";
  difficultyChoiceEl.classList.add("hidden");
  colorChoiceEl.classList.remove("hidden");
  resetBoard();
});

hardBtn.addEventListener("click",()=>{
  aiDifficulty="hard";
  difficultyChoiceEl.classList.add("hidden");
  colorChoiceEl.classList.remove("hidden");
  resetBoard();
});

applyColorsBtn.addEventListener("click",()=>{
  colorX = colorXInput.value;
  colorO = colorOInput.value;
  colorBoard = colorBoardInput.value;
  updateBoardColors();
});

resetBtn.addEventListener("click",()=>{
  scoreX=0; scoreO=0; tieScore=0;
  saveScores();
  updateScores();
});

// Minimax for Hard AI
function minimax(newBoard, player){
  const availSpots = newBoard.map((v,i)=>v===""?i:null).filter(i=>i!==null);

  if(checkWinForMinimax(newBoard,playerSymbol)) return {score:-10};
  else if(checkWinForMinimax(newBoard,aiSymbol)) return {score:10};
  else if(availSpots.length===0) return {score:0};

  const moves = [];
  for(let i of availSpots){
    const move = {};
    move.index = i;
    newBoard[i]=player;

    if(player===aiSymbol){
      const result = minimax(newBoard,playerSymbol);
      move.score=result.score;
    } else {
      const result = minimax(newBoard,aiSymbol);
      move.score=result.score;
    }

    newBoard[i]="";
    moves.push(move);
  }

  let bestMove;
  if(player===aiSymbol){
    let bestScore=-Infinity;
    moves.forEach(m=>{ if(m.score>bestScore){ bestScore=m.score; bestMove=m; } });
  } else {
    let bestScore=Infinity;
    moves.forEach(m=>{ if(m.score<bestScore){ bestScore=m.score; bestMove=m; } });
  }

  return bestMove;
}

function checkWinForMinimax(b,player){
  return winningCombos.some(combo=>combo.every(i=>b[i]===player));
}

// Initialize
loadScores();
createBoard();









