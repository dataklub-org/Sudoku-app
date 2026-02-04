export type CellValue = number | null;
export type Board = CellValue[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Cell {
  row: number;
  col: number;
  value: CellValue;
  isInitial: boolean;
  isConflict: boolean;
  notes: Set<number>;
}

export function createEmptyBoard(): Board {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
}

export function isValidMove(
  board: Board,
  row: number,
  col: number,
  num: number
): boolean {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

export function solveSudoku(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generateSolvedBoard(): Board {
  const board = createEmptyBoard();

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  for (let i = 0; i < 9; i++) {
    board[0][i] = numbers[i];
  }

  solveSudoku(board);
  return board;
}

export function generatePuzzle(difficulty: Difficulty): {
  puzzle: Board;
  solution: Board;
} {
  const solution = generateSolvedBoard();
  const puzzle = solution.map((row) => [...row]);

  const cellsToRemove =
    difficulty === 'easy' ? 30 : difficulty === 'medium' ? 40 : 50;

  let removed = 0;
  const attempts = cellsToRemove * 3;

  for (let i = 0; i < attempts && removed < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== null) {
      const backup = puzzle[row][col];
      puzzle[row][col] = null;

      const testBoard = puzzle.map((r) => [...r]);
      const solutions = countSolutions(testBoard, 2);

      if (solutions === 1) {
        removed++;
      } else {
        puzzle[row][col] = backup;
      }
    }
  }

  return { puzzle, solution };
}

function countSolutions(board: Board, limit: number): number {
  let count = 0;

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) {
                count++;
                if (count >= limit) {
                  board[row][col] = null;
                  return true;
                }
              }
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve();
  return count;
}

export function checkConflicts(board: Board, row: number, col: number): boolean {
  const value = board[row][col];
  if (value === null) return false;

  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x] === value) return true;
  }

  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col] === value) return true;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = startRow + i;
      const c = startCol + j;
      if ((r !== row || c !== col) && board[r][c] === value) {
        return true;
      }
    }
  }

  return false;
}

export function isBoardComplete(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null || checkConflicts(board, row, col)) {
        return false;
      }
    }
  }
  return true;
}

export function copyBoard(board: Board): Board {
  return board.map((row) => [...row]);
}
