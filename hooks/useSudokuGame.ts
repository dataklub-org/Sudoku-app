import { useState, useEffect, useCallback } from 'react';
import {
  Board,
  Cell,
  Difficulty,
  generatePuzzle,
  checkConflicts,
  isBoardComplete,
  copyBoard,
} from '@/utils/sudoku';

interface GameState {
  board: Board;
  initialBoard: Board;
  solution: Board;
  notes: Map<string, Set<number>>;
  selectedCell: { row: number; col: number } | null;
  notesMode: boolean;
  hintsRemaining: number;
  mistakes: number;
  maxMistakes: number;
  isComplete: boolean;
  timer: number;
  difficulty: Difficulty;
}

interface HistoryEntry {
  board: Board;
  notes: Map<string, Set<number>>;
  mistakes: number;
}

export function useSudokuGame() {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    initialBoard: [],
    solution: [],
    notes: new Map(),
    selectedCell: null,
    notesMode: false,
    hintsRemaining: 3,
    mistakes: 0,
    maxMistakes: 3,
    isComplete: false,
    timer: 0,
    difficulty: 'medium',
  });

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (isTimerRunning && !gameState.isComplete) {
      const interval = setInterval(() => {
        setGameState((prev) => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, gameState.isComplete]);

  const startNewGame = useCallback((difficulty: Difficulty) => {
    const { puzzle, solution } = generatePuzzle(difficulty);
    const newState: GameState = {
      board: copyBoard(puzzle),
      initialBoard: copyBoard(puzzle),
      solution,
      notes: new Map(),
      selectedCell: null,
      notesMode: false,
      hintsRemaining: 3,
      mistakes: 0,
      maxMistakes: 3,
      isComplete: false,
      timer: 0,
      difficulty,
    };
    setGameState(newState);
    setHistory([]);
    setHistoryIndex(-1);
    setIsTimerRunning(true);
  }, []);

  const saveToHistory = useCallback((state: GameState) => {
    const entry: HistoryEntry = {
      board: copyBoard(state.board),
      notes: new Map(
        Array.from(state.notes.entries()).map(([key, value]) => [
          key,
          new Set(value),
        ])
      ),
      mistakes: state.mistakes,
    };

    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(entry);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const selectCell = useCallback((row: number, col: number) => {
    setGameState((prev) => ({
      ...prev,
      selectedCell: { row, col },
    }));
  }, []);

  const toggleNotesMode = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      notesMode: !prev.notesMode,
    }));
  }, []);

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const placeNumber = useCallback(
    (num: number) => {
      if (!gameState.selectedCell) return;

      const { row, col } = gameState.selectedCell;
      if (gameState.initialBoard[row][col] !== null) return;

      setGameState((prev) => {
        const newState = { ...prev };

        if (prev.notesMode) {
          const key = getCellKey(row, col);
          const notes = new Map(prev.notes);
          const cellNotes = new Set(notes.get(key) || []);

          if (cellNotes.has(num)) {
            cellNotes.delete(num);
          } else {
            cellNotes.add(num);
          }

          if (cellNotes.size > 0) {
            notes.set(key, cellNotes);
          } else {
            notes.delete(key);
          }

          newState.notes = notes;
        } else {
          saveToHistory(prev);

          const newBoard = copyBoard(prev.board);
          newBoard[row][col] = num;

          if (newBoard[row][col] !== prev.solution[row][col]) {
            newState.mistakes = prev.mistakes + 1;
          }

          const key = getCellKey(row, col);
          const notes = new Map(prev.notes);
          notes.delete(key);

          newState.board = newBoard;
          newState.notes = notes;

          if (isBoardComplete(newBoard)) {
            newState.isComplete = true;
            setIsTimerRunning(false);
          }
        }

        return newState;
      });
    },
    [gameState.selectedCell, gameState.initialBoard, gameState.notesMode, saveToHistory]
  );

  const eraseCell = useCallback(() => {
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    if (gameState.initialBoard[row][col] !== null) return;

    setGameState((prev) => {
      saveToHistory(prev);

      const newBoard = copyBoard(prev.board);
      newBoard[row][col] = null;

      return {
        ...prev,
        board: newBoard,
      };
    });
  }, [gameState.selectedCell, gameState.initialBoard, saveToHistory]);

  const useHint = useCallback(() => {
    if (
      gameState.hintsRemaining <= 0 ||
      !gameState.selectedCell ||
      gameState.isComplete
    )
      return;

    const { row, col } = gameState.selectedCell;
    if (gameState.initialBoard[row][col] !== null) return;

    setGameState((prev) => {
      saveToHistory(prev);

      const newBoard = copyBoard(prev.board);
      newBoard[row][col] = prev.solution[row][col];

      const key = getCellKey(row, col);
      const notes = new Map(prev.notes);
      notes.delete(key);

      const newState = {
        ...prev,
        board: newBoard,
        notes,
        hintsRemaining: prev.hintsRemaining - 1,
      };

      if (isBoardComplete(newBoard)) {
        newState.isComplete = true;
        setIsTimerRunning(false);
      }

      return newState;
    });
  }, [
    gameState.selectedCell,
    gameState.hintsRemaining,
    gameState.initialBoard,
    gameState.isComplete,
    saveToHistory,
  ]);

  const undo = useCallback(() => {
    if (historyIndex < 0) return;

    const entry = history[historyIndex];
    setGameState((prev) => ({
      ...prev,
      board: copyBoard(entry.board),
      notes: new Map(
        Array.from(entry.notes.entries()).map(([key, value]) => [
          key,
          new Set(value),
        ])
      ),
      mistakes: entry.mistakes,
    }));
    setHistoryIndex((prev) => prev - 1);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const entry = history[historyIndex + 1];
    setGameState((prev) => ({
      ...prev,
      board: copyBoard(entry.board),
      notes: new Map(
        Array.from(entry.notes.entries()).map(([key, value]) => [
          key,
          new Set(value),
        ])
      ),
      mistakes: entry.mistakes,
    }));
    setHistoryIndex((prev) => prev + 1);
  }, [history, historyIndex]);

  const getCells = useCallback((): Cell[] => {
    const cells: Cell[] = [];

   for (let row = 0; row < 9; row++) {
  for (let col = 0; col < 9; col++) {
    const key = getCellKey(row, col);
    cells.push({
      row,
      col,
      value: gameState.board?.[row]?.[col] ?? null, // removed extra comma
      isInitial: gameState.initialBoard?.[row]?.[col] != null, // safe access
      isConflict: gameState.board?.[row] ? checkConflicts(gameState.board, row, col) : false, // safe check
      notes: gameState.notes?.get(key) || new Set(), // safe notes access
    });
  }
}


    return cells;
  }, [gameState.board, gameState.initialBoard, gameState.notes]);

  return {
    gameState,
    cells: getCells(),
    startNewGame,
    selectCell,
    placeNumber,
    eraseCell,
    toggleNotesMode,
    useHint,
    undo,
    redo,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1,
  };
}
