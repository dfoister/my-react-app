import React, { useEffect, useState} from "react";
import styled from "styled-components";
import PieceSelector from "./PieceSelector";
import {renderPiece} from "./Helpers";
import Board from './Board';
import Square from './Square';
import './Chess.css';
import {isCheckmate, isKingInCheck, isStalemate, isValidMove} from "./ChessLogic";

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

export type Piece = string | null;

export const initialBoard: Piece[][] = [
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

const Chess: React.FC = () => {
    const [board, setBoard] = useState(initialBoard);
    const [dragging, setDragging] = useState<{ row: number; col: number } | null>(null);
    const [validDropLocations, setValidDropLocations] = useState<boolean[][]>([]);
    const [whiteTurn, setWhiteTurn] = useState<boolean>(true);
    const [winner, setWinner] = useState<{gameOver: boolean; winner: string} | null>({gameOver: false, winner: ''});
    const [enPassantTarget, setEnPassantTarget] = useState<{ row: number; col: number } | null>(null);
    const [promotedPawn, setPromotedPawn] = useState<{ row: number; col: number; piece: string } | null>(null);
    const [hasMoved, setHasMoved] = useState({
        WK: false,
        BK: false,
        WRookA: false,
        WRookH: false,
        BRookA: false,
        BRookH: false,
    });

    const startMove = (row: number, col: number) => {
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
                    const moveResult = isValidMove(board, piece, row, col, r, c, enPassantTarget, hasMoved);
                    if (moveResult.valid) {
                        locations[r][c] = true;
                    }
                }
            }

            // Check for castling conditions
            if (piece[1] === "K" && !hasMoved[piece === "WK" ? "WK" : "BK"]) {
                const kingSideRookCol = 7;
                const queenSideRookCol = 0;

                // Check king-side rook
                if (!hasMoved[piece === "WK" ? "WRookH" : "BRookH"]) {
                    let isCastlingPathClear = true;
                    for (let c = col + 1; c < kingSideRookCol; c++) {
                        if (board[row][c] !== null || isKingInCheck(board, row, c, piece[0], enPassantTarget)) {
                            isCastlingPathClear = false;
                            break;
                        }
                    }
                    if (isCastlingPathClear) {
                        locations[row][col + 2] = true;
                    }
                }

                // Check queen-side rook
                if (!hasMoved[piece === "WK" ? "WRookA" : "BRookA"]) {
                    let isCastlingPathClear = true;
                    for (let c = col - 1; c > queenSideRookCol; c--) {
                        if (board[row][c] !== null || isKingInCheck(board, row, c, piece[0], enPassantTarget)) {
                            isCastlingPathClear = false;
                            break;
                        }
                    }
                    if (isCastlingPathClear) {
                        locations[row][col - 2] = true;
                    }
                }
            }

            setValidDropLocations(locations);
            setDragging({ row, col });
        }
    };

    const handlePromotionSelection = (selectedPiece: string) => {
        if (promotedPawn) {
            setDragging(null);
            const newBoard = board.map((row) => [...row]);
            newBoard[promotedPawn.row][promotedPawn.col] = `${promotedPawn.piece[0]}${selectedPiece}`;
            setBoard(newBoard);
            setPromotedPawn(null); // Reset the promotedPawn state
        }
    };


    const makeMove = (row: number, col: number) => {
        if (!dragging) return;

        const piece = board[dragging.row][dragging.col];
        const moveResult = isValidMove(board, piece as string, dragging.row, dragging.col, row, col, enPassantTarget, hasMoved);

        if (moveResult.valid) {
            const newBoard = [...board];
            newBoard[row][col] = piece;
            newBoard[dragging.row][dragging.col] = null;

            // Castling handling
            if (moveResult.rookMove) {
                const { fromRow, fromCol, toRow, toCol } = moveResult.rookMove;
                newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
                newBoard[fromRow][fromCol] = null;

            }

            if (
                (piece === "WP" || piece === "BP") &&
                enPassantTarget &&
                row === enPassantTarget.row &&
                col === enPassantTarget.col
            ) {
                newBoard[enPassantTarget.row + (piece === "WP" ? 1 : -1)][enPassantTarget.col] = null;
            }

            setBoard(newBoard);

            if ((piece === "WP" && row === 0) || (piece === "BP" && row === 7)) {
                setPromotedPawn({row, col, piece});
            }


            // Update hasMoved for the rooks and kings. Tracks castling eligibility.
            setHasMoved((prev) => ({
                ...prev,
                WK: prev.WK || (piece === "WK"),
                BK: prev.BK || (piece === "BK"),
                WRookA: prev.WRookA || (piece === "WR" && dragging.col === 0),
                WRookH: prev.WRookH || (piece === "WR" && dragging.col === 7),
                BRookA: prev.BRookA || (piece === "BR" && dragging.col === 0),
                BRookH: prev.BRookH || (piece === "BR" && dragging.col === 7),
            }));

            setWhiteTurn(!whiteTurn);

            if (
                (piece === "WP" || piece === "BP") &&
                Math.abs(dragging.row - row) === 2
            ) {
                setEnPassantTarget({
                    row: (dragging.row + row) / 2,
                    col: col,
                });
            } else {
                setEnPassantTarget(null);
            }
        }

        setDragging(null);
        setValidDropLocations([]);
    };


    useEffect(() => {

        const kingColor = whiteTurn ? 'W' : 'B';
        let kingRow = -1;
        let kingCol = -1;

        // Find the King's position
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === `${kingColor}K`) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
            if (kingRow !== -1) break;
        }

        if (isCheckmate(board, kingColor, kingRow, kingCol, enPassantTarget, hasMoved)) {
            setWinner({ gameOver: true, winner: whiteTurn ? 'Black' : 'White' });
        } else if (isStalemate(board, kingColor, kingRow, kingCol, enPassantTarget, hasMoved)) {
            setWinner({ gameOver: true, winner: 'stalemate' });
        }
        // eslint-disable-next-line
    }, [whiteTurn, setWinner]);

    useEffect(() => {
        if (winner?.gameOver) {
            switch (winner.winner) {
                case 'White':
                    alert('White wins');
                    return;
                case 'Black':
                    alert('Black wins');
                    return;
                case 'stalemate':
                    alert('Stalemate');
                    return;
            }
        }
    }, [winner]);


    const squares = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const isLight = gridColors[row][col];
            const piece = board[row][col];
            const isValidDropLocation =
                dragging && validDropLocations[row][col];

            squares.push(
                <Square data-testid={`square-${row}-${col}`}
                    key={`${row}-${col}`}
                    isLight={isLight}
                    onDragStart={() => (piece && !promotedPawn) ? startMove(row, col) : undefined}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => makeMove(row, col)}
                >
                    {dragging && isValidDropLocation && <ValidMoveIndicator />}
                    {renderPiece(piece, row, col)}
                </Square>
            );
        }
    }

    return (
        <BackgroundContainer>
            <h1 style={{ color: "white" }}>Chess Board</h1>
            <Board data-testid='chess-board'>{squares}</Board>
            {promotedPawn && (
                <PieceSelector onSelectPiece={handlePromotionSelection}/>
            )}
        </BackgroundContainer>
    );
};

export default Chess;