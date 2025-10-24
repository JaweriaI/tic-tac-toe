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

const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const tieSound = document.getElementById('tieSound');

let board = ['', '', '', '', '', '', '', '', ''];
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
chooseXBtn.addEventListener('click', () => {
  playerSymbol = 'X';
  aiSymbol = 'O';
  startGame();
});
chooseOBtn.addEventListener('click', () => {
  playerSymbol = 'O';
  aiSymbol = 'X';
  startGame();
});

function startGame() {
  symbolChoiceDiv.style.display = 'none';
  gameDiv.style.display = 'block';
  currentPlayer = 'X';
  updateTurn();
}

// Mode switch
modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    mode = radio.value;
    resetGame();
  });
});

// Check winner
function checkWinner() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      cells[a].classList.add('winning');
      cells[b].classList.add('winning');
      cells[c].classList.add('winning');

      message.textContent = `Player ${board[a]} wins!`;
      winSound.play();
      isGameOver = true;
      if (board[a] === 'X') scoreX++;
      else scoreO++;
      updateScore();
      return;
    }
  }
  if (!board.includes('')) {
    message.textContent = "It's a tie!";
    tieSound.play();
    isGameOver = true;
  }
}

// Update score
function updateScore() {
  document.getElementById('scoreX').textContent = scoreX;
  document.getElementById('scoreO').textContent = scoreO;
}

// Smart AI
function computerMove() {
  if (isGameOver) return;
  let move = findBestMove(aiSymbol) || findBestMove(playerSymbol) || (board[4]===''?4:null);
  if (!move) {
    const corners = [0,2,6,8].filter(i=>board[i]==='');
    move = corners.length ? corners[Math.floor(Math.random()*corners.length)] : null;
  }
  if (!move) {
    const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
    move = empty.length ? empty[Math.floor(Math.random()*empty.length)] : null;
  }
  if (move!==null) {
    board[move] = aiSymbol;
    cells[move].textContent = aiSymbol;
    cells[move].style.color = aiSymbol==='X'?'red':'blue';
    checkWinner();
    currentPlayer = playerSymbol;
    updateTurn();
  }
}

function findBestMove(player) {
  for (let combo of winningCombinations) {
    const [a,b,c] = combo;
    const line = [board[a], board[b], board[c]];
    if (line.filter(v=>v===player).length===2 && line.includes('')) return combo[line.indexOf('')];
  }
  return null;
}

// Update turn
function updateTurn() {
  if (!isGameOver) turnDisplay.textContent = `Current turn: ${currentPlayer}`;
  else turnDisplay.textContent = '';
}

// Handle clicks
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.dataset.index;
    if (board[index]==='' && !isGameOver) {
      board[index] = currentPlayer;
      cell.textContent = currentPlayer;
      cell.style.color = currentPlayer==='X'?'red':'blue';
      clickSound.play();

      checkWinner();

      if (!isGameOver) {
        if (mode==='two') {
          currentPlayer = currentPlayer==='X'?'O':'X';
          updateTurn();
        } else if (mode==='ai' && currentPlayer===playerSymbol) {
          currentPlayer = aiSymbol;
          updateTurn();
          setTimeout(computerMove, 300);
        }
      }
    }
  });
});

// Reset game
resetButton.addEventListener('click', resetGame);

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.backgroundColor = '#ffffff';
    cell.classList.remove('winning');
  });
  message.textContent = '';
  currentPlayer = 'X';
  isGameOver = false;
  updateTurn();
}

// Restart match
restartMatchBtn.addEventListener('click', () => {
  scoreX = 0;
  scoreO = 0;
  updateScore();
  resetGame();
  gameDiv.style.display = 'none';
  symbolChoiceDiv.style.display = 'block';
});
