const gameBoard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];

  const getBoard = () => board;

  const initializeGameBoard = () => {
    // create an empty grid
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(GridCell().getCell());
      }
    }
  };

  const cellIsAvailable = (row, column) => {
    if (board[row][column] === 0) {
      return true;
    }
  };

  const dropMarker = (row, column, player) => {
    board[row][column] = GridCell().addMarker(player);
  };

  return {getBoard, initializeGameBoard, dropMarker, cellIsAvailable};
})();

function GridCell() {
  // 0 for empty, 1 for player 1, 2 for player 2
  let cell = 0;
  let player1 = 1;
  let player2 = 2;

  const getCell = () => cell;

  const addMarker = (player) => {
    if (player === "player1") {
      return player1;
    } else if (player === "player2") {
      return player2;
    }
  };

  return {getCell, addMarker};
}

const gameController = (function () {
  gameBoard.initializeGameBoard();
  const board = gameBoard.getBoard();

  const players = [
    {
      id: "player1",
      token: 1,
      name: "Player 1",
    },
    {
      id: "player2",
      token: 2,
      name: "Player 2",
    },
  ];

  let currentPlayer = players[0];
  let winner = null;

  const getCurrentPlayer = () => currentPlayer;
  const getWinner = () => winner;

  const resetWinner = () => (winner = null);

  const switchPlayer = () => {
    currentPlayer = currentPlayer.id === "player1" ? players[1] : players[0];
  };

  const checkWinner = (player) => {
    const cells = [...board[0], ...board[1], ...board[2]];
    console.log("Cell array", cells);

    if (
      // Check for all rows
      cells.slice(0, 3).every((cell) => cell === player.token) ||
      cells.slice(3, 6).every((cell) => cell === player.token) ||
      cells.slice(6).every((cell) => cell === player.token) ||
      // Check for all columns
      [cells[0], cells[3], cells[6]].every((cell) => cell === player.token) ||
      [cells[1], cells[4], cells[7]].every((cell) => cell === player.token) ||
      [cells[2], cells[5], cells[8]].every((cell) => cell === player.token) ||
      // Check for diagonals
      [cells[0], cells[4], cells[8]].every((cell) => cell === player.token) ||
      [cells[2], cells[4], cells[6]].every((cell) => cell === player.token)
    ) {
      console.log(player.id, "Won");
      winner = player;
    }
  };

  const playRound = (row, column) => {
    if (winner) {
      console.log("Game has ended.");
      console.log("Winner: ", winner);
      return;
    }
    // Check if cell is available for move
    if (!gameBoard.cellIsAvailable(row, column)) {
      console.log("Cell is occupied");
      console.log(currentPlayer);
      return;
    }
    gameBoard.dropMarker(row, column, currentPlayer.id);
    console.table(board);
    console.log(currentPlayer);

    screenController.updatePlayerTurn(currentPlayer);
    // Check for winner
    checkWinner(currentPlayer);
    if (winner) {
      screenController.updateWinnerTitle(winner);
    }

    // Only switch player if current player successfully made a move
    switchPlayer();
  };

  return {playRound, getWinner, getCurrentPlayer, resetWinner};
})();

const screenController = (function () {
  const winnerTitle = document.querySelector(".player-turn");
  const gameGrid = document.querySelector(".game-grid");
  const newGameBtn = document.querySelector(".new-game");
  const gameGridCells = document.querySelectorAll(".grid-cell");

  gameGrid.addEventListener("click", (e) => {
    const winner = gameController.getWinner();
    if (winner) {
      return;
    }
    const [row, column] = e.target.dataset.cell.split(",");
    const currentPlayer = gameController.getCurrentPlayer();
    if (!gameBoard.cellIsAvailable(row, column)) {
      return;
    }
    gameController.playRound(row, column);
    if (currentPlayer.id === "player1") {
      e.target.textContent = "x";
    } else {
      e.target.textContent = "o";
    }
  });

  const updateWinnerTitle = (winner) => {
    winnerTitle.textContent = "Winner : " + winner.name;
  };

  const updatePlayerTurn = (currentPlayer) => {
    if (currentPlayer.id === "player1") {
      winnerTitle.textContent = "Player 2's turn";
    } else {
      winnerTitle.textContent = "Player 1's turn";
    }
  };

  newGameBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const board = gameBoard.getBoard();
    gameBoard.initializeGameBoard();
    console.table(board);
    gameGridCells.forEach((cell) => {
      cell.textContent = "";
    });
    gameController.resetWinner();
    winnerTitle.textContent = "Make a move!";
  });

  return {updateWinnerTitle, updatePlayerTurn};
})(document);

console.table(gameBoard.getBoard());
