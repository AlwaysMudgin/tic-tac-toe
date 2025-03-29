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

    return {getBoard, placeToken, printBoard, getValue};
}

function createPlayer(number) {
    const name = `Player` + number;
    const token = number;

    return {name, token};
}

function GameController(player1 = createPlayer(1), player2 = createPlayer(2)) {
    const board = Gameboard();

    const players = [player1, player2];

    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
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
            switchPlayer();
            printNewRound();
        } else {
            board.printBoard();
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

        // rows
        checkValues(0, 1, 2);
        checkValues(3, 4, 5);
        checkValues(6, 7, 8);

        // columns
        checkValues(0, 3, 6);
        checkValues(1, 4, 7);
        checkValues(2, 5, 8);

        // diagonals
        checkValues(0, 4, 8);
        checkValues(6, 4, 2);

        const winnerToken = checkResults.find((value) => value > 0);
        console.log(`Winner token: ${winnerToken}`);
        const winner = players.find((value) => value.token === winnerToken);
        console.log(`Winner: ${winner}`);

        return(winner);
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer
    }
}

const game = GameController();