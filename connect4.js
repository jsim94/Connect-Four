/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class BoardGame {
  constructor(WIDTH, HEIGHT, p1Color, p2Color) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.currPlayer = true;
    this.board = [];
    this.htmlBoard = document.getElementById("board");
    this.playerLabels = document.querySelectorAll(".player h2");
    this.makeBoard();
    this.makeHtmlBoard();
    this.updatePlayer();
  }

  isEven(x) {
    if (x % 2 == 0) return true;
  }

  clearBoard() {
    document.querySelector(".win-screen").style = "visibility:hidden";
    this.htmlBoard.innerHTML = "";
    this.playerLabels.forEach((val) => {
      val.setAttribute("style", `background:white`);
    });
  }

  makeBoard() {
    this.board = Array.from(Array(this.WIDTH), () => Array.from(Array(this.HEIGHT), () => null));
  }

  makeHtmlBoard() {
    // Create game board where pieces will land
    for (let x = 0; x < this.HEIGHT; x++) {
      const row = document.createElement("tr");
      for (let y = 0; y < this.WIDTH; y++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${this.HEIGHT - 1 - x}`);
        row.append(cell);
      }
      this.htmlBoard.append(row);
    }
  }

  updateBoardArray({ x, y }, value) {
    this.board[x][y] = value;
  }

  placePiece({ x, y }) {
    const correctCell = document.getElementById(`${x}-${y}`);
    const newPiece = document.createElement("div");
    newPiece.setAttribute("class", `piece ${this.currPlayer ? "player1" : "player2"}`);
    newPiece.setAttribute("id", `${x}-${y}`);
    correctCell.append(newPiece);
    return newPiece;
  }

  movePiece(piece, newCell) {
    piece.id = newCell.id;
    piece.parentElement.removeChild(piece);
    newCell.append(piece);
  }

  deletePiece({ x, y }) {
    const cellId = `${x}-${y}`;
    const pieceToRemove = document.getElementById(cellId).firstChild;
    pieceToRemove.parentElement.removeChild(pieceToRemove);
  }

  toggleSelectPiece(piece) {
    piece.classList.toggle("selected");
  }

  isOccupied({ x, y }) {
    if (this.board[x][y] === null) return false;
    return true;
  }

  endGame(msg) {
    const winScreen = document.querySelector(".win-screen");
    winScreen.firstChild.innerText = msg;
    winScreen.style = "visibility:visible";
  }

  updatePlayer() {
    if (this.currPlayer) {
      this.playerLabels[0].setAttribute("style", `background:${color1}`);
      this.playerLabels[1].setAttribute("style", `background:white`);
    } else {
      this.playerLabels[0].setAttribute("style", `background:white`);
      this.playerLabels[1].setAttribute("style", `background:${color2}`);
    }
  }
}
//////
/* ~~TODO~~
    -add king functionality
    -add mandatory captures when opportune.
    -allow additional captures after capture
      -remove 'player doesn't change after capture' feature
*/
class Checkers extends BoardGame {
  constructor() {
    super(8, 8);
    this.piece = undefined;
    this.newCell = undefined;

    this.initBoard();
    this.buttonHandler = this.handleClick.bind(this);
    this.htmlBoard.addEventListener("click", this.buttonHandler);
  }

  makeHtmlBoard() {
    // Create game board where pieces will land
    for (let x = 0; x < this.HEIGHT; x++) {
      const row = document.createElement("tr");
      for (let y = 0; y < this.WIDTH; y++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${this.HEIGHT - 1 - x}`);
        if (this.isEven(y)) {
          if (this.isEven(x)) {
            cell.setAttribute("style", "background: grey");
          }
        } else {
          if (!this.isEven(x)) {
            cell.setAttribute("style", "background: grey");
          }
        }
        row.append(cell);
      }
      this.htmlBoard.append(row);
    }
  }

  initBoard() {
    const populateRow = (row, y) => {
      row.forEach((val, x) => {
        const pos = { x, y };
        if (this.isEven(y)) {
          if (this.isEven(x)) {
            this.placePiece(pos).addEventListener;
            this.updateBoardArray(pos, this.currPlayer);
          }
        } else {
          if (!this.isEven(x)) {
            this.placePiece(pos);
            this.updateBoardArray(pos, this.currPlayer);
          }
        }
      });
    };

    populateRow(this.board[0], 0);
    populateRow(this.board[1], 1);
    this.currPlayer = !this.currPlayer;
    populateRow(this.board[6], 6);
    populateRow(this.board[7], 7);
    this.currPlayer = !this.currPlayer;
  }

  isValidMove(oldPos, newPos) {
    // check if newPos is unoccupied
    if (this.isOccupied(newPos)) {
      return false;
    }
    // function to check if overtaking opponent on +2 move
    const _isOvertake = ({ x, y }) => {
      if (this.board[x][y] === !this.currPlayer) return true;
    };
    // function to check if x is +1
    const _checkX = (oldX, newX) => {
      if (oldX.x + 1 === newX.x || oldX.x - 1 === newX.x) return true;
      return false;
    };
    // function to check if x is +2 and return the direction
    const _checkX2 = (oldX, newX) => {
      if (oldX.x + 2 === newX.x) return "+";
      if (oldX.x - 2 === newX.x) return "-";
      return false;
    };

    // check player1 moves
    if (this.currPlayer) {
      // check if move is y+1
      if (oldPos.y + 1 === newPos.y) {
        // return if x is valid
        return _checkX(oldPos, newPos);
      }
      // check if move is y+2
      if (oldPos.y + 2 === newPos.y) {
        //check if x is valid and if its overtaking an opponent
        const checkX2 = _checkX2(oldPos, newPos);
        if (checkX2 === "+") {
          const checkPos = { x: oldPos.x + 1, y: oldPos.y + 1 };
          if (_isOvertake(checkPos)) return checkPos;
        }
        if (checkX2 === "-") {
          const checkPos = { x: oldPos.x - 1, y: oldPos.y + 1 };
          if (_isOvertake(checkPos)) return checkPos;
        }
      }
      // check player2 moves
    } else {
      // check is move is y-1
      if (oldPos.y - 1 === newPos.y) {
        // return if x is valid
        return _checkX(oldPos, newPos);
      }
      // check if move is y-2
      if (oldPos.y - 2 === newPos.y) {
        //check if x is valid and if its overtaking an opponent
        const checkX2 = _checkX2(oldPos, newPos);
        if (checkX2 === "+") {
          const checkPos = { x: oldPos.x + 1, y: oldPos.y - 1 };
          if (_isOvertake(checkPos)) return checkPos;
        }
        if (checkX2 === "-") {
          const checkPos = { x: oldPos.x - 1, y: oldPos.y - 1 };
          if (_isOvertake(checkPos)) return checkPos;
        }
      }

      return false;
    }
  }

  checkForWin() {
    if (
      !this.board.some((x) => {
        return x.includes(true);
      })
    ) {
      this.endGame("Player 2 wins!");
    }
    if (
      !this.board.some((x) => {
        return x.includes(false);
      })
    ) {
      this.endGame("Player 1 wins!");
    }
  }

  handleClick(e) {
    // checks if a piece was clicked
    if (e.target.classList.contains("piece")) {
      // checks if a piece is already selected
      if (!this.piece) {
        // check if player1 selects own piece
        if (e.target.classList.contains("player2") && this.currPlayer) {
          console.log("WARNING: Player 1's turn!");
          return;
        }
        // check if player2 selects own piece
        if (e.target.classList.contains("player1") && !this.currPlayer) {
          console.log("WARNING: Player 2's turn!");
          return;
        }
        // sets new piece
        this.piece = e.target;
        this.toggleSelectPiece(this.piece);
      } else {
        // if a piece is already selected, reset piece
        this.toggleSelectPiece(this.piece);
        this.piece = undefined;
        return;
      }
      // checks if board cell was clicked
    } else if (e.target.localName === "td" && this.piece) {
      //sets new target
      this.newCell = e.target;
    } else return;

    // checks if a new piece and new target have been selected
    if (this.piece && this.newCell) {
      // sets locations in objects
      const oldPos = { x: parseInt(this.piece.id[0]), y: parseInt(this.piece.id[2]) };
      const newPos = { x: parseInt(this.newCell.id[0]), y: parseInt(this.newCell.id[2]) };

      //checks if move is valid(proper move and not occupied)
      const moveType = this.isValidMove(oldPos, newPos);
      if (moveType) {
        // remove old piece location
        this.updateBoardArray(oldPos, null);
        // add new new piece location
        this.updateBoardArray(newPos, this.currPlayer);

        // if moveType returns a pos, remove a piece at that pos
        if (typeof moveType === "object") {
          // delete piece at moveType's pos
          this.updateBoardArray(moveType, null);
          this.deletePiece(moveType);
          this.currPlayer = !this.currPlayer;
        }
        // draw new piece
        this.movePiece(this.piece, this.newCell);
        // reset move params
        this.toggleSelectPiece(this.piece);
        this.piece = undefined;
        this.newCell = undefined;
        // change active player
        this.currPlayer = !this.currPlayer;
        this.updatePlayer();
      }
    }
  }
}

