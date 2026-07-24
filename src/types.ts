export type Player = 'X' | 'O';
export type Cell = Player | null;

export type GameMode = 'pvai' | 'pvp';
export type AIDifficulty = 'easy' | 'medium' | 'impossible';
export type GridSize = 3 | 4 | 5;

export type Theme = 'dark' | 'neon' | 'slate' | 'warm';

export interface Score {
  X: number;
  O: number;
  draws: number;
}

export interface WinningInfo {
  winner: Player | 'draw' | null;
  line: number[] | null;
}

export interface MoveHistoryItem {
  board: Cell[];
  player: Player;
  index: number;
  moveNumber: number;
}

export interface GameSettings {
  mode: GameMode;
  difficulty: AIDifficulty;
  gridSize: GridSize;
  userPlayer: Player; // Symbol chosen by human player in AI mode
  soundEnabled: boolean;
  theme: Theme;
}
