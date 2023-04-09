import React from 'react';
import styled from "styled-components";

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 35vw;
  height: 35vw;
  margin: 0 auto;
`;

interface BoardProps {
    children?: React.ReactNode;
}

const Board: React.FC<BoardProps> = ({children}) => {
    return (
        <StyledBoard
            data-testid='chess-board'>
                {children}
        </StyledBoard>);
};

export default Board;



