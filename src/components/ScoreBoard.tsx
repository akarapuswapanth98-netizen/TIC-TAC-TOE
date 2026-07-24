import React from 'react';
import { motion } from 'motion/react';
import { Player, Score, GameSettings } from '../types';
import { Bot, User, Minus } from 'lucide-react';

interface ScoreBoardProps {
  score: Score;
  currentTurn: Player;
  isAiThinking: boolean;
  settings: GameSettings;
  winner: Player | 'draw' | null;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  currentTurn,
  isAiThinking,
  settings,
  winner,
}) => {
  const isXTurn = currentTurn === 'X' && !winner;
  const isOTurn = currentTurn === 'O' && !winner;

  const getLabelX = () => {
    if (settings.mode === 'pvai') {
      return settings.userPlayer === 'X' ? 'You (X)' : 'AI (X)';
    }
    return 'Player X';
  };

  const getLabelO = () => {
    if (settings.mode === 'pvai') {
      return settings.userPlayer === 'O' ? 'You (O)' : 'AI (O)';
    }
    return 'Player O';
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      {/* Turn status message */}
      <div className="text-center mb-4 min-h-[32px] flex items-center justify-center">
        {!winner ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-sm font-semibold">
            {isAiThinking ? (
              <span className="flex items-center gap-2 text-indigo-400">
                <Bot className="w-4 h-4 animate-bounce" />
                <span>AI is calculating...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full animate-ping ${
                    currentTurn === 'X' ? 'bg-cyan-400' : 'bg-rose-400'
                  }`}
                />
                <span className="text-slate-300">Turn:</span>
                <span
                  className={`font-bold ${
                    currentTurn === 'X' ? 'text-cyan-400' : 'text-rose-400'
                  }`}
                >
                  {currentTurn === 'X' ? getLabelX() : getLabelO()}
                </span>
              </span>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-sm font-bold text-indigo-300"
          >
            {winner === 'draw' ? (
              <span>Game Ended in a Draw!</span>
            ) : (
              <span>
                🏆 Winner:{' '}
                {winner === 'X'
                  ? getLabelX()
                  : getLabelO()}
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Player X */}
        <motion.div
          animate={{
            scale: isXTurn ? 1.03 : 1,
            borderColor: isXTurn ? 'rgba(6, 182, 212, 0.6)' : 'rgba(30, 41, 59, 0.8)',
          }}
          className={`relative p-3.5 rounded-2xl bg-slate-900/80 border transition-all ${
            isXTurn ? 'shadow-lg shadow-cyan-500/10 bg-cyan-950/20' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 mb-1">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {getLabelX()}
            </span>
            <span className="text-lg font-black font-display">X</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-display">
            {score.X}
          </div>
        </motion.div>

        {/* Ties */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-400 mb-1">
            <Minus className="w-3.5 h-3.5" />
            Ties
          </div>
          <div className="text-2xl font-extrabold text-slate-300 font-display">
            {score.draws}
          </div>
        </div>

        {/* Player O */}
        <motion.div
          animate={{
            scale: isOTurn ? 1.03 : 1,
            borderColor: isOTurn ? 'rgba(244, 63, 94, 0.6)' : 'rgba(30, 41, 59, 0.8)',
          }}
          className={`relative p-3.5 rounded-2xl bg-slate-900/80 border transition-all ${
            isOTurn ? 'shadow-lg shadow-rose-500/10 bg-rose-950/20' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-400 mb-1">
            <span className="flex items-center gap-1">
              {settings.mode === 'pvai' && settings.userPlayer === 'X' ? (
                <Bot className="w-3.5 h-3.5" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
              {getLabelO()}
            </span>
            <span className="text-lg font-black font-display">O</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-display">
            {score.O}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
