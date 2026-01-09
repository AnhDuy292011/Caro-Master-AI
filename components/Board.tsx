import React from 'react';
import { BoardState, Position } from '../types';
import Cell from './Cell';

interface BoardProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  lastMove: Position | null;
  winningCells: Position[] | null;
  isBotTurn: boolean;
  isGameOver: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, lastMove, winningCells, isBotTurn, isGameOver }) => {
  
  // Helper to check if a cell is part of the winning line
  const isWinning = (r: number, c: number) => {
    return winningCells?.some(pos => pos.row === r && pos.col === c) ?? false;
  };

  // Helper to check if cell is last move
  const isLast = (r: number, c: number) => {
    return lastMove?.row === r && lastMove?.col === c;
  };

  return (
    <div className="relative inline-block bg-white dark:bg-slate-800 p-1 sm:p-3 md:p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div className="flex flex-col border border-slate-800 dark:border-slate-900 bg-slate-50 dark:bg-slate-800">
        {board.map((row, rIndex) => (
          <div key={rIndex} className="flex">
            {row.map((cell, cIndex) => (
              <Cell
                key={`${rIndex}-${cIndex}`}
                row={rIndex}
                col={cIndex}
                value={cell}
                onClick={onCellClick}
                isLastMove={isLast(rIndex, cIndex)}
                isWinningCell={isWinning(rIndex, cIndex)}
                disabled={isGameOver || isBotTurn}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;