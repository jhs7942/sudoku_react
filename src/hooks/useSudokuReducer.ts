import { useReducer } from 'react';
import type {
  SudokuState,
  SudokuAction,
} from '@/types/sudoku';
import {
  generatePuzzle,
  createEmptyBoard,
  createEmptyNotes,
  isValidCell,
  checkWin,
} from '@utils/sudokuAlgorithms';

/**
 * 초기 게임 상태
 */
function getInitialState(): SudokuState {
  return {
    puzzle: createEmptyBoard(),
    solution: createEmptyBoard(),
    board: createEmptyBoard(),
    notes: createEmptyNotes(),
    selectedCell: null,
    gameStatus: 'idle',
    difficulty: 'easy',
    errors: 0,
    maxErrors: 3,
    hintsUsed: 0,
    maxHints: 3,
    isNotesMode: false,
    timer: 0,
    history: [],
    historyIndex: -1,
  };
}

/**
 * 깊은 복사 유틸 함수들
 */
function deepCopyBoard(board: number[][]): number[][] {
  return board.map((row) => [...row]);
}

function deepCopyNotes(notes: Set<number>[][]): Set<number>[][] {
  return notes.map((row) =>
    row.map((set) => new Set(set))
  );
}

/**
 * Sudoku 게임 상태 Reducer
 * 모든 게임 액션(셀 선택, 숫자 입력, Undo/Redo 등)을 처리
 */
