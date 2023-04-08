import React, { useState} from "react";
import styled from "styled-components";

const pieceToImage = (piece: Piece): string | null => {
    if (!piece) return null;
    const publicUrl = process.env.PUBLIC_URL;
    switch (piece) {
        case 'WP':
            return `${publicUrl}/chess/WP.png`;
        case 'BP':
            return `${publicUrl}/chess/BP.png`;
        case 'WN':
            return `${publicUrl}/chess/WN.png`;
        case 'BN':
            return `${publicUrl}/chess/BN.png`;
        case 'WB':
            return `${publicUrl}/chess/WB.png`;
        case 'BB':
            return `${publicUrl}/chess/BB.png`;
        case 'WR':
            return `${publicUrl}/chess/WR.png`;
        case 'BR':
            return `${publicUrl}/chess/BR.png`;
        case 'WQ':
            return `${publicUrl}/chess/WQ.png`;
        case 'BQ':
            return `${publicUrl}/chess/BQ.png`;
        case 'WK':
            return `${publicUrl}/chess/WK.png`;
        case 'BK':
            return `${publicUrl}/chess/BK.png`;
        default:
            return null;
    }
};


const gridColors: boolean[][] = [
    [true, false, true, false, true, false, true, false],
    [false, true, false, true, false, true, false, true],
    [true, false, true, false, true, false, true, false],
    [false, true, false, true, false, true, false, true],
    [true, false, true, false, true, false, true, false],
    [false, true, false, true, false, true, false, true],
    [true, false, true, false, true, false, true, false],
    [false, true, false, true, false, true, false, true]
]

type Piece = string | null;

const initialBoard: Piece[][] = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

const BackgroundContainer = styled.div `
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    background: #282c34;
    text-align: center;
    h1-color: white;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 600px;
  height: 600px;
  margin: 0 auto;
`;

