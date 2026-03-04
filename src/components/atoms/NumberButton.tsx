
interface NumberButtonProps {
  number: number;
  onClick: () => void;
  disabled?: boolean;
  remaining?: number;
}

/**
 * NumberButton - 숫자 패드의 숫자 버튼
 * 1-9 숫자를 표시하며, 클릭 시 숫자 입력
 */
export function NumberButton({
  number,
  onClick,
  disabled = false,
  remaining,
}: NumberButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-12 h-12 rounded-lg font-semibold text-lg
        transition-all duration-150 flex flex-col items-center justify-center
        relative overflow-hidden
        ${
          disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95'
        }
      `}
    >
      <span>{number}</span>
      {remaining !== undefined && (
        <span className="text-xs absolute bottom-1 text-gray-200">
          {remaining}
        </span>
      )}
    </button>
  );
}
