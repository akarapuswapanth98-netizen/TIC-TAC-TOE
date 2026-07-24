import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History } from 'lucide-react';
import { MoveHistoryItem, GridSize } from '../types';
import { soundFx } from '../lib/sound';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: MoveHistoryItem[];
  gridSize: GridSize;
  soundEnabled: boolean;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  gridSize,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              Move History
            </h2>
            <button
              id="history-close-btn"
              onClick={() => {
                soundFx.playClick(soundEnabled);
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* History List */}
          <div className="my-4 max-h-[60vh] overflow-y-auto space-y-2 pr-1">
            {history.length === 0 ? (
              <p className="text-center text-slate-500 py-8 text-sm">
                No moves played yet in this round.
              </p>
            ) : (
              history.map((item) => {
                const row = Math.floor(item.index / gridSize) + 1;
                const col = (item.index % gridSize) + 1;

                return (
                  <div
                    key={item.moveNumber}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                        #{item.moveNumber}
                      </span>
                      <span
                        className={`font-black font-display text-base ${
                          item.player === 'X' ? 'text-cyan-400' : 'text-rose-400'
                        }`}
                      >
                        Player {item.player}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      Row {row}, Col {col}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2">
            <button
              id="history-done-btn"
              onClick={() => {
                soundFx.playClick(soundEnabled);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
            >
              Close History
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
