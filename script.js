const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const turnDisplay = document.getElementById('turn');
const modeRadios = document.querySelectorAll('input[name="mode"]');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;
let scoreX = 0;
let scoreO = 0;
let mode = 'ai'; // default mode

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Update mode when radio changes
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
      cells[a].style.backgroundColor = '#90ee90';
      cells[b].style.backgroundColor = '#90ee90';
      cells[c].style.backgroundColor = '#90ee90';
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

// Update score display
function updateScore() {
  document.getElementById('scoreX').textContent = scoreX;
  document.getElementById('scoreO').textContent = scoreO;
}

// Smart AI move
function computerMove() {
  if (isGameOver) return;
  let move = findBestMove('O') || findBestMove('X') || (board[4]===''?4:null);
  if (!move) {
    const corners = [0,2,6,8].filter(i => board[i] === '');
    move = corners.length ? corners[Math.floor(Math.random()*corners.length)] : null;
  }
  if (!move) {
    const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
    move = empty.length ? empty[Math.floor(Math.random()*empty.length)] : null;
  }
  if (move !== null) {
    board[move] = 'O';
    cells[move].textContent = 'O';
    checkWinner();
    currentPlayer = 'X';
    updateTurn();
  }
}

function findBestMove(player) {
  for (let combo of winningCombinations) {
    const [a,b,c] = combo;
    const line = [board[a], board[b], board[c]];
    if (line.filter(v => v===player).length===2 && line.includes('')) return combo[line.indexOf('')];
  }
  return null;
}

// Update turn display
function updateTurn() {
  if (!isGameOver) turnDisplay.textContent = `Current turn: ${currentPlayer}`;
  else turnDisplay.textContent = '';
}

// Handle clicks
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.dataset.index;
    if (board[index] === '' && !isGameOver) {
      board[index] = currentPlayer;
      cell.textContent = currentPlayer;
      checkWinner();

      if (!isGameOver) {
        if (mode === 'two') {
          currentPlayer = currentPlayer==='X'?'O':'X';
          updateTurn();
        } else if (mode === 'ai' && currentPlayer==='X') {
          currentPlayer = 'O';
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
    cell.style.backgroundColor = '#f0f0f0';
  });
  message.textContent = '';
  currentPlayer = 'X';
  isGameOver = false;
  updateTurn();
}