const Square = styled.div<{ isLight: boolean }>`
  background-color: ${(props) => (props.isLight ? "#ffe9c5" : "#964d37")};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ValidMoveIndicator = styled.div<{}>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const renderPiece = (piece: Piece) => {
    const imageSrc = pieceToImage(piece);
    if (!imageSrc) return null;
    return <img src={imageSrc} width={"100%"} height={"100%"} alt={piece || 'invalid'}/>;
};
const Chess: React.FC = () => {
    const [board, setBoard] = useState(initialBoard);
    const [dragging, setDragging] = useState<{ row: number; col: number } | null>(null);
    const [validDropLocations, setValidDropLocations] = useState<boolean[][]>([]);
    const [whiteTurn, setWhiteTurn] = useState<boolean>(true);
    const isWithinBounds = (row: number, col: number): boolean => {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    };

    const isValidPawnMove = (
        board: Piece[][],
        piece: string,
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number
    ): boolean => {
        if (!piece || (piece[1] !== "P" && piece[1] !== "p")) {
            return false;
        }

        const isWhite = piece[0] === "W";
        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);

        if (isWhite) {
            if (colDiff === 0) {
                if (rowDiff === -1) {
                    return board[toRow][toCol] === null;
                }
                if (rowDiff === -2 && fromRow === 6) {
                    return (
                        board[toRow][toCol] === null && board[toRow + 1][toCol] === null
                    );
                }
            } else if (colDiff === 1 && rowDiff === -1) {
                const targetPiece = board[toRow][toCol];
                return targetPiece !== null && targetPiece[0] === "B";
            }
        } else {
            if (colDiff === 0) {
                if (rowDiff === 1) {
                    return board[toRow][toCol] === null;
                }
                if (rowDiff === 2 && fromRow === 1) {
                    return (
                        board[toRow][toCol] === null && board[toRow - 1][toCol] === null
                    );
                }
            } else if (colDiff === 1 && rowDiff === 1) {
                const targetPiece = board[toRow][toCol];
                return targetPiece !== null && targetPiece[0] === "W";
            }
        }

        return false;
    };

    const isValidKnightMove = (
        board: Piece[][],
        piece: string,
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number
    ): boolean => {
        // Check if the piece is a knight
        if (!piece || (piece[1] !== "N" && piece[1] !== "n")) {
            return false;
        }

        const isWhite = piece[0] === "W";
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        // Check if the move is an L-shape (2 in one direction, 1 in the other)
        if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
            return false;
        }

        const targetPiece = board[toRow][toCol];
        return !targetPiece || targetPiece[0] !== (isWhite ? "W" : "B");
    };

    const isValidMove = (
        board: Piece[][],
        piece: string,
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number

    ): boolean => {
        switch (piece) {
            case 'WP' :
            case 'BP':
                return isValidPawnMove(board, piece, fromRow, fromCol, toRow, toCol);
            case 'WN' :
            case 'BN':
                return isValidKnightMove(board, piece, fromRow, fromCol, toRow, toCol);
            case 'WB' :
            case 'BB':
                return isValidBishopMove(board, piece, fromRow, fromCol, toRow, toCol);
            case 'WR' :
            case 'BR':
                return isValidRookMove(board, piece, fromRow, fromCol, toRow, toCol);
            case 'WQ' :
            case 'BQ':
                return isValidQueenMove(board, piece, fromRow, fromCol, toRow, toCol);
            case 'WK' :
            case 'BK':
                return isValidKingMove(board, piece, fromRow, fromCol, toRow, toCol);
        }
        return false;
    }

    const isValidBishopMove = (
        board: Piece[][],
        piece: string,
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number
    ): boolean => {
        if (!piece || (piece[1] !== "B" && piece[1] !== "b")) {
            return false;
        }

        const isWhite = piece[0] === "W";
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        if (rowDiff !== colDiff) {
            return false;
        }

        const rowStep = toRow > fromRow ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;

        let row = fromRow + rowStep;
        let col = fromCol + colStep;

        while (isWithinBounds(row, col) && (row !== toRow || col !== toCol)) {
            const currentPiece = board[row][col];

            if (currentPiece) {
                return false;
            }

            row += rowStep;
            col += colStep;
        }

        const targetPiece = board[toRow][toCol];
        return !targetPiece || targetPiece[0] !== (isWhite ? "W" : "B");
    };

    const isValidRookMove = (
        board: Piece[][],
        piece: string,
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number
    ): boolean => {
        if (!piece || (piece[1] !== "R" && piece[1] !== "r")) {
            return false;
        }

        const isWhite = piece[0] === "W";
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        if (!((rowDiff === 0 && colDiff > 0) || (colDiff === 0 && rowDiff > 0))) {
            return false;
        }

        const rowStep = toRow > fromRow ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;

        let row = fromRow + (rowDiff > 0 ? rowStep : 0);
        let col = fromCol + (colDiff > 0 ? colStep : 0);

        while (isWithinBounds(row, col) && (row !== toRow || col !== toCol)) {
            const currentPiece = board[row][col];

            if (currentPiece) {
                return false;
            }

            row += rowDiff > 0 ? rowStep : 0;
            col += colDiff > 0 ? colStep : 0;
        }

        const targetPiece = board[toRow][toCol];
        return !targetPiece || targetPiece[0] !== (isWhite ? "W" : "B");
    };

    const isValidQueenMove = (
        board: Piece[][],
        piece: string,
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number
    ): boolean => {
        if (!piece || (piece[1] !== "Q" && piece[1] !== "q")) {
            return false;
        }

        return (
            isValidBishopMove(board, piece[0]==='W' ? piece = 'WB' : piece = 'BB', fromRow, fromCol, toRow, toCol) ||
            isValidRookMove(board, piece[0]==='W' ? piece = 'WR' : piece = 'BR', fromRow, fromCol, toRow, toCol)
        );
    };

    const isKingInCheck = (
        board: Piece[][],
        kingRow: number,
        kingColumn: number,
        kingColor: string,
    ): boolean => {

        const oppositeColor = kingColor === 'W' ? 'B' : 'W';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if(piece && piece[0] === oppositeColor){
                    switch (piece) {
                        case 'WP' :
                        case 'BP':
                            if(isValidPawnMove(board, piece, row, col, kingRow, kingColumn)){
                                return true;
                            }
                            break;
                        case 'WN' :
                        case 'BN':
                            if (isValidKnightMove(board, piece, row, col, kingRow, kingColumn)){
                            return true;
                        }
                            break;
                        case 'WB' :
                        case 'BB':
                            if (isValidBishopMove(board, piece, row, col, kingRow, kingColumn)){
                            return true;
                        }
                            break;
                        case 'WR' :
                        case 'BR':
                            if (isValidRookMove(board, piece, row, col, kingRow, kingColumn)){
                            return true;
                        }
                            break;
                        case 'WQ' :
                        case 'BQ':
                            if (isValidQueenMove(board, piece, row, col, kingRow, kingColumn)){
                            return true;
                        }
                            break;
                    }
                }
            }
        }
        return false;
    }

    const isValidKingMove = (
        board: Piece[][],
        piece: string,
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number
    ): boolean => {
        if (!piece || (piece[1] !== "K" && piece[1] !== "k")) {
            return false;
        }

        const isWhite = piece[0] === "W";
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        if (rowDiff > 1 || colDiff > 1) {
            return false;
        }

        const targetPiece = board[toRow][toCol];
        if (targetPiece && targetPiece[0] === (isWhite ? "W" : "B")) {
            return false;
        }

        const temp = board.map(row => [...row]);
        temp[toRow][toCol] = piece;
        temp[fromRow][fromCol] = null;

        if(isKingInCheck(temp, toRow, toCol, piece[0])){
            return false;
        }

        return true;
    };

    const handleDragStart = (row: number, col: number) => {
        const piece = board[row][col];

        if (!piece) {
            return;
        }


        if ((whiteTurn && piece[0] === 'W') || (!whiteTurn && piece[0] === 'B')) {

            const locations: boolean[][] = Array(8)
                .fill(null)
                .map(() => Array(8).fill(false));

            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (isValidMove(board, piece, row, col, r, c)) {
                        locations[r][c] = true;
                    }
                }
            }
            setValidDropLocations(locations);
            setDragging({ row, col });
        }
    };

    const handleDrop = (row: number, col: number) => {
        if (!dragging) return;

        const piece = board[dragging.row][dragging.col];
        if (piece && isValidMove(board,piece,dragging.row,dragging.col,row,col)) {
            const newBoard = [...board];
            newBoard[row][col] = piece;
            newBoard[dragging.row][dragging.col] = null;
            setBoard(newBoard);

            setWhiteTurn(!whiteTurn);
        }
        setDragging(null);
        setValidDropLocations([]);
    };

    const squares = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const isLight = gridColors[row][col];
            const piece = board[row][col];
            const isValidDropLocation =
                dragging && validDropLocations[row][col];

            squares.push(
                <Square
                    key={`${row}-${col}`}
                    isLight={isLight}
                    draggable={piece ? true : false}
                    onDragStart={() => piece ? handleDragStart(row, col) : undefined}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(row, col)}
                >
                    {dragging && isValidDropLocation && <ValidMoveIndicator />}
                    {renderPiece(piece)}
                </Square>
            );
        }
    }

    return (
        <BackgroundContainer>
            <h1 style={{ color: "white" }}>Chess Board</h1>
            <Grid>{squares}</Grid>
        </BackgroundContainer>
    );
};

export default Chess;