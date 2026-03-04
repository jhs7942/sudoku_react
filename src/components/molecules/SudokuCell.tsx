
interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  notes: Set<number>;
  isGiven: boolean;
  isSelected: boolean;
  isRelated: boolean;
  isSameNumber: boolean;
  isError: boolean;
  onClick: () => void;
}

/**
 * SudokuCell - 단일 셀 컴포넌트
 * 값, 메모, 하이라이트 상태를 모두 표현
 *
 * 배경색 우선순위:
 * 1. isSelected (파란색)
 * 2. isSameNumber (옅은 파란색)
 * 3. isRelated (매우 옅은 회색)
 * 4. 기본 (흰색)
 *
 * 숫자 색상:
 * - 초기값(isGiven): slate-800 + bold
 * - 입력값 + 오류: red-600
 * - 입력값 + 정상: blue-600
 */
export function SudokuCell({
  row,
  col,
  value,
  notes,
  isGiven,
  isSelected,
  isRelated,
  isSameNumber,
  isError,
  onClick,
}: SudokuCellProps) {
  // 배경색 결정
  let bgColor = 'bg-grid-bg';
  if (isSelected) {
    bgColor = 'bg-cell-selected';
  } else if (isSameNumber) {
    bgColor = 'bg-cell-samenumber';
  } else if (isRelated) {
    bgColor = 'bg-cell-related';
  }

  // 숫자 색상 결정
  let textColor = 'text-number-input';
  let fontWeight = 'font-normal';
  if (isGiven) {
    textColor = 'text-number-given';
    fontWeight = 'font-bold';
  } else if (isError) {
    textColor = 'text-number-error';
  }

  // 테두리 결정 (3x3 박스 경계)
  let borderClasses = 'border border-border-cell';
  if (col % 3 === 0) borderClasses = 'border-l-2 border-r border-b border-border-box';
  if (col === 8) borderClasses += ' border-r-2';
  if (row % 3 === 0) borderClasses += ' border-t-2';
  if (row === 8) borderClasses += ' border-b-2';
  if (col % 3 !== 0) borderClasses = 'border';
  if (col % 3 === 2) borderClasses = 'border-r-2 border-l border-t border-b border-border-cell';
  if (row % 3 === 2) borderClasses += ' border-b-2';

  return (
    <button
      onClick={onClick}
      className={`
        w-14 h-14 flex items-center justify-center relative
        transition-colors duration-100 cursor-pointer
        ${bgColor} ${borderClasses}
      `}
      style={{
        borderLeftWidth: col % 3 === 0 ? '3px' : '1px',
        borderRightWidth: col === 8 ? '3px' : col % 3 === 2 ? '3px' : '1px',
        borderTopWidth: row % 3 === 0 ? '3px' : '1px',
        borderBottomWidth: row === 8 ? '3px' : row % 3 === 2 ? '3px' : '1px',
        borderColor: col % 3 === 0 || col === 8 || row % 3 === 0 || row === 8 ? '#334155' : '#cbd5e1',
      }}
    >
      {value > 0 ? (
        // 값이 있는 경우: 큰 숫자 표시
        <span className={`text-2xl ${fontWeight} ${textColor}`}>
          {value}
        </span>
      ) : notes.size > 0 ? (
        // 메모가 있는 경우: 3x3 미니 그리드로 표시
        <div className="grid grid-cols-3 gap-0.5 text-xs text-number-note">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-3 h-3 flex items-center justify-center">
              {notes.has(i + 1) ? i + 1 : ''}
            </div>
          ))}
        </div>
      ) : null}
    </button>
  );
}
