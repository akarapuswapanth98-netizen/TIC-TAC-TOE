import React from 'react';
import { Volume2, VolumeX, Settings, Palette, Bot, Users, Sparkles } from 'lucide-react';
import { GameSettings, Theme } from '../types';
import { soundFx } from '../lib/sound';

interface HeaderProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
}) => {
  const themes: { id: Theme; name: string }[] = [
    { id: 'dark', name: 'Cyber' },
    { id: 'neon', name: 'Neon' },
    { id: 'slate', name: 'Slate' },
    { id: 'warm', name: 'Warm' },
  ];

  const cycleTheme = () => {
    soundFx.playClick(settings.soundEnabled);
    const currentIndex = themes.findIndex((t) => t.id === settings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length].id;
    onUpdateSettings({ theme: nextTheme });
  };

  const toggleSound = () => {
    const nextSound = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: nextSound });
    if (nextSound) soundFx.playClick(true);
  };

  return (
    <header className="w-full max-w-xl mx-auto flex items-center justify-between py-4 px-4 sm:px-0 border-b border-slate-800/80 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 font-display">
            TIC TAC TOE
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {settings.mode === 'pvai' ? (
                <>
                  <Bot className="w-3 h-3" /> vs AI ({settings.difficulty})
                </>
              ) : (
                <>
                  <Users className="w-3 h-3" /> 2 Players
                </>
              )}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {settings.gridSize}x{settings.gridSize} Grid
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Sound Toggle */}
        <button
          id="sound-toggle-btn"
          onClick={toggleSound}
          title={settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Theme Switcher */}
        <button
          id="theme-toggle-btn"
          onClick={cycleTheme}
          title="Change Theme"
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
        >
          <Palette className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline capitalize">{settings.theme}</span>
        </button>

        {/* Settings Modal Trigger */}
        <button
          id="settings-open-btn"
          onClick={() => {
            soundFx.playClick(settings.soundEnabled);
            onOpenSettings();
          }}
          title="Game Settings"
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
