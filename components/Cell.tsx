import React from 'react';
import { CellValue, Player } from '../types';
import { X, Circle } from 'lucide-react';
import { clsx } from 'clsx';

interface CellProps {
  row: number;
  col: number;
  value: CellValue;
  onClick: (row: number, col: number) => void;
  isLastMove: boolean;
  isWinningCell: boolean;
  disabled: boolean;
}

const Cell: React.FC<CellProps> = ({ row, col, value, onClick, isLastMove, isWinningCell, disabled }) => {
  return (
    <button
      onClick={() => onClick(row, col)}
      disabled={disabled || value !== null}
      className={clsx(
        // Dimensions: optimized for mobile (w-6 = 24px) up to desktop (w-10 = 40px)
        // This ensures the 15x15 board fits on iPhone screens (~360px width needed)
        "w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10",
        
        "border flex items-center justify-center transition-all duration-200 relative",
        // Light mode borders
        "border-slate-300 hover:bg-slate-100",
        // Dark mode styles
        "dark:border-slate-600 dark:hover:bg-slate-700",
        
        "focus:outline-none touch-manipulation",
        
        // Background logic
        isWinningCell && "bg-green-100 dark:bg-green-900/40",
        !isWinningCell && isLastMove && "bg-slate-200 dark:bg-slate-600",
        
        value === null && !disabled && "cursor-pointer",
        (value !== null || disabled) && "cursor-default"
      )}
      aria-label={`Cell ${row},${col}`}
    >
      {isLastMove && !isWinningCell && (
         <span className="absolute inset-0 border-2 border-slate-400 opacity-50 pointer-events-none animate-pulse"></span>
      )}
      
      {/* Player X is RED */}
      {value === Player.X && (
        <X className={clsx("w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6", isWinningCell ? "text-green-600 dark:text-green-400" : "text-red-500")} strokeWidth={2.5} />
      )}
      
      {/* Player O is BLUE */}
      {value === Player.O && (
        <Circle className={clsx("w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5", isWinningCell ? "text-green-600 dark:text-green-400" : "text-blue-500")} strokeWidth={3} />
      )}
    </button>
  );
};

export default React.memo(Cell);