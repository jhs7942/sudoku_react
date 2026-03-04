import { useEffect } from 'react';
import { useSudokuContext } from '@context/SudokuContext';
import {
  GameHeader,
  GameContainer,
  WinModal,
} from '@components/index';
import { AskDifficultyModal } from './AskDifficultyModal';

/**
 * SudokuGamePage - 메인 게임 페이지
 * 키보드 입력 처리, 레이아웃 구성, 게임 흐름 관리
 */
export function SudokuGamePage() {
  const { state, dispatch } = useSudokuContext();

  /**
   * 키보드 이벤트 처리
   * 방향키: 셀 이동
   * 1-9: 숫자 입력
   * Delete/Backspace: 셀 지우기
   * Ctrl+Z: Undo
   * Ctrl+Y: Redo
   * N: 메모 모드 토글
   * H: 힌트 사용
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameStatus === 'won') return;

      const [row, col] = state.selectedCell || [null, null];

      // 방향키로 셀 이동
      if (e.key === 'ArrowUp' && row !== null) {
        e.preventDefault();
        dispatch({
          type: 'SELECT_CELL',
          payload: { row: Math.max(0, row - 1), col: col! },
        });
      } else if (e.key === 'ArrowDown' && row !== null) {
        e.preventDefault();
        dispatch({
          type: 'SELECT_CELL',
          payload: { row: Math.min(8, row + 1), col: col! },
        });
      } else if (e.key === 'ArrowLeft' && col !== null) {
        e.preventDefault();
        dispatch({
          type: 'SELECT_CELL',
          payload: { row: row!, col: Math.max(0, col - 1) },
        });
      } else if (e.key === 'ArrowRight' && col !== null) {
        e.preventDefault();
        dispatch({
          type: 'SELECT_CELL',
          payload: { row: row!, col: Math.min(8, col + 1) },
        });
      }

      // 숫자 입력 (1-9)
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        dispatch({ type: 'INPUT_NUMBER', payload: { number: parseInt(e.key) } });
      }

      // 셀 지우기
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'ERASE_CELL' });
      }

      // Undo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }

      // Redo (Ctrl+Y)
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }

      // 메모 모드 토글 (N)
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_NOTES_MODE' });
      }

      // 힌트 사용 (H)
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        dispatch({ type: 'USE_HINT' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedCell, state.gameStatus, dispatch]);

  /**
   * 셀 클릭 처리
   */
  const handleCellClick = (row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', payload: { row, col } });
  };

  /**
   * 숫자 패드 클릭 처리
   */
  const handleNumberClick = (num: number) => {
    dispatch({ type: 'INPUT_NUMBER', payload: { number: num } });
  };

  /**
   * Erase 버튼 클릭 처리
   */
  const handleEraseClick = () => {
    dispatch({ type: 'ERASE_CELL' });
  };

  /**
   * Undo 버튼 클릭 처리
   */
  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  /**
   * Redo 버튼 클릭 처리
   */
  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  /**
   * Hint 버튼 클릭 처리
   */
  const handleHint = () => {
    dispatch({ type: 'USE_HINT' });
  };

  /**
   * Notes 토글 처리
   */
  const handleToggleNotes = () => {
    dispatch({ type: 'TOGGLE_NOTES_MODE' });
  };

  return (
    <div className="min-h-screen bg-sudoku-bg p-6">
      {/* 난이도 선택 모달 - 게임 시작 또는 새 게임 시 표시 */}
      {state.gameStatus === 'idle' && (
        <AskDifficultyModal
          onSelectDifficulty={(difficulty) => {
            dispatch({
              type: 'START_GAME',
              payload: { difficulty },
            });
          }}
        />
      )}

      {/* 게임이 진행 중일 때만 헤더와 게임 UI 표시 */}
      {state.gameStatus !== 'idle' && (
        <>
          {/* 헤더 */}
          <GameHeader
            timer={state.timer}
            difficulty={state.difficulty}
            onNewGame={() => {
              // 새 게임 버튼 클릭 시 게임 상태를 idle로 변경
              // AskDifficultyModal이 다시 표시됨
              // 간단하게 처리하기 위해 새로운 게임을 바로 시작
              dispatch({
                type: 'START_GAME',
                payload: { difficulty: state.difficulty },
              });
            }}
          />

          {/* 게임 컨테이너 */}
          <GameContainer
            state={state}
            onCellClick={handleCellClick}
            onNumberClick={handleNumberClick}
            onEraseClick={handleEraseClick}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onHint={handleHint}
            onToggleNotes={handleToggleNotes}
          />

          {/* 승리 모달 */}
          {state.gameStatus === 'won' && (
            <WinModal
              timer={state.timer}
              errors={state.errors}
              difficulty={state.difficulty}
              onPlayAgain={() => {
                dispatch({
                  type: 'START_GAME',
                  payload: { difficulty: state.difficulty },
                });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
