const socket = io();
const chess = new Chess();
const boardElement = document.querySelector('.chessboard');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;
let gameStatus = 'active';

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === "w" ? "white" : "black");
                pieceElement.innerHTML = getPieceUnicode(square);
                pieceElement.draggable = gameStatus === 'active' && playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", function (e) {
                e.preventDefault();
                if (draggedPiece && gameStatus === 'active') {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col)
                    };
                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    // Flip the board for black player
    boardElement.classList.toggle('flipped', playerRole === 'b');
};

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q'
    };
    
    // Send the move to the server
    socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        k: {w: '\u2654', b: '\u265A'},
        q: {w: '\u2655', b: '\u265B'},
        r: {w: '\u2656', b: '\u265C'},
        b: {w: '\u2657', b: '\u265D'},
        n: {w: '\u2658', b: '\u265E'},
        p: {w: '\u2659', b: '\u265F'}
    };
    return unicodePieces[piece.type][piece.color];
};

const displayGameEnd = (result) => {
    const gameEndOverlay = document.createElement('div');
    gameEndOverlay.style.position = 'absolute';
    gameEndOverlay.style.top = '0';
    gameEndOverlay.style.left = '0';
    gameEndOverlay.style.width = '100%';
    gameEndOverlay.style.height = '100%';
    gameEndOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    gameEndOverlay.style.display = 'flex';
    gameEndOverlay.style.justifyContent = 'center';
    gameEndOverlay.style.alignItems = 'center';
    gameEndOverlay.style.flexDirection = 'column';
    gameEndOverlay.style.color = 'white';
    gameEndOverlay.style.fontSize = '24px';
    gameEndOverlay.style.zIndex = '1000';

    let resultText;
    if (result === 'white') {
        resultText = 'White wins!';
    } else if (result === 'black') {
        resultText = 'Black wins!';
    } else {
        resultText = 'It\'s a draw!';
    }

    gameEndOverlay.innerHTML = `
        <p>${resultText}</p>
        <button id="resetButton" style="margin-top: 20px; padding: 10px 20px; font-size: 18px; cursor: pointer;">Reset Game</button>
    `;

    document.body.appendChild(gameEndOverlay);

    document.getElementById('resetButton').addEventListener('click', () => {
        socket.emit('resetGame');
        document.body.removeChild(gameEndOverlay);
    });
};

socket.on("playerRole", function(role) {
    playerRole = role;
    renderBoard();
});

socket.on("boardState", function(fen) {
    chess.load(fen);
    renderBoard();
});

socket.on("move", function(move) {
    chess.move(move);
    renderBoard();
});

socket.on("InvalidMove", function() {
    console.log("Invalid move");
    // You might want to add some visual feedback for the user here
});

socket.on("gameEnd", function({ result }) {
    gameStatus = 'ended';
    displayGameEnd(result);
});

socket.on("gameReset", function() {
    gameStatus = 'active';
    chess.reset();
    renderBoard();
});

renderBoard();