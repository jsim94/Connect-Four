/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
const TIE_CONDITION = WIDTH * HEIGHT;
const PLAYER1 = true;
const PLAYER2 = false;
const PLAYER1_COLOR = "red";
const PLAYER2_COLOR = "blue";

let currPlayer = true; // true = player1 false = player2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let turns = 0; // variable to determine a tie condition

/*  ~~DONE~~
    makeBoard: create in-JS board structure:
      board = array of rows, each row is array of cells  (board[y][x])
      board = [
                ['', '', '', '', '', '', '']
                ['', '', '', '', '', '', '']
                ['', '', '', '', '', '', '']
                ['', '', '', '', '', '', '']
                ['', '', '', '', '', '', '']
                ['', '', '', '', '', '', '']
              ]
*/
function makeBoard() {
  //  initalizes JS board array of empty strings.
  board = Array.from(Array(WIDTH), () => Array.from(Array(HEIGHT), () => ""));
}

/*  ~~DONE~~
    makeHtmlBoard: make HTML table and row of column tops. 
*/
function makeHtmlBoard() {
  // Create top row for adding pieces to board.
  const htmlBoard = document.getElementById("board");
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  board.forEach((val, x) => {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  });
  htmlBoard.append(top);

  // Create game board where pieces will land
  for (let x = 0; x < HEIGHT; x++) {
    const row = document.createElement("tr");
    for (let y = 0; y < WIDTH; y++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${HEIGHT - 1 - x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/*  ~~DONE~~
    findSpotForCol: given column x, return top empty y (null if filled) 
*/
function findSpotForCol(x) {
  return board[x].indexOf("") + 1 ? board[x].indexOf("") : null;
}

/*  ~~DONE~~ 
    placeInTable: update DOM to place piece into HTML table of board 
*/
function placeInTable(x, y) {
  const correctCell = document.getElementById(`${x}-${y}`);
  const newPiece = document.createElement("div");
  newPiece.setAttribute("class", `piece ${currPlayer ? PLAYER1_COLOR : PLAYER2_COLOR}`);
  correctCell.append(newPiece);
}

/*  ~~DONE~~
    setNewPiece: add piece to memory and call placeInTable
*/
function setNewPiece(x, y) {
  board[x][y] = currPlayer ? PLAYER1 : PLAYER2;
}

/*  ~~DONE~~
    endGame: announce game end 
*/
function endGame(msg) {
  setTimeout(() => {
    alert(msg);
    location.reload();
    return false;
  }, 0);
}

/*  ~~DONE~~
    checkForWin: check board cell-by-cell for "does a win start here?" 
*/
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(([x, y]) => {
      if (x >= 0 && x < HEIGHT && y >= 0 && y < WIDTH && board[x][y] === currPlayer) return true;
    });
  }
  // start from every array cell and create a horizontal, vertical, and diagonal arrays to check for 4 in a row.
  for (let x = 0; x < HEIGHT; x++) {
    for (let y = 0; y < WIDTH; y++) {
      const horiz = [
        [x, y],
        [x, y + 1],
        [x, y + 2],
        [x, y + 3],
      ];
      const vert = [
        [x, y],
        [x + 1, y],
        [x + 2, y],
        [x + 3, y],
      ];
      const diagDR = [
        [x, y],
        [x + 1, y + 1],
        [x + 2, y + 2],
        [x + 3, y + 3],
      ];
      const diagDL = [
        [x, y],
        [x + 1, y - 1],
        [x + 2, y - 2],
        [x + 3, y - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

/*  ~~DONE~~
    checkForTie: check if all cells are occupied
*/
function checkForTie() {
  return !board.some((x) => {
    return x.includes("") ? true : false;
  });
}

/*  ~~DONE~~
    handleClick: handle click of column top to play piece 
*/
function handleClick(e) {
  // get x from ID of clicked cell
  const x = +e.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // place piece in memory and add to HTML table
  setNewPiece(x, y);
  placeInTable(x, y);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer ? "1" : "2"} won!`);
  }

  if (checkForTie()) {
    return endGame(`It's a tie!`);
  }

  // switch players
  currPlayer = !currPlayer;
}

makeBoard();
makeHtmlBoard();
