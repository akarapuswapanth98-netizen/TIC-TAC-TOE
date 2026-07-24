import { Cell, GridSize, Player, WinningInfo } from '../types';

export function getRequiredWinLength(size: GridSize): number {
  if (size === 3) return 3;
  if (size === 4) return 4;
  return 4; // 4 in a row for 5x5 gives a dynamic strategic game
}

// Generate all possible winning lines for given grid size and win length
export function getWinningLines(size: GridSize, winLength: number): number[][] {
  const lines: number[][] = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push(r * size + (c + k));
      }
      lines.push(line);
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push((r + k) * size + c);
      }
      lines.push(line);
    }
  }

  // Main diagonals (\)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push((r + k) * size + (c + k));
      }
      lines.push(line);
    }
  }

  // Sub diagonals (/)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = winLength - 1; c < size; c++) {
      const line: number[] = [];
      for (let k = 0; k < winLength; k++) {
        line.push((r + k) * size + (c - k));
      }
      lines.push(line);
    }
  }

  return lines;
}

export function checkWinner(board: Cell[], size: GridSize): WinningInfo {
  const winLength = getRequiredWinLength(size);
  const lines = getWinningLines(size, winLength);

  for (const line of lines) {
    const first = board[line[0]];
    if (!first) continue;

    let isWin = true;
    for (let i = 1; i < line.length; i++) {
      if (board[line[i]] !== first) {
        isWin = false;
        break;
      }
    }

    if (isWin) {
      return { winner: first, line };
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return { winner: 'draw', line: null };
  }

  return { winner: null, line: null };
}

export function getAvailableMoves(board: Cell[]): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) moves.push(i);
  }
  return moves;
}

// AI Engine
export function getAIMove(
  board: Cell[],
  size: GridSize,
  difficulty: 'easy' | 'medium' | 'impossible',
  aiPlayer: Player
): number {
  const available = getAvailableMoves(board);
  if (available.length === 0) return -1;

  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';

  // Easy mode: Random choice
  if (difficulty === 'easy') {
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  // Medium mode: Check for immediate win or immediate block, else 70% smart, 30% random
  if (difficulty === 'medium') {
    // 1. Can AI win in 1 move?
    for (const move of available) {
      const tempBoard = [...board];
      tempBoard[move] = aiPlayer;
      if (checkWinner(tempBoard, size).winner === aiPlayer) {
        return move;
      }
    }

    // 2. Can Human win in 1 move? Block it!
    for (const move of available) {
      const tempBoard = [...board];
      tempBoard[move] = humanPlayer;
      if (checkWinner(tempBoard, size).winner === humanPlayer) {
        return move;
      }
    }

    // 3. Prefer Center if available
    const center = Math.floor(board.length / 2);
    if (available.includes(center) && Math.random() < 0.7) {
      return center;
    }

    // Random choice among open spots
    return available[Math.floor(Math.random() * available.length)];
  }

  // Impossible mode: Full Minimax for 3x3, Depth-limited Minimax for 4x4 and 5x5
  if (size === 3) {
    return minimax3x3(board, aiPlayer, humanPlayer);
  } else {
    return heuristicAIMove(board, size, aiPlayer, humanPlayer);
  }
}

// Unbeatable Minimax algorithm for 3x3
function minimax3x3(board: Cell[], aiPlayer: Player, humanPlayer: Player): number {
  const available = getAvailableMoves(board);

  // Opening move optimization
  if (available.length === 9) {
    // Pick center or corner
    const openers = [0, 2, 4, 6, 8];
    return openers[Math.floor(Math.random() * openers.length)];
  }

  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const move of available) {
    const tempBoard = [...board];
    tempBoard[move] = aiPlayer;
    const score = minimax(tempBoard, 0, false, aiPlayer, humanPlayer, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(
  board: Cell[],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number,
  beta: number
): number {
  const result = checkWinner(board, 3);
  if (result.winner === aiPlayer) return 10 - depth;
  if (result.winner === humanPlayer) return depth - 10;
  if (result.winner === 'draw') return 0;
  if (depth >= 6) return 0; // Guard clause

  const available = getAvailableMoves(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of available) {
      board[move] = aiPlayer;
      const evalScore = minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of available) {
      board[move] = humanPlayer;
      const evalScore = minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
}

// Advanced Heuristic AI for larger grids (4x4 & 5x5)
function heuristicAIMove(board: Cell[], size: GridSize, aiPlayer: Player, humanPlayer: Player): number {
  const available = getAvailableMoves(board);
  const winLength = getRequiredWinLength(size);
  const lines = getWinningLines(size, winLength);

  // 1. Immediate win check
  for (const move of available) {
    const tempBoard = [...board];
    tempBoard[move] = aiPlayer;
    if (checkWinner(tempBoard, size).winner === aiPlayer) return move;
  }

  // 2. Immediate block check
  for (const move of available) {
    const tempBoard = [...board];
    tempBoard[move] = humanPlayer;
    if (checkWinner(tempBoard, size).winner === humanPlayer) return move;
  }

  // 3. Score each available move based on line completion heuristics
  let bestMove = available[0];
  let maxScore = -Infinity;

  for (const move of available) {
    let score = 0;

    // Favor moves closer to center
    const row = Math.floor(move / size);
    const col = move % size;
    const centerOffset = Math.abs(row - (size - 1) / 2) + Math.abs(col - (size - 1) / 2);
    score += (size - centerOffset) * 2;

    // Check all winning lines containing this cell
    for (const line of lines) {
      if (!line.includes(move)) continue;

      let aiCount = 0;
      let humanCount = 0;

      for (const idx of line) {
        if (idx === move) continue;
        if (board[idx] === aiPlayer) aiCount++;
        else if (board[idx] === humanPlayer) humanCount++;
      }

      // If line is unblocked by opponent, score AI potential
      if (humanCount === 0) {
        score += Math.pow(10, aiCount + 1);
      }
      // If line blocks opponent, score block potential
      if (aiCount === 0) {
        score += Math.pow(8, humanCount + 1);
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
