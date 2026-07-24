import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bot, Users, Cpu, Grid, UserCheck, Palette } from 'lucide-react';
import { GameSettings, GameMode, AIDifficulty, GridSize, Player, Theme } from '../types';
import { soundFx } from '../lib/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleModeChange = (mode: GameMode) => {
    soundFx.playClick(settings.soundEnabled);
    onUpdateSettings({ mode });
  };

  const handleDifficultyChange = (difficulty: AIDifficulty) => {
    soundFx.playClick(settings.soundEnabled);
    onUpdateSettings({ difficulty });
  };

  const handleGridChange = (gridSize: GridSize) => {
    soundFx.playClick(settings.soundEnabled);
    onUpdateSettings({ gridSize });
  };

  const handleSymbolChange = (userPlayer: Player) => {
    soundFx.playClick(settings.soundEnabled);
    onUpdateSettings({ userPlayer });
  };

  const handleThemeChange = (theme: Theme) => {
    soundFx.playClick(settings.soundEnabled);
    onUpdateSettings({ theme });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              Game Settings
            </h2>
            <button
              id="settings-close-btn"
              onClick={() => {
                soundFx.playClick(settings.soundEnabled);
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5 my-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Game Mode */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                Game Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="mode-pvai-btn"
                  onClick={() => handleModeChange('pvai')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    settings.mode === 'pvai'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  vs AI
                </button>
                <button
                  id="mode-pvp-btn"
                  onClick={() => handleModeChange('pvp')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    settings.mode === 'pvp'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  2 Players
                </button>
              </div>
            </div>

            {/* AI Difficulty (Only in PvAI mode) */}
            {settings.mode === 'pvai' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  AI Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'impossible'] as AIDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      id={`diff-${diff}-btn`}
                      onClick={() => handleDifficultyChange(diff)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        settings.difficulty === diff
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {diff === 'impossible' ? 'Unbeatable' : diff}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Choose Symbol (Only in PvAI mode) */}
            {settings.mode === 'pvai' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Play As (X Always Starts)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="symbol-x-btn"
                    onClick={() => handleSymbolChange('X')}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      settings.userPlayer === 'X'
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-lg">X</span>
                    <span className="text-xs font-normal opacity-80">(Goes 1st)</span>
                  </button>
                  <button
                    id="symbol-o-btn"
                    onClick={() => handleSymbolChange('O')}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      settings.userPlayer === 'O'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/80 shadow-md shadow-rose-500/10'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-lg">O</span>
                    <span className="text-xs font-normal opacity-80">(Goes 2nd)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Grid Size */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-indigo-400" />
                Board Grid Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([3, 4, 5] as GridSize[]).map((size) => (
                  <button
                    key={size}
                    id={`grid-${size}-btn`}
                    onClick={() => handleGridChange(size)}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                      settings.gridSize === size
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm">{size}x{size}</span>
                    <span className="text-[10px] opacity-75">
                      {size === 3 ? '3 in row' : '4 in row'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                Visual Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dark', label: 'Cyber Dark', color: 'bg-cyan-500' },
                  { id: 'neon', label: 'Neon Cyber', color: 'bg-lime-400' },
                  { id: 'slate', label: 'Classic Slate', color: 'bg-sky-400' },
                  { id: 'warm', label: 'Warm Ember', color: 'bg-amber-400' },
                ].map((t) => (
                  <button
                    key={t.id}
                    id={`theme-${t.id}-btn`}
                    onClick={() => handleThemeChange(t.id as Theme)}
                    className={`flex items-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                      settings.theme === t.id
                        ? 'bg-slate-800 text-white border-indigo-500'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="settings-done-btn"
              onClick={() => {
                soundFx.playClick(settings.soundEnabled);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Apply & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
