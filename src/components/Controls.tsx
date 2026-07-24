import React from 'react';
import { RotateCcw, Undo2, History, RefreshCw } from 'lucide-react';
import { soundFx } from '../lib/sound';

interface ControlsProps {
  onRestart: () => void;
  onUndo: () => void;
  onResetScores: () => void;
  onOpenHistory: () => void;
  canUndo: boolean;
  historyLength: number;
  soundEnabled: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onRestart,
  onUndo,
  onResetScores,
  onOpenHistory,
  canUndo,
  historyLength,
  soundEnabled,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mt-6 flex flex-wrap items-center justify-center gap-3">
      {/* Restart Game */}
      <button
        id="restart-game-btn"
        onClick={() => {
          soundFx.playReset(soundEnabled);
          onRestart();
        }}
        className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
      </button>

      {/* Undo Last Move */}
      <button
        id="undo-move-btn"
        onClick={() => {
          soundFx.playClick(soundEnabled);
          onUndo();
        }}
        disabled={!canUndo}
        className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
          canUndo
            ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:scale-105 active:scale-95'
            : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
        }`}
        title="Undo last move"
      >
        <Undo2 className="w-4 h-4" />
        Undo
      </button>

      {/* View Match History */}
      <button
        id="match-history-btn"
        onClick={() => {
          soundFx.playClick(soundEnabled);
          onOpenHistory();
        }}
        disabled={historyLength === 0}
        className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
          historyLength > 0
            ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:scale-105 active:scale-95'
            : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
        }`}
        title="View move history"
      >
        <History className="w-4 h-4 text-indigo-400" />
        Moves ({historyLength})
      </button>

      {/* Reset Scores */}
      <button
        id="reset-scores-btn"
        onClick={() => {
          soundFx.playReset(soundEnabled);
          onResetScores();
        }}
        className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800/80 transition-colors cursor-pointer"
        title="Reset score counters"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
};
