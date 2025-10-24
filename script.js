document.addEventListener("DOMContentLoaded", () => {

  // Game state
  let board = Array(9).fill("");
  let currentPlayer = "X";
  let gameMode = "two-player";
  let playerSymbol = "X";
  let aiSymbol = "O";
  let gameOver = false;

  // DOM elements
  const boardEl = document.getElementById("board");
  const resetBtn = document.getElementById("reset");
  const modeBtns = {
    twoPlayer: document.getElementById("two-player"),
    vsAI: document.getElementById("vs-ai")
  };
  const symbolChoiceEl = document.getElementById("symbol-choice");
  const chooseXBtn = document.getElementById("choose-x");
  const chooseOBtn = document.getElementById("choose-o");

  // Winning combinations
  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // Initialize board
  function initBoard() {
    boardEl.innerHTML = "";
    board.forEach((cell, index) => {
      const cellEl = document.createElement("div");
      cellEl.classList.add("cell");
      cellEl.addEventListener("click", () => handleClick(cellEl, index));
      boardEl.appendChild(cellEl);
    });
  }

  // Handle cell click
  function handleClick(cellEl, index) {
    if (board[index] !== "" || gameOver) return;

    const symbol = currentPlayer;
    board[index] = symbol;
    cellEl.textContent = symbol;
    cellEl.classList.remove("x","o");
    cellEl.classList.add(symbol.toLowerCase());

    if (checkWin(symbol)) {
      gameOver = true;
      alert(symbol + " wins!");
      return;
    }

    if (board.every(cell => cell !== "")) {
      gameOver = true;
      alert("It's a tie!");
      return;
    }

    if (gameMode === "two-player") {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    } else if (gameMode === "vs-ai") {
      currentPlayer = aiSymbol;
      aiMove();
      currentPlayer = playerSymbol;
    }
  }

  // AI move: random empty cell
  function aiMove() {
    if (gameOver) return;
    const emptyIndexes = board.map((v,i) => v === "" ? i : null).filter(v => v !== null);
    if (emptyIndexes.length === 0) return;

    const moveIndex = emptyIndexes[Math.floor(Math.random()*emptyIndexes.length)];
    const cellEl = boardEl.children[moveIndex];
    board[moveIndex] = aiSymbol;
    cellEl.textContent = aiSymbol;
    cellEl.classList.remove("x","o");
    cellEl.classList.add(aiSymbol.toLowerCase());

    checkWin(aiSymbol);
  }

  // Check for win
  function checkWin(symbol) {
    let won = false;
    winningCombos.forEach(combo => {
      if (combo.every(index => board[index] === symbol)) {
        won = true;
        combo.forEach(index => boardEl.children[index].classList.add("winning"));
      }
    });
    return won;
  }





