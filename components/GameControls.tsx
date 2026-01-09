import React from 'react';
import { RefreshCcw, User, Cpu, Moon, Sun } from 'lucide-react';
import { Player, GameStats } from '../types';
import { HUMAN_PLAYER } from '../constants';

interface GameControlsProps {
  currentPlayer: Player;
  stats: GameStats;
  onReset: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ currentPlayer, stats, onReset, isDarkMode, onToggleTheme }) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-72">
      
      {/* Header/Theme Toggle Row for Mobile */}
      <div className="flex justify-between items-center lg:justify-end">
         <span className="lg:hidden text-sm font-semibold text-slate-400 uppercase tracking-wider">Cài đặt</span>
        <button 
          onClick={onToggleTheme}
          className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Turn Indicator */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition-colors">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">Lượt đi hiện tại</h3>
        <div className="flex items-center justify-between gap-2">
          {/* Player X (Human) - RED */}
          <div className={`flex-1 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors ${currentPlayer === HUMAN_PLAYER ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' : 'opacity-50'}`}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 truncate">Bạn</p>
              <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium">Player X</p>
            </div>
          </div>
          
          {/* Player O (Bot) - BLUE */}
          <div className={`flex-1 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors ${currentPlayer !== HUMAN_PLAYER ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' : 'opacity-50'}`}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
             <div className="min-w-0">
              <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 truncate">Robot</p>
              <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-medium">Player O</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats - Grid on small screens, stack on large */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex-1 transition-colors">
         <h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">Thống kê</h3>
         <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-0 lg:space-y-4 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center lg:border-b border-slate-100 dark:border-slate-700 lg:pb-2">
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Bạn thắng</span>
                <span className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">{stats.wins}</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center lg:border-b border-slate-100 dark:border-slate-700 lg:pb-2">
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Robot thắng</span>
                <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{stats.losses}</span>
            </div>
             <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center lg:pb-2">
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Hòa</span>
                <span className="text-lg sm:text-xl font-bold text-slate-500 dark:text-slate-400">{stats.draws}</span>
            </div>
         </div>
      </div>

      {/* Actions */}
      <button
        onClick={onReset}
        className="w-full py-3 sm:py-4 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-xl font-semibold shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        Ván mới
      </button>
      
      <div className="text-center text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 sm:mt-2">
        Caro Master AI v1.2
      </div>
    </div>
  );
};

export default GameControls;