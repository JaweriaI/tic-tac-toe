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

let scoreX = 0, scoreO = 0, tieScore = 0;

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Overlay functions
function showOverlay(message){
  overlayMessage.textContent = message;
  overlay.style.display = "flex";
}

function hideOverlay(){
  overlay.style.display = "none";
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
}

function updateCell(index, symbol){
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = symbol;
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
    tieScore++; saveScores(); updateScores(); gameOver=true;
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

  const cellEl = document.querySelector(`.cell[data-index='${moveIndex}']`);
  cellEl.classList.add("ai-thinking");

  setTimeout(()=>{
    board[moveIndex]=aiSymbol;
    updateCell(moveIndex,aiSymbol);
    cellEl.classList.remove("ai-thinking");

    const result = checkWin(aiSymbol);
    if(result){
      updateScore(aiSymbol);
      gameOver=true;
      showOverlay(`${aiSymbol} Wins!`);
    } else if(board.every(c=>c!=="")){
      tieScore++; saveScores(); updateScores(); gameOver=true;
      showOverlay("It's a Tie!");
    }

    currentPlayer = playerSymbol;
  },500);
}

function updateScore(player){
  if(player==="X") scoreX++;
  else scoreO++;
  saveScores();
  updateScores();
}

function saveScores(){
  localStorage.setItem("scoreX",scoreX);
  localStorage.setItem("scoreO",scoreO);
  localStorage.setItem("tieScore",tieScore);
}

function loadScores(){
  scoreX = parseInt(localStorage.getItem("scoreX"))||0;
  scoreO = parseInt(localStorage.getItem("scoreO"))||0;
  tieScore = parseInt(localStorage.getItem("tieScore"))||0;
}

function updateScores(){
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
  scoreTieEl.textContent = tieScore;
}

function resetBoard(){
  board = ["","","","","","","","",""];
  gameOver=false;
  currentPlayer="X";
  createBoard();
  document.querySelectorAll(".cell").forEach(c=>c.classList.remove("winning"));
}

// Minimax for hard AI
function minimax(newBoard, player){
  const availSpots = newBoard.map((v,i)=>v===""?i:null).filter(i=>i!==null);

  if(checkWin(playerSymbol)) return {score:-10};
  if(checkWin(aiSymbol)) return {score:10};
  if(availSpots.length===0) return {score:0};

  const moves=[];
  for(let i=0;i<availSpots.length;i++){
    const move={index:availSpots[i]};
    newBoard[availSpots[i]] = player;
    if(player===aiSymbol) move.score = minimax(newBoard,playerSymbol).score;
    else move.score = minimax(newBoard,aiSymbol).score;
    newBoard[availSpots[i]]="";
    moves.push(move);
  }

  let bestMove;
  if(player===aiSymbol){
    let bestScore=-Infinity;
    moves.forEach(m=>{if(m.score>bestScore){bestScore=m.score;bestMove=m;}});
    return bestMove;
  } else {
    let bestScore=Infinity;
    moves.forEach(m=>{if(m.score<bestScore){bestScore=m.score;bestMove=m;}});
    return bestMove;
  }
}

// Event Listeners
twoPlayerBtn.addEventListener("click",()=>{
  gameMode="two-player";
  symbolChoiceEl.style.display="none";
  difficultyChoiceEl.style.display="none";
  resetBoard();
});

vsAIBtn.addEventListener("click",()=>{
  gameMode="vs-ai";
  symbolChoiceEl.style.display="block";
  difficultyChoiceEl.style.display="none";
});

chooseXBtn.addEventListener("click",()=>{
  playerSymbol="X"; aiSymbol="O";
  difficultyChoiceEl.style.display="block";
  symbolChoiceEl.style.display="none";
  resetBoard();
});

chooseOBtn.addEventListener("click",()=>{
  playerSymbol="O"; aiSymbol="X";
  difficultyChoiceEl.style.display="block";
  symbolChoiceEl.style.display="none";
  resetBoard();
});

easyBtn.addEventListener("click",()=>{
  aiDifficulty="easy";
  resetBoard();
});

hardBtn.addEventListener("click",()=>{
  aiDifficulty="hard";
  resetBoard();
});

resetBtn.addEventListener("click",()=>{
  scoreX=0; scoreO=0; tieScore=0; saveScores(); updateScores(); resetBoard();
});

// Initial load
loadScores();
createBoard();
updateScores();











