import React from "react";

export default function PieceSelector(props: { onSelectPiece: (piece: string) => void; }) {

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
            <button onClick={queenClick}>Queen</button>
            <button onClick={rookClick}>Rook</button>
            <button onClick={bishopClick}>Bishop</button>
            <button onClick={knightClick}>Knight</button>
        </div>
    );
}