import React from 'react';
import styled from 'styled-components';

interface SquareProps {
    isLight: boolean;
    onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: () => void;
    children?: React.ReactNode;
}

const Square: React.FC<SquareProps> = ({isLight, onDragStart,
                                           onDragOver,
                                           onDrop,
                                           children, ...props}) => {
    return (
        <StyledSquare
            {...props}
            isLight={isLight}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {children}
        </StyledSquare>
    );
};

const StyledSquare = styled.div<{ isLight: boolean }>`
  background-color: ${(props) => (props.isLight ? '#ffe9c5' : '#964d37')};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export default Square;
