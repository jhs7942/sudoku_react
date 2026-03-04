import { SudokuGrid } from './SudokuGrid';
import { GameControls } from '@components/molecules/GameControls';
import { NumberPad } from '@components/molecules/NumberPad';
import type { SudokuState } from '@/types/sudoku';

interface GameContainerProps {
  state: SudokuState;
  onCellClick: (row: number, col: number) => void;
  onNumberClick: (num: number) => void;
  onEraseClick: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onToggleNotes: () => void;
}

/**
 * GameContainer - 전체 게임 레이아웃 조합
 * 그리드, 제어 버튼, 숫자 패드를 함께 표시
 */
export function GameContainer({
  state,
  onCellClick,
  onNumberClick,
  onEraseClick,
  onUndo,
  onRedo,
  onHint,
  onToggleNotes,
}: GameContainerProps) {
  /**
   * 완성된 숫자 계산 (보드에서 9개가 다 채워진 숫자)
   */
  const getCompletedNumbers = (): Set<number> => {
    const completed = new Set<number>();
    for (let num = 1; num <= 9; num++) {
      let count = 0;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (state.board[row][col] === num) {
            count++;
          }
        }
      }
      if (count === 9) {
        completed.add(num);
      }
    }
    return completed;
  };

  const completedNumbers = getCompletedNumbers();

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
      {/* 왼쪽: 그리드 */}
      <div className="flex justify-center lg:justify-start">
        <SudokuGrid
          puzzle={state.puzzle}
          board={state.board}
          notes={state.notes}
          solution={state.solution}
          selectedCell={state.selectedCell}
          onCellClick={onCellClick}
        />
      </div>

      {/* 오른쪽: 제어판 */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* 게임 제어 버튼 */}
        <GameControls
          onUndo={onUndo}
          onRedo={onRedo}
          onHint={onHint}
          onToggleNotes={onToggleNotes}
          isNotesModeActive={state.isNotesMode}
          canUndo={state.historyIndex > 0}
          canRedo={state.historyIndex < state.history.length - 1}
          canUseHint={state.hintsUsed < state.maxHints}
          hintsRemaining={state.maxHints - state.hintsUsed}
        />

        {/* 숫자 패드 */}
        <NumberPad
          onNumberClick={onNumberClick}
          onEraseClick={onEraseClick}
          disabledNumbers={completedNumbers}
        />
      </div>
    </div>
  );
}
