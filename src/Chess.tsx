import React, { useEffect, useState} from "react";
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

function PieceSelector(props: { onSelectPiece: (piece: string) => void; }) {

    function queenClick(){
        props.onSelectPiece('Q');
    }
    function rookClick(){
        props.onSelectPiece('R');
    }
    function bishopClick(){
        props.onSelectPiece('B');
    }

    function knightClick(){
        props.onSelectPiece('N');
    }



    return (
        <div>
        <button onClick={queenClick}>
            Queen
        </button>
    <button onClick={rookClick}>
        Rook
    </button>
    <button onClick={bishopClick}>
        Bishop
    </button>
    <button onClick={knightClick}>
        Knight
    </button>
        </div>

    );
}


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

        const direction = piece === "WP" ? -1 : 1;
        const startRow = piece === "WP" ? 6 : 1;

        // Regular move
        if (
            fromCol === toCol &&
            board[toRow][toCol] === null &&
            fromRow + direction === toRow
        ) {
            return true;
        }

        // Double move
        if (
            fromCol === toCol &&
            board[toRow][toCol] === null &&
            fromRow + direction * 2 === toRow &&
            fromRow === startRow &&
            board[fromRow + direction][fromCol] === null
        ) {
            return true;
        }

        // Capture
        if (
            Math.abs(fromCol - toCol) === 1 &&
            fromRow + direction === toRow &&
            board[toRow][toCol] !== null &&
            board[toRow][toCol]?.charAt(0) !== piece[0]
        ) {
            return true;
        }

        // En passant capture
        return !!(enPassantTarget &&
            Math.abs(fromCol - toCol) === 1 &&
            fromRow + direction === toRow &&
            toRow === enPassantTarget.row &&
            toCol === enPassantTarget.col);

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

    ): { valid: boolean; rookMove?: { fromRow: number; fromCol: number; toRow: number; toCol: number } } => {
        let result: { valid: boolean; rookMove?: { fromRow: number; fromCol: number; toRow: number; toCol: number } } = { valid: false };

        switch (piece) {
            case 'WP' :
            case 'BP':
                result.valid = isValidPawnMove(board, piece, fromRow, fromCol, toRow, toCol);
                break;
            case 'WN' :
            case 'BN':
                result.valid = isValidKnightMove(board, piece, fromRow, fromCol, toRow, toCol);
                break;
            case 'WB' :
            case 'BB':
                result.valid = isValidBishopMove(board, piece, fromRow, fromCol, toRow, toCol);
                break;
            case 'WR' :
            case 'BR':
                result.valid = isValidRookMove(board, piece, fromRow, fromCol, toRow, toCol);
                break;
            case 'WQ' :
            case 'BQ':
                result.valid = isValidQueenMove(board, piece, fromRow, fromCol, toRow, toCol);
                break;
            case 'WK' :
            case 'BK':
                result = isValidKingMove(board, piece, fromRow, fromCol, toRow, toCol);
                break;
        }

        if (!result.valid) {
            return result;
        }

        return {
            valid: !wouldOwnKingBeInCheck(board, piece, fromRow, fromCol, toRow, toCol),
            rookMove: result.rookMove,
        };
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
    ): {valid: boolean; rookMove?: { fromRow: number; fromCol: number; toRow: number; toCol: number } } => {
        if (!piece || (piece[1] !== "K" && piece[1] !== "k")) {
            return { valid: false };
        }

        const isWhite = piece[0] === "W";
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        const targetPiece = board[toRow][toCol];
        if (targetPiece && targetPiece[0] === (isWhite ? "W" : "B")) {
            return {valid:false};
        }

        const temp = board.map(row => [...row]);
        temp[toRow][toCol] = piece;
        temp[fromRow][fromCol] = null;

        if (rowDiff <= 1 && colDiff <= 1) {
            if (isKingInCheck(temp, toRow, toCol, piece[0])) {
                return { valid: false };
            }
            return { valid: true };
        } else if (rowDiff === 0 && colDiff === 2) {
            if (isKingInCheck(temp, toRow, toCol, piece[0])) {
                return {valid:false};
            }

            const kingSide = toCol === 6;
            const rookCol = kingSide ? 7 : 0;

            if (hasMoved[isWhite ? "WK" : "BK"]) {
                return {valid:false};
            }

            if (hasMoved[isWhite ? (kingSide ? "WRookH" : "WRookA") : (kingSide ? "BRookH" : "BRookA")]) {
                return {valid:false};
            }

            for (let col = Math.min(fromCol, rookCol) + 1; col < Math.max(fromCol, rookCol); col++) {
                if (board[fromRow][col] !== null) {
                    return {valid:false};
                }

                if (isKingInCheck(board, fromRow, col, piece[0])) {
                    return {valid:false};
                }
            }

            const rookMove = {
                fromRow: fromRow,
                fromCol: rookCol,
                toRow: fromRow,
                toCol: kingSide ? 5 : 3,
            };

            return {
                valid: true,
                rookMove,
            };
        }

        return {valid:false};
    };

    const wouldOwnKingBeInCheck = (
        board: Piece[][],
        piece: string,
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number
    ): boolean => {
        const tempBoard = board.map(row => [...row]);
        tempBoard[toRow][toCol] = piece;
        tempBoard[fromRow][fromCol] = null;

        let kingRow = -1;
        let kingCol = -1;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const currentPiece = tempBoard[row][col];
                if (currentPiece && currentPiece[0] === piece[0] && (currentPiece[1] === "K" || currentPiece[1] === "k")) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
        }

        return isKingInCheck(tempBoard, kingRow, kingCol, piece[0]);
    };

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
                    const moveResult = isValidMove(board, piece, row, col, r, c);
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
                        if (board[row][c] !== null || isKingInCheck(board, row, c, piece[0])) {
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
                        if (board[row][c] !== null || isKingInCheck(board, row, c, piece[0])) {
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
        const moveResult = isValidMove(board, piece as string, dragging.row, dragging.col, row, col);

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


    const isCheckmate = (
        kingColor: string,
        kingRow: number,
        kingCol: number
    ): boolean => {


        if (!isKingInCheck(board, kingRow, kingCol, kingColor)) {
            return false;
        }

        return !hasLegalMove(kingColor, kingRow, kingCol);
    };

    const isStalemate = (
        kingColor: string,
        kingRow: number,
        kingCol: number
    ): boolean => {

        if (isKingInCheck(board, kingRow, kingCol, kingColor)) {
            return false;
        }

        return !hasLegalMove(kingColor, kingRow, kingCol);
    };

    const hasLegalMove = (kingColor: string, kingRow: number, kingCol: number): boolean => {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece[0] === kingColor) {
                    for (let newRow = 0; newRow < 8; newRow++) {
                        for (let newCol = 0; newCol < 8; newCol++) {
                            if (isValidMove(board, piece, row, col, newRow, newCol).valid) {
                                const tempBoard = board.map(row => [...row]);
                                tempBoard[newRow][newCol] = piece;
                                tempBoard[row][col] = null;

                                // Update the king's position if the moving piece is the king
                                let updatedKingRow = kingRow;
                                let updatedKingCol = kingCol;
                                if (piece === `${kingColor}K`) {
                                    updatedKingRow = newRow;
                                    updatedKingCol = newCol;
                                }

                                if (!isKingInCheck(tempBoard, updatedKingRow, updatedKingCol, kingColor)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }

        return false;
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

        if (isCheckmate(kingColor, kingRow, kingCol)) {
            setWinner({ gameOver: true, winner: whiteTurn ? 'Black' : 'White' });
        } else if (isStalemate(kingColor, kingRow, kingCol)) {
            setWinner({ gameOver: true, winner: 'stalemate' });
        }
    }, [whiteTurn, setWinner]);

    useEffect(() => {
        if (winner?.gameOver) {
            switch (winner.winner) {
                case 'White':
                    return;
                case 'Black':
                    return;
                case 'stalemate':
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
                <Square
                    key={`${row}-${col}`}
                    isLight={isLight}
                    onDragStart={() => (piece && !promotedPawn)? startMove(row, col) : undefined}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => makeMove(row, col)}
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
            {promotedPawn && (
                <PieceSelector onSelectPiece={handlePromotionSelection}/>
            )}
        </BackgroundContainer>
    );
};

export default Chess;