function sudokuReducer(state: SudokuState, action: SudokuAction): SudokuState {
  switch (action.type) {
    /**
     * 새 게임 시작
     * 난이도 선택 후 초기화
     */
    case 'START_GAME': {
      const { difficulty } = action.payload;
      const { puzzle, solution } = generatePuzzle(difficulty);
      const board = deepCopyBoard(puzzle);

      return {
        ...state,
        puzzle,
        solution,
        board,
        notes: createEmptyNotes(),
        selectedCell: null,
        gameStatus: 'playing',
        difficulty,
        errors: 0,
        hintsUsed: 0,
        isNotesMode: false,
        timer: 0,
        history: [],
        historyIndex: -1,
      };
    }

    /**
     * 셀 선택
     * 클릭 또는 키보드 입력으로 셀 변경
     */
    case 'SELECT_CELL': {
      const { row, col } = action.payload;
      if (row < 0 || row >= 9 || col < 0 || col >= 9) {
        return state;
      }
      return {
        ...state,
        selectedCell: [row, col],
      };
    }

    /**
     * 숫자 입력
     * 메모 모드: 메모에 숫자 토글
     * 일반 모드: 보드에 숫자 입력 + 유효성 검사
     */
    case 'INPUT_NUMBER': {
      const { number } = action.payload;
      if (!state.selectedCell || state.gameStatus !== 'playing') {
        return state;
      }

      const [row, col] = state.selectedCell;
      // 초기 퍼즐의 고정값은 변경 불가
      if (state.puzzle[row][col] !== 0) {
        return state;
      }

      // 메모 모드: notes 토글
      if (state.isNotesMode) {
        const newNotes = deepCopyNotes(state.notes);
        if (newNotes[row][col].has(number)) {
          newNotes[row][col].delete(number);
        } else {
          newNotes[row][col].add(number);
        }
        return {
          ...state,
          notes: newNotes,
        };
      }

      // 일반 모드: 숫자 입력
      const newBoard = deepCopyBoard(state.board);
      newBoard[row][col] = number;
      const newNotes = deepCopyNotes(state.notes);
      newNotes[row][col] = new Set(); // 메모 초기화

      // 히스토리 저장
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        board: deepCopyBoard(state.board),
        notes: deepCopyNotes(state.notes),
      });

      // 유효성 검사: 현재 입력이 정답과 일치하지 않으면 오류
      const isValid = isValidCell(newBoard, state.solution, row, col);
      const newErrors = isValid ? state.errors : state.errors + 1;

      // 승리 감지
      if (checkWin(newBoard, state.solution)) {
        return {
          ...state,
          board: newBoard,
          notes: newNotes,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          errors: newErrors,
          gameStatus: 'won',
        };
      }

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        errors: newErrors,
      };
    }

    /**
     * 셀 지우기
     * 선택된 셀의 숫자와 메모 제거
     */
    case 'ERASE_CELL': {
      if (!state.selectedCell || state.gameStatus !== 'playing') {
        return state;
      }

      const [row, col] = state.selectedCell;
      if (state.puzzle[row][col] !== 0) {
        return state;
      }

      const newBoard = deepCopyBoard(state.board);
      newBoard[row][col] = 0;
      const newNotes = deepCopyNotes(state.notes);
      newNotes[row][col] = new Set();

      // 히스토리 저장
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        board: deepCopyBoard(state.board),
        notes: deepCopyNotes(state.notes),
      });

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    /**
     * 메모 모드 토글
     */
    case 'TOGGLE_NOTES_MODE': {
      return {
        ...state,
        isNotesMode: !state.isNotesMode,
      };
    }

    /**
     * Undo: 이전 상태로 복원
     */
    case 'UNDO': {
      if (state.historyIndex <= 0) {
        return state; // 되돌릴 내역 없음
      }

      const newIndex = state.historyIndex - 1;
      const entry = state.history[newIndex];

      return {
        ...state,
        board: deepCopyBoard(entry.board),
        notes: deepCopyNotes(entry.notes),
        historyIndex: newIndex,
      };
    }

    /**
     * Redo: 다음 상태로 복원
     */
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) {
        return state; // 다시 실행할 내역 없음
      }

      const newIndex = state.historyIndex + 1;
      const entry = state.history[newIndex];

      return {
        ...state,
        board: deepCopyBoard(entry.board),
        notes: deepCopyNotes(entry.notes),
        historyIndex: newIndex,
      };
    }

    /**
     * 힌트 사용
     * 선택된 빈 셀에 정답 입력
     */
    case 'USE_HINT': {
      if (
        !state.selectedCell ||
        state.gameStatus !== 'playing' ||
        state.hintsUsed >= state.maxHints
      ) {
        return state;
      }

      const [row, col] = state.selectedCell;
      // 초기 퍼즐의 고정값이거나 이미 채워진 셀은 무시
      if (state.puzzle[row][col] !== 0 || state.board[row][col] !== 0) {
        return state;
      }

      const newBoard = deepCopyBoard(state.board);
      newBoard[row][col] = state.solution[row][col];
      const newNotes = deepCopyNotes(state.notes);
      newNotes[row][col] = new Set();

      // 히스토리 저장
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        board: deepCopyBoard(state.board),
        notes: deepCopyNotes(state.notes),
      });

      // 승리 감지
      if (checkWin(newBoard, state.solution)) {
        return {
          ...state,
          board: newBoard,
          notes: newNotes,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          hintsUsed: state.hintsUsed + 1,
          gameStatus: 'won',
        };
      }

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        hintsUsed: state.hintsUsed + 1,
      };
    }

    /**
     * 타이머 틱
     * 1초마다 증가
     */
    case 'TICK_TIMER': {
      if (state.gameStatus === 'playing') {
        return {
          ...state,
          timer: state.timer + 1,
        };
      }
      return state;
    }

    /**
     * 게임 일시 중지
     */
    case 'PAUSE_GAME': {
      return {
        ...state,
        gameStatus: state.gameStatus === 'paused' ? 'playing' : 'paused',
      };
    }

    /**
     * 승리 상태로 전환
     */
    case 'WIN_GAME': {
      return {
        ...state,
        gameStatus: 'won',
      };
    }

    // 게임 초기화 - 난이도 선택 모달로 돌아감
    case 'RESET_GAME': {
      return getInitialState();
    }
    
    default:
      return state;
  }
}

/**
 * useSudokuReducer 훅
 * 게임 상태와 dispatch 함수 제공
 */
export function useSudokuReducer() {
  return useReducer(sudokuReducer, undefined, getInitialState);
}
