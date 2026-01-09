import { BOARD_SIZE, WIN_STREAK, HUMAN_PLAYER, BOT_PLAYER } from '../constants';
import { BoardState, Player, Position } from '../types';

// Directions to check: Horizontal, Vertical, Diagonal \, Diagonal /
const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

// Check if a move results in a win
export const checkWin = (board: BoardState, lastMove: Position | null, player: Player): Position[] | null => {
  if (!lastMove) return null;
  const { row, col } = lastMove;

  for (const [dr, dc] of DIRECTIONS) {
    let count = 1;
    let winningCells: Position[] = [{ row, col }];

    // Check forward
    for (let i = 1; i < WIN_STREAK; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        winningCells.push({ row: r, col: c });
      } else {
        break;
      }
    }

    // Check backward
    for (let i = 1; i < WIN_STREAK; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        winningCells.push({ row: r, col: c });
      } else {
        break;
      }
    }

    if (count >= WIN_STREAK) {
      return winningCells;
    }
  }

  return null;
};

// --- Heuristic AI Implementation ---

// Get all empty cells that are adjacent to occupied cells (within radius 2)
// This significantly reduces the search space compared to checking all empty cells.
const getCandidateMoves = (board: BoardState): Position[] => {
  const candidates = new Set<string>();
  const isEmptyBoard = board.every(row => row.every(cell => cell === null));

  // If board is empty, start in center
  if (isEmptyBoard) {
    return [{ row: Math.floor(BOARD_SIZE / 2), col: Math.floor(BOARD_SIZE / 2) }];
  }

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== null) {
        // Check radius 2 around this occupied cell
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === null) {
              candidates.add(`${nr},${nc}`);
            }
          }
        }
      }
    }
  }

  return Array.from(candidates).map(str => {
    const [r, c] = str.split(',').map(Number);
    return { row: r, col: c };
  });
};

// Evaluate a specific position for a player
// Returns a score based on consecutive stones and open ends
const evaluatePosition = (board: BoardState, r: number, c: number, player: Player): number => {
  let totalScore = 0;

  for (const [dr, dc] of DIRECTIONS) {
    let consecutive = 0;
    let openEnds = 0;
    
    // Check positive direction
    for (let i = 1; i < 5; i++) {
      const nr = r + dr * i;
      const nc = c + dc * i;
      if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
      if (board[nr][nc] === player) {
        consecutive++;
      } else if (board[nr][nc] === null) {
        openEnds++;
        break; // Stop at empty (open end)
      } else {
        break; // Blocked
      }
    }

    // Check negative direction
    for (let i = 1; i < 5; i++) {
      const nr = r - dr * i;
      const nc = c - dc * i;
      if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
      if (board[nr][nc] === player) {
        consecutive++;
      } else if (board[nr][nc] === null) {
        openEnds++;
        break; 
      } else {
        break;
      }
    }

    // Scoring heuristics
    if (consecutive >= 4) totalScore += 100000; // Winning move (4 existing + this one = 5)
    else if (consecutive === 3 && openEnds === 2) totalScore += 10000; // Open 4 (unbeatable next turn)
    else if (consecutive === 3 && openEnds === 1) totalScore += 1000; // Closed 4
    else if (consecutive === 2 && openEnds === 2) totalScore += 500; // Open 3
    else if (consecutive === 2 && openEnds === 1) totalScore += 100;
    else if (consecutive === 1 && openEnds === 2) totalScore += 50;
    else if (consecutive === 1 && openEnds === 1) totalScore += 10;
  }
  return totalScore;
};

export const getBestMove = (board: BoardState): Position => {
  const candidates = getCandidateMoves(board);
  let bestScore = -Infinity;
  let bestMove: Position = candidates[0];

  // If no candidates (game just started but getCandidateMoves covers this), fallback center
  if (candidates.length === 0) {
    return { row: Math.floor(BOARD_SIZE / 2), col: Math.floor(BOARD_SIZE / 2) };
  }

  for (const move of candidates) {
    const { row, col } = move;
    
    // Attack Score: How good is this move for Bot?
    const attackScore = evaluatePosition(board, row, col, BOT_PLAYER);
    
    // Defense Score: How good is this move for Human? (i.e., how urgent is it to block?)
    // We multiply defense by a factor slightly > 1 in critical situations to prefer blocking over equal attacks, 
    // but generally, winning is better than blocking.
    const defenseScore = evaluatePosition(board, row, col, HUMAN_PLAYER);

    // Heuristic weighting
    // If attackScore is high enough to win immediately, it overrides everything.
    // If defenseScore indicates opponent is about to win, we must block.
    
    let currentScore = 0;

    if (attackScore >= 100000) {
        currentScore = Infinity; // Take the win
    } else if (defenseScore >= 100000) {
        currentScore = 500000; // Must block immediate win (opponent has 4)
    } else if (attackScore >= 10000) {
        currentScore = 100000; // Create unbeatable Open 4
    } else if (defenseScore >= 10000) {
        currentScore = 50000; // Block opponent's Open 4
    } else {
        // General mix of attack and defense
        currentScore = attackScore + defenseScore * 1.1; // Slightly prefer blocking in mid-game
    }

    if (currentScore > bestScore) {
      bestScore = currentScore;
      bestMove = move;
    }
  }

  return bestMove;
};
