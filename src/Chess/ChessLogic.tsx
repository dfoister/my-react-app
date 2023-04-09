import {Piece} from "./Chess";

const isWithinBounds = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
};

export const isValidPawnMove = (
    board: Piece[][],
    piece: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    enPassantTarget: { row: number; col: number } | null,
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

export const isValidKnightMove = (
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

export const isValidBishopMove = (
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

export const isValidRookMove = (
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

export const isValidQueenMove = (
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

export const isKingInCheck = (
    board: Piece[][],
    kingRow: number,
    kingColumn: number,
    kingColor: string,
    enPassantTarget: {row: number, col: number} | null,
): boolean => {

    const oppositeColor = kingColor === 'W' ? 'B' : 'W';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if(piece && piece[0] === oppositeColor){
                switch (piece) {
                    case 'WP' :
                    case 'BP':
                        if(isValidPawnMove(board, piece, row, col, kingRow, kingColumn, enPassantTarget)){
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

export const isValidKingMove = (
    board: Piece[][],
    piece: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    enPassantTarget: {row: number, col: number} | null,
    hasMoved: {
        WK: boolean,
        BK: boolean,
        WRookA: boolean,
        WRookH: boolean,
        BRookA: boolean,
        BRookH: boolean,
    }
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
        if (isKingInCheck(temp, toRow, toCol, piece[0], enPassantTarget)) {
            return { valid: false };
        }

        const opposingKing = piece[0] === "W" ? "BK" : "WK";

        for (let row = toRow - 1; row <= toRow + 1; row++) {
            for (let col = toCol - 1; col <= toCol + 1; col++) {
                if (
                    row >= 0 &&
                    row < 8 &&
                    col >= 0 &&
                    col < 8 &&
                    temp[row][col] === opposingKing
                ) {
                    return { valid: false };
                }
            }
        }


        return { valid: true };
    } else if (rowDiff === 0 && colDiff === 2) {
        if (isKingInCheck(temp, toRow, toCol, piece[0], enPassantTarget)) {
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

            if (isKingInCheck(board, fromRow, col, piece[0], enPassantTarget)) {
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

export const wouldOwnKingBeInCheck = (
    board: Piece[][],
    piece: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    enPassantTarget: {row: number, col: number} | null
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

    return isKingInCheck(tempBoard, kingRow, kingCol, piece[0], enPassantTarget);
};

export const hasLegalMove = (
    board: Piece[][],
    kingColor: string,
    kingRow: number,
    kingCol: number,
    enPassantTarget: {row: number, col: number} | null,
    hasMoved: {
        WK: boolean,
        BK: boolean,
        WRookA: boolean,
        WRookH: boolean,
        BRookA: boolean,
        BRookH: boolean,
    }): boolean => {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece[0] === kingColor) {
                for (let newRow = 0; newRow < 8; newRow++) {
                    for (let newCol = 0; newCol < 8; newCol++) {
                        if (isValidMove(board, piece, row, col, newRow, newCol, enPassantTarget, hasMoved).valid) {
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

                            if (!isKingInCheck(tempBoard, updatedKingRow, updatedKingCol, kingColor, enPassantTarget)) {
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

export const isCheckmate = (
    board: Piece[][],
    kingColor: string,
    kingRow: number,
    kingCol: number,
    enPassantTarget: {row: number, col: number} | null,
    hasMoved: {
        WK: boolean,
        BK: boolean,
        WRookA: boolean,
        WRookH: boolean,
        BRookA: boolean,
        BRookH: boolean,
    }
): boolean => {


    if (!isKingInCheck(board, kingRow, kingCol, kingColor, enPassantTarget)) {
        return false;
    }

    return !hasLegalMove(board, kingColor, kingRow, kingCol, enPassantTarget, hasMoved);
};

export const isStalemate = (
    board: Piece[][],
    kingColor: string,
    kingRow: number,
    kingCol: number,
    enPassantTarget: {row: number, col: number} | null,
    hasMoved: {
        WK: boolean,
        BK: boolean,
        WRookA: boolean,
        WRookH: boolean,
        BRookA: boolean,
        BRookH: boolean,
    }
): boolean => {

    if (isKingInCheck(board, kingRow, kingCol, kingColor, enPassantTarget)) {
        return false;
    }

    return !hasLegalMove(board, kingColor, kingRow, kingCol, enPassantTarget, hasMoved);
};

export const isValidMove = (
    board: Piece[][],
    piece: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    enPassantTarget: { row: number; col: number } | null,
    hasMoved: {
        WK: boolean,
        BK: boolean,
        WRookA: boolean,
        WRookH: boolean,
        BRookA: boolean,
        BRookH: boolean,
    }

): { valid: boolean; rookMove?: { fromRow: number; fromCol: number; toRow: number; toCol: number } } => {
    let result: { valid: boolean; rookMove?: { fromRow: number; fromCol: number; toRow: number; toCol: number } } = { valid: false };

    switch (piece) {
        case 'WP' :
        case 'BP':
            result.valid = isValidPawnMove(board, piece, fromRow, fromCol, toRow, toCol, enPassantTarget);
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
            result = isValidKingMove(board, piece, fromRow, fromCol, toRow, toCol, enPassantTarget, hasMoved);
            break;
    }

    if (!result.valid) {
        return result;
    }

    return {
        valid: !wouldOwnKingBeInCheck(board, piece, fromRow, fromCol, toRow, toCol, enPassantTarget),
        rookMove: result.rookMove,
    };
}