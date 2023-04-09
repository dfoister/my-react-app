import {
    hasLegalMove,
    isCheckmate,
    isStalemate,
    isValidBishopMove,
    isValidKingMove,
    isValidKnightMove,
    isValidPawnMove,
    isValidQueenMove,
    isValidRookMove, wouldOwnKingBeInCheck
} from './ChessLogic';
import {initialBoard, Piece} from "./Chess";



describe('ChessLogic', () => {

    let emptyBoard: Piece[][];

    beforeEach(() => {
        emptyBoard = Array(8)
            .fill(null)
            .map(() => Array(8).fill(null));
    });

    const defaultHasMoved = {
        WK: false,
        BK: false,
        WRookA: false,
        WRookH: false,
        BRookA: false,
        BRookH: false,
    };

    const allMoved = {
        WK: true,
        BK: true,
        WRookA: true,
        WRookH: true,
        BRookA: true,
        BRookH: true,
    };


    describe('isValidPawnMove', () => {

        test('Invalid move when not a pawn', () => {
            const result = isValidPawnMove(emptyBoard, 'WK', 7, 4, 6, 4, null);
            expect(result).toBe(false);
        });

        test('Valid single move for white pawn', () => {
            const result = isValidPawnMove(emptyBoard, 'WP', 6, 0, 5, 0, null);
            expect(result).toBe(true);
        });

        test('Valid single move for black pawn', () => {
            const result = isValidPawnMove(emptyBoard, 'BP', 1, 0, 2, 0, null);
            expect(result).toBe(true);
        });

        test('Valid double move for white pawn', () => {
            const result = isValidPawnMove(emptyBoard, 'WP', 6, 0, 4, 0, null);
            expect(result).toBe(true);
        });

        test('Valid double move for black pawn', () => {
            const result = isValidPawnMove(emptyBoard, 'BP', 1, 0, 3, 0, null);
            expect(result).toBe(true);
        });

        test('Valid capture for white pawn', () => {
            const boardWithBlackPiece: Piece[][] = JSON.parse(JSON.stringify(emptyBoard));
            boardWithBlackPiece[4][1] = 'BN';
            const result = isValidPawnMove(boardWithBlackPiece, 'WP', 5, 0, 4, 1, null);
            expect(result).toBe(true);
        });

        test('Valid capture for black pawn', () => {
            const boardWithWhitePiece: Piece[][] = JSON.parse(JSON.stringify(emptyBoard));
            boardWithWhitePiece[3][1] = 'WN';
            const result = isValidPawnMove(boardWithWhitePiece, 'BP', 2, 0, 3, 1, null);
            expect(result).toBe(true);
        });

        test('Valid en passant capture for white pawn', () => {
            const result = isValidPawnMove(emptyBoard, 'WP', 3, 0, 2, 1, { row: 2, col: 1 });
            expect(result).toBe(true);
        });

        test('Valid en passant capture for black pawn', () => {
            const result = isValidPawnMove(emptyBoard, 'BP', 4, 0, 5, 1, { row: 5, col: 1 });
            expect(result).toBe(true);
        });

        test('Invalid move for white pawn', () => {
            const result = isValidPawnMove(emptyBoard, 'WP', 6, 0, 7, 0, null);
            expect(result).toBe(false);
        });

        test('Invalid move for black pawn', () => {
            const result = isValidPawnMove(emptyBoard, 'BP', 1, 0, 0, 0, null);
            expect(result).toBe(false);
        });
    });

    describe('isValidKnightMove', () => {

        test('Invalid move when not a knight', () => {
            const result = isValidKnightMove(emptyBoard, 'WQ', 7, 1, 5, 0);
            expect(result).toBe(false);
        });

        test('Valid knight move', () => {
            const result = isValidKnightMove(emptyBoard, 'WN', 7, 1, 5, 0);
            expect(result).toBe(true);
        });

        test('Invalid knight move', () => {
            const result = isValidKnightMove(emptyBoard, 'WN', 7, 1, 6, 0);
            expect(result).toBe(false);
        });

        test('Valid knight capture', () => {
            const boardWithTarget = emptyBoard.map(row => [...row]);
            boardWithTarget[5][0] = 'BP';
            const result = isValidKnightMove(boardWithTarget, 'WN', 7, 1, 5, 0);
            expect(result).toBe(true);
        });

        test('Blocked by same color piece', () => {
            const boardWithBlock = emptyBoard.map(row => [...row]);
            boardWithBlock[5][0] = 'WP';
            const result = isValidKnightMove(boardWithBlock, 'WN', 7, 1, 5, 0);
            expect(result).toBe(false);
        });
    });


    describe('isValidBishopMove', () => {

        test('Invalid move when not a bishop', () => {
            const result = isValidBishopMove(emptyBoard, 'WK', 7, 2, 5, 0);
            expect(result).toBe(false);
        });

        test('Valid bishop move', () => {
            const result = isValidBishopMove(emptyBoard, 'WB', 7, 2, 5, 0);
            expect(result).toBe(true);
        });

        test('Invalid bishop move', () => {
            const result = isValidBishopMove(emptyBoard, 'WB', 7, 2, 7, 1);
            expect(result).toBe(false);
        });

        test('Valid bishop capture', () => {
            const boardWithPiece: Piece[][] = JSON.parse(JSON.stringify(emptyBoard));
            boardWithPiece[6][1] = 'BP';
            const result = isValidBishopMove(boardWithPiece, 'WB', 7, 2, 6, 1);
            expect(result).toBe(true);
        });

        test('Invalid bishop move, blocked by friendly piece', () => {
            const boardWithPiece: Piece[][] = JSON.parse(JSON.stringify(emptyBoard));
            boardWithPiece[6][1] = 'WP';
            const result = isValidBishopMove(boardWithPiece, 'WB', 7, 2, 5, 0);
            expect(result).toBe(false);
        });
    });

    describe('isValidRookMove', () => {

        test('Invalid move when not a rook', () => {
            const result = isValidRookMove(emptyBoard, 'WK', 7, 0, 7, 4);
            expect(result).toBe(false);
        });

        test('Valid rook move horizontally', () => {
            const result = isValidRookMove(emptyBoard, 'WR', 7, 0, 7, 4);
            expect(result).toBe(true);
        });

        test('Valid rook move vertically', () => {
            const result = isValidRookMove(emptyBoard, 'WR', 7, 0, 3, 0);
            expect(result).toBe(true);
        });

        test('Invalid rook move', () => {
            const result = isValidRookMove(emptyBoard, 'WR', 7, 0, 5, 2);
            expect(result).toBe(false);
        });

        test('Valid rook capture', () => {
            const boardWithPiece: Piece[][] = JSON.parse(JSON.stringify(emptyBoard));
            boardWithPiece[7][7] = 'BP';
            const result = isValidRookMove(boardWithPiece, 'WR', 7, 2, 7, 7);
            expect(result).toBe(true);
        });

        test('Rook blocked by a piece', () => {
            const boardWithPiece: Piece[][] = JSON.parse(JSON.stringify(emptyBoard));
            boardWithPiece[7][2] = 'WP';
            const result = isValidRookMove(boardWithPiece, 'WR', 7, 0, 7, 4);
            expect(result).toBe(false);
        });
    });


    describe('isValidQueenMove', () => {

        test('Invalid move when not a queen', () => {
            const result = isValidQueenMove(emptyBoard, 'WK', 7, 3, 5, 1);
            expect(result).toBe(false);
        });

        test('Valid queen move horizontally', () => {
            const result = isValidQueenMove(emptyBoard, 'WQ', 7, 3, 7, 6);
            expect(result).toBe(true);
        });

        test('Valid queen move vertically', () => {
            const result = isValidQueenMove(emptyBoard, 'WQ', 7, 3, 4, 3);
            expect(result).toBe(true);
        });

        test('Valid queen move diagonally', () => {
            const result = isValidQueenMove(emptyBoard, 'WQ', 7, 3, 5, 1);
            expect(result).toBe(true);
        });

        test('Invalid queen move', () => {
            const result = isValidQueenMove(emptyBoard, 'WQ', 7, 3, 5, 2);
            expect(result).toBe(false);
        });

        test('Invalid queen move, blocked by friendly piece', () => {
            emptyBoard[0][5] = 'WB';
            const result = isValidQueenMove(emptyBoard, 'WQ', 7, 5, 0, 5);
            expect(result).toBe(false);
        });

        test('Valid queen capture', () => {
            emptyBoard[0][5] = 'BB';
            const result = isValidQueenMove(emptyBoard, 'WQ', 7, 5, 0, 5);
            expect(result).toBe(true);
        });

    });

    describe('isValidKingMove', () => {


        test('Invalid move when not a king', () => {
            const result = isValidKingMove(emptyBoard, 'WQ', 7, 4, 7, 5, null, defaultHasMoved);
            expect(result.valid).toBe(false);
        });

        test('Valid king move', () => {
            const result = isValidKingMove(emptyBoard, 'WK', 7, 4, 7, 5, null, defaultHasMoved);
            expect(result.valid).toBe(true);
        });

        test('Invalid castle move. King moved', () => {
            const result = isValidKingMove(emptyBoard, 'WK', 7, 4, 7, 6, null, {
                WK: true,
                BK: false,
                WRookA: false,
                WRookH: false,
                BRookA: false,
                BRookH: false,
            });
            expect(result.valid).toBe(false);
        });

        test('Invalid castle move. Rook moved', () => {
            const result = isValidKingMove(emptyBoard, 'WK', 7, 4, 7, 6, null, {
                WK: false,
                BK: false,
                WRookA: false,
                WRookH: true,
                BRookA: false,
                BRookH: false,
            });
            expect(result.valid).toBe(false);
        });

        test('Valid castle move', () => {
            const result = isValidKingMove(emptyBoard, 'WK', 7, 4, 7, 6, null, defaultHasMoved);
            expect(result.valid).toBe(true);
        });

        test('Invalid king move into another king', () => {
            emptyBoard[5][5] = 'BK';
            const result = isValidKingMove(emptyBoard, 'WK', 3, 5, 4, 5, null, defaultHasMoved);
            expect(result.valid).toBe(false);
        });

        test('Invalid king move into check', () => {
            emptyBoard[6][5] = 'BB';
            const result = isValidKingMove(emptyBoard, 'WK', 5, 5, 5, 4, null, defaultHasMoved);
            expect(result.valid).toBe(false);
        });

        test('Valid king capture', () => {
            emptyBoard[6][5] = 'BB';
            const result = isValidKingMove(emptyBoard, 'WK', 5, 5, 6, 5, null, defaultHasMoved);
            expect(result.valid).toBe(true);
        });

    });

    describe('isCheckmate', () => {

        const defaultBoardCheckmate = initialBoard;

        // FEN: rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3
        test('Checkmate scenario', () => {

            defaultBoardCheckmate[6][5] = null;
            defaultBoardCheckmate[6][6] = null;
            defaultBoardCheckmate[5][5] = 'WP';
            defaultBoardCheckmate[4][6] = 'WP';
            defaultBoardCheckmate[1][4] = null;
            defaultBoardCheckmate[3][4] = 'BP';
            defaultBoardCheckmate[4][7] = 'BQ';
            const result = isCheckmate(defaultBoardCheckmate, 'W', 7, 4, null, defaultHasMoved);
            expect(result).toBe(true);
        });

        // FEN: rnb1kbnr/pppp1ppp/8/8/4p1Pq/3P1P2/PPP1P2P/RNBQKBNR w KQkq - 1 4
        test('Not checkmate scenario', () => {
            defaultBoardCheckmate[6][3] = null;
            defaultBoardCheckmate[5][3] = 'WP';
            defaultBoardCheckmate[3][4] = null;
            defaultBoardCheckmate[4][4] = 'BP';
            const result = isCheckmate(emptyBoard, 'W', 7, 4, null, defaultHasMoved);
            expect(result).toBe(false);
        });
    });

    describe('isStalemate', () => {

        test('Stalemate scenario', () => {
            emptyBoard[0][0] = 'WK';
            emptyBoard[7][7] = 'BK';
            emptyBoard[6][5] = 'WQ';
            const result = isStalemate(emptyBoard, 'B', 7, 7, null, allMoved);
            expect(result).toBe(true);
        });

        test('Not stalemate scenario', () => {
            emptyBoard[0][0] = 'WK';
            emptyBoard[7][7] = 'BK';
            emptyBoard[6][5] = 'WQ';
            emptyBoard[7][1] = 'BR';
            const result = isStalemate(emptyBoard, 'B', 7, 7, null, allMoved);
            expect(result).toBe(false);
        });
    });

    describe('wouldOwnKingBeInCheck', () => {

        test('Moving piece would put King in check', () => {
            emptyBoard[3][3] = 'WK'
            emptyBoard[4][3] = 'WR'
            emptyBoard[7][3] = 'BQ'
            const result = wouldOwnKingBeInCheck(emptyBoard, 'WR', 4, 3, 4, 2, null);
            expect(result).toBe(true);
        });

        test('Moving piece would not put King in check', () => {
            emptyBoard[3][3] = 'WK'
            emptyBoard[4][3] = 'WR'
            emptyBoard[7][3] = 'BQ'
            const result = wouldOwnKingBeInCheck(emptyBoard, 'WR', 4, 3, 5, 3, null);
            expect(result).toBe(false);
        });
    });

    describe('hasLegalMove', () => {

        const empty: Piece[][] = Array(8)
            .fill(null)
            .map(() => Array(8).fill(null));

        empty[0][0] = 'WK';
        empty[7][7] = 'BK';
        empty[1][0] = 'BP';
        empty[2][0] = 'BR';
        empty[4][1] = 'BQ';
        empty[6][6] = 'WP';

        test('Has legal move', () => {
            const result = hasLegalMove(empty, 'W', 0, 0, null, allMoved);
            expect(result).toBe(true);
        });

        test('No legal move', () => {
            empty[6][6] = null;
            const result = hasLegalMove(empty, 'W', 0, 0, null, allMoved);
            expect(result).toBe(false);
        });
    });

});