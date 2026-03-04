import { NumberButton } from '@components/atoms/NumberButton';

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onEraseClick: () => void;
  disabledNumbers: Set<number>; // 완성된 숫자 집합
}

/**
 * NumberPad - 1-9 숫자 + Erase 버튼 패드
 * 사용자가 숫자를 입력하기 위한 UI
 */
export function NumberPad({
  onNumberClick,
  onEraseClick,
  disabledNumbers,
}: NumberPadProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      {/* 첫 번째 행: 1-3 */}
      <div className="flex gap-2 justify-center">
        {[1, 2, 3].map((num) => (
          <NumberButton
            key={num}
            number={num}
            onClick={() => onNumberClick(num)}
            disabled={disabledNumbers.has(num)}
          />
        ))}
      </div>

      {/* 두 번째 행: 4-6 */}
      <div className="flex gap-2 justify-center">
        {[4, 5, 6].map((num) => (
          <NumberButton
            key={num}
            number={num}
            onClick={() => onNumberClick(num)}
            disabled={disabledNumbers.has(num)}
          />
        ))}
      </div>

      {/* 세 번째 행: 7-9 */}
      <div className="flex gap-2 justify-center">
        {[7, 8, 9].map((num) => (
          <NumberButton
            key={num}
            number={num}
            onClick={() => onNumberClick(num)}
            disabled={disabledNumbers.has(num)}
          />
        ))}
      </div>

      {/* 네 번째 행: Erase */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={onEraseClick}
          className={`
            w-12 h-12 rounded-lg font-semibold text-lg
            transition-all duration-150 flex items-center justify-center
            bg-red-500 hover:bg-red-600 text-white active:scale-95
          `}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
