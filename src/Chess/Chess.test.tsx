import React from "react";
import {render, fireEvent, screen, within} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {initialBoard} from "./Chess";
import Chess from "./Chess";

describe("Chess component", () => {
    test("renders without crashing", () => {
        render(<Chess />);
    });

    test("renders the board correctly", () => {
        render(<Chess />);
        const board = screen.getByTestId("chess-board");
        expect(board).toBeInTheDocument();

        const squares = screen.getAllByTestId("chess-square");
        expect(squares.length).toBe(64);

        // Check for the initial position of all pieces
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = initialBoard[row][col];
                if (piece) {
                    const square = squares.find((square) =>
                        square.getAttribute("data-testid") === `square-${row}-${col}`
                    );
                }
            }
        }
    });

    test("Pieces in correct position", () => {
        const pieceOrder = ["R", "N", "B", "Q", "K", "B", "N", "R"];

        for (let col = 0; col < 8; col++) {
            expect(initialBoard[0][col]).toBe(`B${pieceOrder[col]}`);
            expect(initialBoard[1][col]).toBe(`BP`);
            expect(initialBoard[6][col]).toBe(`WP`);
            expect(initialBoard[7][col]).toBe(`W${pieceOrder[col]}`);
        }

        for (let row = 2; row <= 5; row++) {
            for (let col = 0; col < 8; col++) {
                expect(initialBoard[row][col]).toBe(null);
            }
        }
    });

    test("basic piece movement", () => {
        render(<Chess />);

        // Move pawn from e2 to e4
        const e2Pawn = screen.getByAltText("WP-6-4");
        const e2Square = screen.getByTestId("square-6-4");
        const e4Square = screen.getByTestId("square-4-4");

        fireEvent.dragStart(e2Pawn);
        fireEvent.dragOver(e4Square);
        fireEvent.drop(e4Square);

        // Check if pawn moved
        const e2Piece = within(e2Square).queryByRole("img");
        const e4Piece = within(e4Square).getByRole("img");
        expect(e2Piece).not.toBeInTheDocument();
        expect(e4Piece).toBeInTheDocument();
    });

    test("valid en-passant capture", () => {

        render(<Chess/>);

        const e2Pawn = screen.getByAltText("WP-6-4");
        const e2Square = screen.getByTestId("square-6-4");
        const e4Square = screen.getByTestId("square-4-4");

        fireEvent.dragStart(e2Pawn);
        fireEvent.dragOver(e4Square);
        fireEvent.drop(e4Square);

        const e2Piece = within(e2Square).queryByRole("img");
        const e4Piece = within(e4Square).getByRole("img");
        expect(e2Piece).not.toBeInTheDocument();
        expect(e4Piece).toBeInTheDocument();


        const h8Pawn = screen.getByAltText("BP-1-7");
        const h8Square = screen.getByTestId("square-1-7");
        const h6Square = screen.getByTestId("square-2-7");

        fireEvent.dragStart(h8Pawn);
        fireEvent.dragOver(h6Square);
        fireEvent.drop(h6Square);

        const h8Piece = within(h8Square).queryByRole("img");
        const h6Piece = within(h6Square).getByRole("img");
        expect(h8Piece).not.toBeInTheDocument();
        expect(h6Piece).toBeInTheDocument();

        const e4Pawn = screen.getByAltText("WP-4-4");
        const e5Square = screen.getByTestId("square-3-4");

        fireEvent.dragStart(e4Pawn);
        fireEvent.dragOver(e5Square);
        fireEvent.drop(e5Square);

        const e5Piece = within(e5Square).getByRole("img");
        expect(e4Piece).not.toBeInTheDocument();
        expect(e5Piece).toBeInTheDocument();

        const d7Pawn = screen.getByAltText("BP-1-3");
        const d7Square = screen.getByTestId("square-1-3");
        const d5Square = screen.getByTestId("square-3-3");

        fireEvent.dragStart(d7Pawn);
        fireEvent.dragOver(d5Square);
        fireEvent.drop(d5Square);

        const d7Piece = within(d7Square).queryByRole("img");
        const d5Piece = within(d5Square).getByRole("img");
        expect(d7Piece).not.toBeInTheDocument();
        expect(d5Piece).toBeInTheDocument();

        const e5Pawn = screen.getByAltText("WP-3-4");
        const d6Square = screen.getByTestId("square-2-3");

        fireEvent.dragStart(e5Pawn);
        fireEvent.dragOver(d6Square);
        fireEvent.drop(d6Square);

        const d6Piece = within(d6Square).getByRole("img");
        expect(e5Piece).not.toBeInTheDocument();
        expect(d5Piece).not.toBeInTheDocument();
        expect(d6Piece).toBeInTheDocument();

    });


});

