/**
 * 게임 난이도 - 빈칸 수로 구분
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * 게임 진행 상태
 */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'won';

/**
 * 히스토리 엔트리 - Undo/Redo에 사용
 */
export interface HistoryEntry {
  board: number[][];        // 변경 전 보드 스냅샷
  notes: Set<number>[][];   // 변경 전 메모 스냅샷
}

/**
 * 전체 게임 상태
 */
export interface SudokuState {
  puzzle: number[][];           // 초기 퍼즐 (0 = 빈칸, 1-9 = 고정값)
  solution: number[][];         // 완전한 정답 보드
  board: number[][];            // 현재 사용자 입력 보드
  notes: Set<number>[][];       // notes[row][col] = 메모 숫자 집합

  selectedCell: [number, number] | null;  // 선택된 셀 [row, col]

  gameStatus: GameStatus;
  difficulty: Difficulty;
  errors: number;               // 현재 오류 횟수
  maxErrors: number;            // 최대 오류 횟수 (기본 3)
  hintsUsed: number;            // 사용한 힌트 횟수
  maxHints: number;             // 최대 힌트 횟수 (기본 3)

  isNotesMode: boolean;         // 메모 모드 활성화 여부
  timer: number;                // 경과 시간 (초)

  history: HistoryEntry[];      // Undo 스택
  historyIndex: number;         // 현재 히스토리 위치
}

/**
 * Reducer 액션 타입
 */
export type SudokuAction =
  | { type: 'START_GAME'; payload: { difficulty: Difficulty } }
  | { type: 'SELECT_CELL'; payload: { row: number; col: number } }
  | { type: 'INPUT_NUMBER'; payload: { number: number } }
  | { type: 'ERASE_CELL' }
  | { type: 'TOGGLE_NOTES_MODE' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'USE_HINT' }
  | { type: 'TICK_TIMER' }
  | { type: 'PAUSE_GAME' }
  | { type: 'WIN_GAME' };
