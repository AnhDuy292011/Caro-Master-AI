import React from 'react';
import { Player } from '../types';
import { Trophy, RefreshCw, AlertTriangle } from 'lucide-react';
import { HUMAN_PLAYER } from '../constants';

interface WinnerModalProps {
  winner: Player | 'DRAW' | null;
  onReset: () => void;
  isOpen: boolean;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onReset, isOpen }) => {
  if (!isOpen) return null;

  const isHumanWin = winner === HUMAN_PLAYER;
  const isDraw = winner === 'DRAW';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 border dark:border-slate-700">
        <div className="flex justify-center mb-4">
            {isDraw ? (
                <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-full">
                    <AlertTriangle className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                </div>
            ) : isHumanWin ? (
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full animate-bounce">
                    <Trophy className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                </div>
            ) : (
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
            )}
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
          {isDraw ? "Hòa!" : isHumanWin ? "Bạn đã thắng!" : "Robot đã thắng!"}
        </h2>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {isDraw 
            ? "Một ván đấu căng thẳng! Không ai giành chiến thắng." 
            : isHumanWin 
                ? "Tuyệt vời! Chiến thuật của bạn rất sắc bén." 
                : "Đừng nản lòng, hãy thử lại chiến thuật mới!"}
        </p>

        <button
          onClick={onReset}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
        >
          <RefreshCw className="w-5 h-5" />
          Chơi ván mới
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;