const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const restartMatchBtn = document.getElementById('restartMatch');
const turnDisplay = document.getElementById('turn');
const modeRadios = document.querySelectorAll('input[name="mode"]');

const chooseXBtn = document.getElementById('chooseX');
const chooseOBtn = document.getElementById('chooseO');
const symbolChoiceDiv = document.getElementById('symbol-choice');
const gameDiv = document.getElementById('game');

let board = Array(9).fill('');
let playerSymbol = 'X';
let aiSymbol = 'O';
let currentPlayer = 'X';
let isGameOver = false;
let scoreX = 0;
let scoreO = 0;
let mode = 'ai';

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Symbol selection
chooseXBtn.addEventListener('click', () => { playerSymbol = 'X'; aiSymbol = 'O'; startGame(); });
chooseOBtn.addEventListener('click', () => { playerSymbol = 'O'; aiSymbol = 'X'; startGame(); });

function startGame() {
  symbolChoiceDiv.style.display = 'none';
  gameDiv.style.display = 'block';
  currentPlayer = playerSymbol;
  updateTurn();
  resetBoard();

  if (mode === 'ai' && playerSymbol === 'O') {
    currentPlayer = aiSymbol;
    updateTurn();
    setTimeout(computerMove, 300);
  }
}

// Mode switch
modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    mode = radio.value;
    resetGame();
  });
});

// Handle clicks
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.dataset.index;
    if (board[index] === '' && !isGameOver) {
      makeMove(cell, index, currentPlayer);
      checkWinner();

      if (!isGameOver) {
        if (mode === 'two') {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          updateTurn();
        } else if (mode === 'ai' && currentPlayer === playerSymbol) {
          currentPlayer = aiSymbol;
          updateTurn();
          setTimeout(computerMove, 300);
        }
      }
    }
  });
});

function makeMove(cell, index, player) {
  const symbol = player.toUpperCase(); // ensure X or O
  board[index] = symbol;
  cell.textContent = symbol;
  cell.style.color = symbol === 'X' ? 'red' : 'blue';
}

function checkWinner() {
  for (let combo of winningCombinations) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      cells[a].classList.add('winning');
      cells[b].classList.add('winning');
      cells[c].classList.add('winning');

      message.textContent = `Player ${board[a]} wins!`;
      isGameOver = true;

      if (board[a] === 'X') scoreX++;
      else scoreO++;

      updateScore();
      return;
    }
  }

  if (!board.includes('')) {
    message.textContent = "It's a tie!";
    isGameOver = true;
  }
}

function updateScore() {
  document.getElementById('scoreX').textContent = scoreX;
  document.getElementById('scoreO').textContent = scoreO;
}

function updateTurn() {
  if (!isGameOver) turnDisplay.textContent = `Current turn: ${currentPlayer}`;
  else turnDisplay.textContent = '';
}

resetButton.addEventListener('click', resetGame);
restartMatchBtn.addEventListener('click', resetMatch);

function resetBoard() {
  board.fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winning');
  });
  isGameOver = false;
  message.textContent = '';
}

function resetGame() {
  scoreX = 0;
  scoreO = 0;
  updateScore();
  resetBoard();
  currentPlayer = playerSymbol;
  updateTurn();
}

function resetMatch() {
  resetBoard();
  currentPlayer = playerSymbol;
  updateTurn();
}

// Simple AI
function computerMove() {
  if (isGameOver) return;

  let move = findWinningMove(aiSymbol) || findWinningMove(playerSymbol) || (board[4] === '' ? 4 : null);

  if (!move) {
    const corners = [0, 2, 6, 8].filter(i => board[i] === '');
    move = corners.length ? corners[Math.floor(Math.random() * corners.length)] : null;
  }

  if (!move) {
    const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
    move = empty.length ? empty[Math.floor(Math.random()*empty.length)] : null;
  }

  if (move !== null) {
    makeMove(cells[move], move, aiSymbol);
    checkWinner();
    currentPlayer = playerSymbol;
    updateTurn();
  }
}

function findWinningMove(player) {
  for (let combo of winningCombinations) {
    const [a,b,c] = combo;
    const line = [board[a], board[b], board[c]];
    if (line.filter(v => v===player).length === 2 && line.includes('')) return combo[line.indexOf('')];
  }
  return null;
}




