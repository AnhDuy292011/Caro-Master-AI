import React, { useState, useEffect, useCallback } from 'react';
import { BoardState, Player, Position, GameStats } from './types';
import { BOARD_SIZE, HUMAN_PLAYER, BOT_PLAYER, DELAY_BOT_MOVE_MS } from './constants';
import { checkWin, getBestMove } from './utils/gameLogic';
import Board from './components/Board';
import GameControls from './components/GameControls';
import WinnerModal from './components/WinnerModal';
import { LayoutGrid } from 'lucide-react';
import clsx from 'clsx';

const createEmptyBoard = (): BoardState => 
  Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(HUMAN_PLAYER);
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningCells, setWinningCells] = useState<Position[] | null>(null);
  const [lastMove, setLastMove] = useState<Position | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [stats, setStats] = useState<GameStats>({ wins: 0, losses: 0, draws: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Theme
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Handle Game Reset
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(HUMAN_PLAYER);
    setWinner(null);
    setWinningCells(null);
    setLastMove(null);
    setIsBotThinking(false);
  }, []);

  const handleWin = useCallback((player: Player | 'DRAW', cells?: Position[]) => {
    setWinner(player);
    if (cells) setWinningCells(cells);
    
    setStats(prev => {
        if (player === HUMAN_PLAYER) return { ...prev, wins: prev.wins + 1 };
        if (player === BOT_PLAYER) return { ...prev, losses: prev.losses + 1 };
        return { ...prev, draws: prev.draws + 1 };
    });
  }, []);

  // Handle Move Logic
  const handleMove = useCallback((row: number, col: number, player: Player) => {
    setBoard(prev => {
      const newBoard = prev.map(r => [...r]);
      newBoard[row][col] = player;
      return newBoard;
    });
    setLastMove({ row, col });

    // Reconstruct board for immediate check
    setBoard(currentBoard => {
         const tempBoard = currentBoard.map(r => [...r]);
         tempBoard[row][col] = player;
         return currentBoard;
    });

    const tempBoard = board.map(r => [...r]);
    tempBoard[row][col] = player;
    const winPath = checkWin(tempBoard, { row, col }, player);

    if (winPath) {
      handleWin(player, winPath);
    } else {
        const isDraw = tempBoard.every(r => r.every(c => c !== null));
        if (isDraw) {
            handleWin('DRAW');
        } else {
            setCurrentPlayer(player === Player.X ? Player.O : Player.X);
        }
    }
  }, [board, handleWin]);

  const onHumanClick = (row: number, col: number) => {
    if (winner || isBotThinking || board[row][col] !== null || currentPlayer !== HUMAN_PLAYER) return;
    handleMove(row, col, HUMAN_PLAYER);
  };

  // Bot Effect
  useEffect(() => {
    if (currentPlayer === BOT_PLAYER && !winner) {
      setIsBotThinking(true);
      const timer = setTimeout(() => {
        const bestMove = getBestMove(board);
        handleMove(bestMove.row, bestMove.col, BOT_PLAYER);
        setIsBotThinking(false);
      }, DELAY_BOT_MOVE_MS);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner, board, handleMove]);

  return (
    <div className={clsx(isDarkMode && "dark")}>
      <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-4 sm:py-6 md:py-8 px-2 sm:px-4 font-sans transition-colors duration-200">
        
        {/* Header - Compact on mobile */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-blue-600 dark:bg-blue-700 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none mb-2 sm:mb-4">
              <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Caro Master AI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base max-w-md mx-auto px-4">
            Thách đấu trí tuệ nhân tạo trên bàn cờ 15x15.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-center lg:items-start justify-center w-full max-w-6xl">
          
          {/* Game Board Container */}
          <div className="flex-1 w-full flex justify-center order-1 lg:order-1 overflow-x-auto overflow-y-hidden pb-2 lg:pb-0 scrollbar-hide">
              {/* Wrapper ensures scrollability on very small screens if board exceeds width */}
              <div className="min-w-fit px-1">
                  <Board 
                      board={board} 
                      onCellClick={onHumanClick} 
                      lastMove={lastMove}
                      winningCells={winningCells}
                      isBotTurn={isBotThinking}
                      isGameOver={!!winner}
                  />
              </div>
          </div>

          {/* Sidebar - Controls */}
          <div className="w-full max-w-md lg:w-auto order-2 lg:order-2 flex justify-center px-2 sm:px-0">
              <GameControls 
                  currentPlayer={currentPlayer} 
                  stats={stats} 
                  onReset={resetGame}
                  isDarkMode={isDarkMode}
                  onToggleTheme={toggleTheme}
              />
          </div>

        </div>

        <WinnerModal 
          isOpen={!!winner} 
          winner={winner} 
          onReset={resetGame} 
        />

      </div>
    </div>
  );
};

export default App;