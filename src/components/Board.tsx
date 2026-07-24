import React from 'react';
import { motion } from 'motion/react';
import { Cell, GridSize, Player, Theme } from '../types';

interface BoardProps {
  board: Cell[];
  gridSize: GridSize;
  winningLine: number[] | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
  theme: Theme;
}

export const Board: React.FC<BoardProps> = ({
  board,
  gridSize,
  winningLine,
  onCellClick,
  disabled,
  theme,
}) => {
  // Theme color styling maps
  const getThemeStyles = () => {
    switch (theme) {
      case 'neon':
        return {
          boardBg: 'bg-black border-lime-500/30 shadow-2xl shadow-lime-500/10',
          cellBg: 'bg-slate-950 hover:bg-slate-900 border-lime-900/40',
          xColor: 'text-lime-400 drop-shadow-[0_0_12px_rgba(163,230,53,0.8)]',
          oColor: 'text-fuchsia-500 drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]',
          winningCellBg: 'bg-lime-500/20 border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.3)]',
        };
      case 'slate':
        return {
          boardBg: 'bg-slate-900 border-slate-800 shadow-2xl',
          cellBg: 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700/50',
          xColor: 'text-sky-400',
          oColor: 'text-amber-400',
          winningCellBg: 'bg-sky-500/20 border-sky-400',
        };
      case 'warm':
        return {
          boardBg: 'bg-stone-900 border-stone-800 shadow-2xl shadow-amber-950/20',
          cellBg: 'bg-stone-800/90 hover:bg-stone-700/80 border-stone-700/50',
          xColor: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]',
          oColor: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]',
          winningCellBg: 'bg-amber-500/20 border-amber-400',
        };
      case 'dark':
      default:
        return {
          boardBg: 'bg-slate-900/90 border-slate-800/90 shadow-2xl shadow-indigo-500/5',
          cellBg: 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800/60',
          xColor: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]',
          oColor: 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]',
          winningCellBg: 'bg-indigo-500/25 border-indigo-400/80 shadow-[0_0_25px_rgba(99,102,241,0.4)]',
        };
    }
  };

  const themeStyle = getThemeStyles();

  // Dynamic grid column class
  const gridColsClass = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }[gridSize];

  // Dynamic sizing of symbols
  const getSymbolSizeClass = () => {
    if (gridSize === 3) return 'w-14 h-14 sm:w-18 sm:h-18';
    if (gridSize === 4) return 'w-10 h-10 sm:w-14 sm:h-14';
    return 'w-8 h-8 sm:w-11 sm:h-11';
  };

  return (
    <div className="w-full max-w-md mx-auto aspect-square p-3 sm:p-4 rounded-3xl border backdrop-blur-md transition-colors duration-300">
      <div className={`w-full h-full grid ${gridColsClass} gap-2 sm:gap-3 p-2 rounded-2xl ${themeStyle.boardBg}`}>
        {board.map((cell, idx) => {
          const isWinningCell = winningLine?.includes(idx);
          const isEmpty = cell === null;

          return (
            <motion.button
              key={idx}
              id={`board-cell-${idx}`}
              whileHover={isEmpty && !disabled ? { scale: 1.04 } : {}}
              whileTap={isEmpty && !disabled ? { scale: 0.94 } : {}}
              onClick={() => onCellClick(idx)}
              disabled={disabled || !isEmpty}
              className={`relative aspect-square rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden ${
                isWinningCell
                  ? themeStyle.winningCellBg
                  : themeStyle.cellBg
              } ${disabled || !isEmpty ? 'cursor-default' : ''}`}
            >
              {cell === 'X' && (
                <motion.svg
                  initial={{ scale: 0, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className={`${getSymbolSizeClass()} ${themeStyle.xColor}`}
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="14"
                  strokeLinecap="round"
                >
                  <line x1="22" y1="22" x2="78" y2="78" />
                  <line x1="78" y1="22" x2="22" y2="78" />
                </motion.svg>
              )}

              {cell === 'O' && (
                <motion.svg
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className={`${getSymbolSizeClass()} ${themeStyle.oColor}`}
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="14"
                  strokeLinecap="round"
                >
                  <circle cx="50" cy="50" r="32" />
                </motion.svg>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
