import type { Difficulty } from '@/types/sudoku';

/**
 * 빈 9x9 보드 생성
 */
export function createEmptyBoard(): number[][] {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));
}

/**
 * 빈 메모 배열 초기화 (9x9 Set 배열)
 */
export function createEmptyNotes(): Set<number>[][] {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => new Set<number>())
    );
}

/**
 * 특정 셀에 숫자를 놓을 수 있는지 검사 (행/열/박스 확인)
 * 스도쿠 규칙: 같은 행, 열, 3x3 박스에 중복 숫자 불가
 */
export function isValidPlacement(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // 행 확인
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }

  // 열 확인
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }

  // 3x3 박스 확인
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

/**
 * 완전한 스도쿠 보드 생성 (백트래킹 알고리즘)
 * 모든 셀이 1-9로 채워진 유효한 스도쿠 보드를 생성
 */
export function generateSolvedBoard(): number[][] {
  const board = createEmptyBoard();

  // 빈 셀 찾기 및 백트래킹
  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          // 무작위 순서로 1-9 시도 (다양한 퍼즐 생성)
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(
            () => Math.random() - 0.5
          );

          for (const num of numbers) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = 0; // 백트래킹
            }
          }
          return false;
        }
      }
    }
    return true; // 모든 셀이 채워짐
  }

  solve();
  return board;
}

/**
 * 난이도에 따라 셀 제거하여 퍼즐 생성
 * 유일해를 보장하기 위해 대칭적으로 셀 제거
 */
export function generatePuzzle(difficulty: Difficulty): {
  puzzle: number[][];
  solution: number[][];
} {
  const solution = generateSolvedBoard();
  const puzzle = solution.map((row) => [...row]);

  // 난이도별 제거할 셀 개수
  const cellsToRemove = {
    easy: 35,
    medium: 45,
    hard: 55,
  };

  let removed = 0;
  const targetRemove = cellsToRemove[difficulty];

  // 무작위로 셀 제거 (대칭적 제거로 유일해 유지)
  while (removed < targetRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed += 1;

      // 대칭 셀도 제거 (선택사항, 더 안정적인 유일해 보장)
      const symRow = 8 - row;
      const symCol = 8 - col;
      if (puzzle[symRow][symCol] !== 0) {
        puzzle[symRow][symCol] = 0;
        removed += 1;
      }
    }
  }

  return { puzzle, solution };
}

/**
 * 현재 보드가 정답과 일치하는지 확인
 */
export function checkWin(
  board: number[][],
  solution: number[][]
): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * 특정 셀에 입력한 숫자가 유효한지 확인 (오류 여부)
 * 특정 셀만 검사하므로 게임 중 즉시 오류 표시 가능
 */
export function isValidCell(
  board: number[][],
  solution: number[][],
  row: number,
  col: number
): boolean {
  const value = board[row][col];
  if (value === 0) return true; // 빈 셀은 오류 아님

  // 정답과 일치하면 유효
  if (value === solution[row][col]) return true;

  // 같은 행에 중복이 있으면 오류
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === value) return false;
  }

  // 같은 열에 중복이 있으면 오류
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === value) return false;
  }

  // 같은 3x3 박스에 중복이 있으면 오류
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) return false;
    }
  }

  return true;
}

/**
 * 보드의 모든 셀이 정답과 일치하면서 유효한지 확인
 */
export function isBoardValid(
  board: number[][],
  solution: number[][]
): boolean {
  // 모든 셀이 해결되어야 함
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0 || board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}
