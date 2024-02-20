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

  const drawMarker = (row, column, player) => {
    board[row][column] = GridCell().addMarker(player);
  };

  return {getBoard, initializeGameBoard, drawMarker, cellIsAvailable};
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

  let currentPlayer = "player1";

  const switchPlayer = () => {
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
  };

  const checkWinner = () => {
    const cells = [];
    let index = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        cells[index] = board[i][j];
        index++;
      }
    }
    console.log("Cell array", cells);
  };

  const playRound = (row, column) => {
    // Check if cell is available for move
    if (!gameBoard.cellIsAvailable(row, column)) {
      console.log("Cell is occupied");
      console.log(currentPlayer);
      return;
    }
    gameBoard.drawMarker(row, column, currentPlayer);
    console.table(board);
    console.log(currentPlayer);

    // Check for winner
    checkWinner();

    // Only switch player if current player successfully made a move
    switchPlayer();
  };

  return {playRound, switchPlayer};
})();

console.table(gameBoard.getBoard());
