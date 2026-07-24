import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cell,
  GameSettings,
  GridSize,
  MoveHistoryItem,
  Player,
  Score,
  WinningInfo,
} from './types';
import { checkWinner, getAIMove } from './lib/gameLogic';
import { soundFx } from './lib/sound';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';

const LOCAL_STORAGE_KEY_SETTINGS = 'ttt_game_settings_v1';
const LOCAL_STORAGE_KEY_SCORES = 'ttt_game_scores_v1';

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'pvai',
  difficulty: 'medium',
  gridSize: 3,
  userPlayer: 'X',
  soundEnabled: true,
  theme: 'dark',
};

export default function App() {
  // Settings with localStorage persistence
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Score with localStorage persistence
  const [score, setScore] = useState<Score>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SCORES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return { X: 0, O: 0, draws: 0 };
  });

  // Game Board State
  const [board, setBoard] = useState<Cell[]>(() =>
    Array(settings.gridSize * settings.gridSize).fill(null)
  );
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [winnerInfo, setWinnerInfo] = useState<WinningInfo>({
    winner: null,
    line: null,
  });
  const [moveHistory, setMoveHistory] = useState<MoveHistoryItem[]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Guard against stale AI timer
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Save scores to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SCORES, JSON.stringify(score));
    } catch {
      // Ignore
    }
  }, [score]);

  // Reset game state for new game
  const resetGame = useCallback(
    (newGridSize?: GridSize) => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      const size = newGridSize || settings.gridSize;
      setBoard(Array(size * size).fill(null));
      setCurrentTurn('X');
      setWinnerInfo({ winner: null, line: null });
      setMoveHistory([]);
      setIsAiThinking(false);
    },
    [settings.gridSize]
  );

  // Handle settings update
  const handleUpdateSettings = (newPartial: Partial<GameSettings>) => {
    const updated = { ...settings, ...newPartial };
    setSettings(updated);

    // If grid size or mode changed, restart match
    if (
      newPartial.gridSize !== undefined &&
      newPartial.gridSize !== settings.gridSize
    ) {
      resetGame(newPartial.gridSize);
    } else if (
      newPartial.mode !== undefined ||
      newPartial.userPlayer !== undefined
    ) {
      resetGame();
    }
  };

  // Execute move
  const makeMove = useCallback(
    (index: number, player: Player) => {
      if (board[index] !== null || winnerInfo.winner !== null) return;

      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);

      // Play move sound
      soundFx.playMove(player, settings.soundEnabled);

      // Record move history
      const newHistoryItem: MoveHistoryItem = {
        board: newBoard,
        player,
        index,
        moveNumber: moveHistory.length + 1,
      };
      setMoveHistory((prev) => [...prev, newHistoryItem]);

      // Check win condition
      const result = checkWinner(newBoard, settings.gridSize);

      if (result.winner) {
        setWinnerInfo(result);
        if (result.winner === 'X') {
          setScore((s) => ({ ...s, X: s.X + 1 }));
          soundFx.playWin(settings.soundEnabled);
        } else if (result.winner === 'O') {
          setScore((s) => ({ ...s, O: s.O + 1 }));
          soundFx.playWin(settings.soundEnabled);
        } else {
          setScore((s) => ({ ...s, draws: s.draws + 1 }));
          soundFx.playDraw(settings.soundEnabled);
        }
      } else {
        setCurrentTurn(player === 'X' ? 'O' : 'X');
      }
    },
    [board, winnerInfo.winner, moveHistory.length, settings, score]
  );

  // Handle cell click from human
  const handleCellClick = (index: number) => {
    if (isAiThinking || winnerInfo.winner !== null) return;

    // In PvAI mode, verify it's the human turn
    if (settings.mode === 'pvai') {
      const isHumanTurn = currentTurn === settings.userPlayer;
      if (!isHumanTurn) return;
    }

    makeMove(index, currentTurn);
  };

  // AI Turn Trigger
  useEffect(() => {
    if (
      settings.mode === 'pvai' &&
      winnerInfo.winner === null &&
      currentTurn !== settings.userPlayer &&
      !isAiThinking
    ) {
      setIsAiThinking(true);

      const delay = Math.random() * 200 + 350; // realistic human-like delay
      aiTimeoutRef.current = setTimeout(() => {
        const aiMoveIndex = getAIMove(
          board,
          settings.gridSize,
          settings.difficulty,
          currentTurn
        );

        if (aiMoveIndex !== -1) {
          makeMove(aiMoveIndex, currentTurn);
        }
        setIsAiThinking(false);
      }, delay);
    }

    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [
    settings.mode,
    settings.userPlayer,
    settings.difficulty,
    settings.gridSize,
    currentTurn,
    winnerInfo.winner,
    isAiThinking,
    board,
    makeMove,
  ]);

  // Undo Move Logic
  const handleUndo = () => {
    if (moveHistory.length === 0 || isAiThinking) return;

    if (settings.mode === 'pvp') {
      // Undo single move
      const newHistory = [...moveHistory];
      newHistory.pop();
      setMoveHistory(newHistory);

      if (newHistory.length === 0) {
        setBoard(Array(settings.gridSize * settings.gridSize).fill(null));
        setCurrentTurn('X');
      } else {
        const last = newHistory[newHistory.length - 1];
        setBoard(last.board);
        setCurrentTurn(last.player === 'X' ? 'O' : 'X');
      }
      setWinnerInfo({ winner: null, line: null });
    } else {
      // In PvAI mode: undo AI move + Human move (or just AI move if game finished on AI move)
      let undoCount = 1;
      if (
        moveHistory.length >= 2 &&
        moveHistory[moveHistory.length - 1].player !== settings.userPlayer
      ) {
        undoCount = 2;
      }

      const newHistory = moveHistory.slice(0, Math.max(0, moveHistory.length - undoCount));
      setMoveHistory(newHistory);

      if (newHistory.length === 0) {
        setBoard(Array(settings.gridSize * settings.gridSize).fill(null));
        setCurrentTurn('X');
      } else {
        const last = newHistory[newHistory.length - 1];
        setBoard(last.board);
        setCurrentTurn(last.player === 'X' ? 'O' : 'X');
      }
      setWinnerInfo({ winner: null, line: null });
    }
  };

  const handleResetScores = () => {
    setScore({ X: 0, O: 0, draws: 0 });
  };

  // Background gradient theme styling
  const getThemeBgClass = () => {
    switch (settings.theme) {
      case 'neon':
        return 'bg-slate-950 text-slate-100';
      case 'slate':
        return 'bg-slate-950 text-slate-100';
      case 'warm':
        return 'bg-stone-950 text-stone-100';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-100';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between py-6 px-4 sm:px-6 transition-colors duration-500 ${getThemeBgClass()} relative overflow-hidden selection:bg-indigo-500 selection:text-white`}
    >
      {/* Subtle Background Radial Accent Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
        {/* Header */}
        <Header
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Score Board */}
        <ScoreBoard
          score={score}
          currentTurn={currentTurn}
          isAiThinking={isAiThinking}
          settings={settings}
          winner={winnerInfo.winner}
        />

        {/* Game Board */}
        <Board
          board={board}
          gridSize={settings.gridSize}
          winningLine={winnerInfo.line}
          onCellClick={handleCellClick}
          disabled={isAiThinking || winnerInfo.winner !== null}
          theme={settings.theme}
        />

        {/* Game Controls */}
        <Controls
          onRestart={() => resetGame()}
          onUndo={handleUndo}
          onResetScores={handleResetScores}
          onOpenHistory={() => setIsHistoryOpen(true)}
          canUndo={moveHistory.length > 0 && !isAiThinking}
          historyLength={moveHistory.length}
          soundEnabled={settings.soundEnabled}
        />
      </div>

      {/* Winner Overlay Banner Modal */}
      <AnimatePresence>
        {winnerInfo.winner && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md bg-slate-900/95 border border-indigo-500/40 backdrop-blur-xl p-5 rounded-2xl shadow-2xl shadow-indigo-500/20 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-indigo-400">
              {winnerInfo.winner === 'draw' ? (
                <Sparkles className="w-6 h-6 text-amber-400" />
              ) : (
                <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
              )}
              <h3 className="text-lg font-bold font-display text-white">
                {winnerInfo.winner === 'draw'
                  ? 'It’s a Draw!'
                  : `Player ${winnerInfo.winner} Wins!`}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {winnerInfo.winner === 'draw'
                ? 'Both players fought bravely. Try another match!'
                : `Great play! ${
                    settings.mode === 'pvai'
                      ? winnerInfo.winner === settings.userPlayer
                        ? 'You defeated the AI!'
                        : 'The AI took this round.'
                      : 'Congratulations on your victory!'
                  }`}
            </p>
            <div className="flex items-center gap-2">
              <button
                id="play-again-btn"
                onClick={() => resetGame()}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={moveHistory}
        gridSize={settings.gridSize}
        soundEnabled={settings.soundEnabled}
      />
    </div>
  );
}