//////
/* ~~TODO~~
    add more animation
*/
class ConnectFour extends BoardGame {
  constructor() {
    super(7, 6);
  }

  makeHtmlBoard() {
    this.buttonHandler = this.handleClick.bind(this);

    const topRow = document.createElement("tr");
    topRow.setAttribute("id", "column-top");
    topRow.addEventListener("click", this.buttonHandler);

    // Create top row for adding pieces to board.
    this.board.forEach((val, x) => {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      topRow.append(headCell);
    });

    this.htmlBoard.append(topRow);
    this.topRow = topRow;
    super.makeHtmlBoard();
  }

  findSpotForCol(x) {
    return this.board[x].indexOf(null) + 1 ? this.board[x].indexOf(null) : null;
  }

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(([x, y]) => {
        if (x >= 0 && x < this.WIDTH && y >= 0 && y < this.HEIGHT && this.board[x][y] === this.currPlayer) return true;
      });
    };
    // start from every array cell and create a horizontal, vertical, and diagonal arrays to check for 4 in a row.
    for (let x = 0; x < this.WIDTH; x++) {
      for (let y = 0; y < this.HEIGHT; y++) {
        const horiz = [
          [x, y],
          [x + 1, y],
          [x + 2, y],
          [x + 3, y],
        ];
        const vert = [
          [x, y],
          [x, y + 1],
          [x, y + 2],
          [x, y + 3],
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

  checkForTie() {
    return !this.board.some((x) => {
      return x.includes(null) ? true : false;
    });
  }

  handleClick(e) {
    // get x from ID of clicked cell
    const x = +e.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    // place piece in memory and add to HTML table
    const newPos = { x, y };

    this.placePiece(newPos);
    this.updateBoardArray(newPos, this.currPlayer);

    // check for win
    if (this.checkForWin()) {
      this.topRow.removeEventListener("click", this.buttonHandler);
      return this.endGame(`Player ${this.currPlayer ? "1" : "2"} wins!`);
    }

    if (this.checkForTie()) {
      this.topRow.removeEventListener("click", this.buttonHandler);
      return this.endGame(`It's a tie!`);
    }

    // switch players
    this.currPlayer = !this.currPlayer;
    this.updatePlayer();
  }
}

/*
  Initializations
*/
const handleConnectFourClick = () => {
  if (currentGame) return;
  toggleOptions();
  const newConnectFour = new ConnectFour();
  currentGame = newConnectFour;
};
const handleCheckersClick = () => {
  if (currentGame) return;
  toggleOptions();
  const newCheckers = new Checkers();
  currentGame = newCheckers;
};
const handleResetClick = () => {
  if (!currentGame) return;
  toggleOptions();
  currentGame.clearBoard();
  currentGame = null;
};
const handleColorChange = (e) => {
  if (e.target.id === "player1") {
    color1 = `hsl(${e.target.value}, 100%, 50%)`;
  }
  if (e.target.id === "player2") {
    color2 = `hsl(${e.target.value}, 100%, 50%)`;
  }
  document.getElementById("playerColors").innerHTML = `.player1 {
        background-color: ${color1};
      }
      .player2 {
        background-color: ${color2};
      }`;
  document.getElementById("background").innerHTML = `.background {
        content: linear-gradient(45deg, ${color1} 0%, ${color2} 100%);
      }`;
};
const toggleOptions = () => {
  color1Slider.toggleAttribute("disabled");
  color2Slider.toggleAttribute("disabled");
  playConnectFour.toggleAttribute("disabled");
  playCheckers.toggleAttribute("disabled");
  resetBtn.toggleAttribute("disabled");
};

let currentGame = null;
let color1 = "hsl(0, 100%, 50%)";
let color2 = "hsl(250, 100%, 50%)";
const color1Slider = document.getElementById("player1");
const color2Slider = document.getElementById("player2");
const playConnectFour = document.getElementById("playConnectFour");
const playCheckers = document.getElementById("playCheckers");
const resetBtn = document.getElementById("reset");

color1Slider.addEventListener("input", handleColorChange);
color2Slider.addEventListener("input", handleColorChange);
playConnectFour.addEventListener("click", handleConnectFourClick);
playCheckers.addEventListener("click", handleCheckersClick);
resetBtn.addEventListener("click", handleResetClick);
