function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(0);
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        if (board[row][column] != 0) {
            console.log(`Invalid selection`);
            return;
        } else {
            board[row][column] = player.token;
        }
    }

    const printBoard = () => {
        console.log(board[0]);
        console.log(board[1]);
        console.log(board[2]);
    }

    const getValue = (row, column) => {
        return(board[row][column]);
    }

    const resetBoard = () => {
        board.length = 0;
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(0);
            }
        }
    }

    return {getBoard, placeToken, printBoard, getValue, resetBoard};
}

function GameController() {
    const board = Gameboard();

    const players = [{
        name: "Player1",
        token: 1
    }, {
        name: "Player2",
        token: 2
    }];

    let activePlayer = players[0];

    let turn = 1;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        turn++;
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, column) => {
        console.log(
            `Placing ${getActivePlayer().name}'s token in row ${row} column ${column}...`
        );
        board.placeToken(row, column, getActivePlayer())
        let winner = checkWinner();
        if (winner === undefined) {
            if (turn === 9) {
                activePlayer = "Tie!"
                console.log(`Tie!`);
            } else {
                switchPlayer();
                printNewRound();
            }
        } else {
            board.printBoard();
            activePlayer = `${winner.name} Wins!`
            console.log(`${winner.name} Wins!`);
        }
    }

    const checkWinner = () => {
        let boardValues = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                boardValues.push(board.getValue(i, j));
            }
        }

        let checkResults = [];

        function checkValues(a, b, c) {
            if (boardValues[a] === boardValues[b]
                && boardValues[a] === boardValues[c]
            ) {
                checkResults.push(boardValues[a]);
            } else {
                checkResults.push(-1);
            }
        }

        checkValues(0, 1, 2);
        checkValues(3, 4, 5);
        checkValues(6, 7, 8);
        checkValues(0, 3, 6);
        checkValues(1, 4, 7);
        checkValues(2, 5, 8);
        checkValues(0, 4, 8);
        checkValues(6, 4, 2);

        const winnerToken = checkResults.find((value) => value > 0);
        const winner = players.find((value) => value.token === winnerToken);

        return(winner);
    }

    printNewRound();

    return {playRound, getActivePlayer, getBoard: board.getBoard};
}

function DisplayController() {
    const game = GameController();
    const playerTurn = document.querySelector(".player");
    const boardDisplay = document.querySelector(".gameboard");
    const board = game.getBoard();

    const updateDisplay = () => {
        boardDisplay.replaceChildren();
        const activePlayer = game.getActivePlayer();
        playerTurn.textContent = `${activePlayer.name}'s turn`;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.dataset.row = i;
                cell.dataset.column = j;
                const board = game.getBoard();
                if (board[i][j] === 1) {
                    const xToken = document.createElement("img");
                    xToken.src = "x-token.svg";
                    cell.appendChild(xToken);
                } else if (board[i][j] === 2) {
                    const oToken = document.createElement("img");
                    oToken.src = "o-token.svg";
                    cell.appendChild(oToken);
                } else {
                    cell.addEventListener("click", (e) => {
                        game.playRound(e.target.dataset.row, e.target.dataset.column);
                        updateDisplay();
                    })
                }
                boardDisplay.appendChild(cell);
            }
        }
        console.log(game.getBoard());
    }
    updateDisplay();
}
DisplayController();
