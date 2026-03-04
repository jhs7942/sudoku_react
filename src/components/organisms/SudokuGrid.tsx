import { SudokuCell } from '@components/molecules/SudokuCell';

interface SudokuGridProps {
  puzzle: number[][];
  board: number[][];
  notes: Set<number>[][];
  solution: number[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
}

/**
 * SudokuGrid - 9x9 전체 그리드 컴포넌트
 * 모든 81개 셀을 렌더링하고 하이라이트 상태를 계산
 */
export function SudokuGrid({
  puzzle,
  board,
  notes,
  solution,
  selectedCell,
  onCellClick,
}: SudokuGridProps) {
  /**
   * 셀의 하이라이트 상태 계산
   * isRelated: 같은 행/열/3x3 박스
   * isSameNumber: 선택된 셀과 같은 숫자
   * isError: 숫자가 입력되었지만 정답과 다른 경우
   */
  function getCellHighlight(row: number, col: number) {
    const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col;

    let isRelated = false;
    let isSameNumber = false;
    let isError = false;

    if (selectedCell) {
      const [selRow, selCol] = selectedCell;

      // 같은 행 또는 열 또는 박스에 있으면 관련 셀
      const sameRow = row === selRow;
      const sameCol = col === selCol;
      const sameBox =
        Math.floor(row / 3) === Math.floor(selRow / 3) &&
        Math.floor(col / 3) === Math.floor(selCol / 3);

      isRelated = (sameRow || sameCol || sameBox) && !isSelected;

      // 같은 숫자이면 하이라이트
      const selectedValue = board[selRow][selCol];
      if (selectedValue > 0 && board[row][col] === selectedValue && !isSelected) {
        isSameNumber = true;
      }
    }

    // 오류 검사: 입력되었지만 정답과 다르면 오류
    if (board[row][col] > 0 && board[row][col] !== solution[row][col]) {
      isError = true;
    }

    return { isRelated, isSameNumber, isError };
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-1 inline-block">
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
          gap: '0px',
        }}
      >
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: 9 }).map((_, col) => {
            const { isRelated, isSameNumber, isError } = getCellHighlight(row, col);
            const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col;

            return (
              <SudokuCell
                key={`${row}-${col}`}
                row={row}
                col={col}
                value={board[row][col]}
                notes={notes[row][col]}
                isGiven={puzzle[row][col] !== 0}
                isSelected={isSelected || false}
                isRelated={isRelated}
                isSameNumber={isSameNumber}
                isError={isError}
                onClick={() => onCellClick(row, col)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
