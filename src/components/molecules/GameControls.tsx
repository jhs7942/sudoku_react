import { IconButton } from '@components/atoms/IconButton';

interface GameControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onToggleNotes: () => void;
  isNotesModeActive: boolean;
  canUndo: boolean;
  canRedo: boolean;
  canUseHint: boolean;
  hintsRemaining: number;
}

/**
 * GameControls - 게임 제어 버튼 그룹
 * Undo, Redo, Hint, Notes 토글 버튼
 */
export function GameControls({
  onUndo,
  onRedo,
  onHint,
  onToggleNotes,
  isNotesModeActive,
  canUndo,
  canRedo,
  canUseHint,
  hintsRemaining,
}: GameControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      {/* 첫 번째 행: Undo / Redo */}
      <div className="flex gap-2">
        <IconButton
          label="실행 취소"
          onClick={onUndo}
          disabled={!canUndo}
          icon="↶"
        />
        <IconButton
          label="다시 실행"
          onClick={onRedo}
          disabled={!canRedo}
          icon="↷"
        />
      </div>

      {/* 두 번째 행: Hint */}
      <button
        onClick={onHint}
        disabled={!canUseHint}
        className={`
          w-full px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-150
          ${
            canUseHint
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
          active:scale-95
        `}
      >
        💡 힌트 ({hintsRemaining}개 남음)
      </button>

      {/* 세 번째 행: Notes 토글 */}
      <button
        onClick={onToggleNotes}
        className={`
          w-full px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-150
          ${
            isNotesModeActive
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-400 hover:bg-gray-500 text-white'
          }
          active:scale-95
        `}
      >
        ✏️ {isNotesModeActive ? '메모 모드 ON' : '메모 모드 OFF'}
      </button>
    </div>
  );
}
