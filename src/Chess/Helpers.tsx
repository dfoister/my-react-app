import React from "react";
import {Piece} from './Chess'

export const renderPiece = (piece: Piece | null, row: number, col: number) => {

    if (!piece) return null;

    const publicUrl = process.env.PUBLIC_URL;
    let imageSrc = '';

    switch (piece) {
        case 'WP':
            imageSrc = `${publicUrl}/chess/WP.png`;
            break;
        case 'BP':
            imageSrc =  `${publicUrl}/chess/BP.png`;
            break;
        case 'WN':
            imageSrc =  `${publicUrl}/chess/WN.png`;
            break;
        case 'BN':
            imageSrc =  `${publicUrl}/chess/BN.png`;
            break;
        case 'WB':
            imageSrc =  `${publicUrl}/chess/WB.png`;
            break;
        case 'BB':
            imageSrc =  `${publicUrl}/chess/BB.png`;
            break;
        case 'WR':
            imageSrc =  `${publicUrl}/chess/WR.png`;
            break;
        case 'BR':
            imageSrc =  `${publicUrl}/chess/BR.png`;
            break;
        case 'WQ':
            imageSrc =  `${publicUrl}/chess/WQ.png`;
            break;
        case 'BQ':
            imageSrc =  `${publicUrl}/chess/BQ.png`;
            break;
        case 'WK':
            imageSrc =  `${publicUrl}/chess/WK.png`;
            break;
        case 'BK':
            imageSrc =  `${publicUrl}/chess/BK.png`;
            break;
        default:
            return null;
    }

    if (!imageSrc) return null;
    return (
        <img src={imageSrc} width={"100%"} height={"100%"} alt={`${piece}-${row}-${col}` || 'invalid'}/>
);
};