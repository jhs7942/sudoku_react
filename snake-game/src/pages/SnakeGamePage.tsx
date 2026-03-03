import { useCallback, useEffect } from 'react';
import GameContainer from '@components/organisms/GameContainer';
import { useGameContext } from '@context/GameContext';
import { useGameLoop } from '@hooks/useGameLoop';
import { Direction, GameStatus } from '@game-types';

/**
 * 스네이크 게임 메인 페이지
 * 게임 로직, 키보드 입력, 게임 루프를 관리
 */
const SnakeGamePage = () => {
  const { state, dispatch } = useGameContext();
  const isPlaying = state.gameState === GameStatus.PLAYING;

  // 게임 루프 시작
  useGameLoop({ state, dispatch });

  // 키보드 입력 처리
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 게임이 진행 중일 때만 방향 입력 처리
      if (!isPlaying) return;

      const keyMap: Record<string, Direction | null> = {
        ArrowUp: Direction.UP,
        ArrowDown: Direction.DOWN,
        ArrowLeft: Direction.LEFT,
        ArrowRight: Direction.RIGHT,
        w: Direction.UP,
        W: Direction.UP,
        s: Direction.DOWN,
        S: Direction.DOWN,
        a: Direction.LEFT,
        A: Direction.LEFT,
        d: Direction.RIGHT,
        D: Direction.RIGHT,
      };

      const direction = keyMap[event.key];
      if (direction) {
        event.preventDefault();
        dispatch({ type: 'SET_DIRECTION', payload: direction });
      }

      // 스페이스바로 게임 일시정지/재개 (향후 구현)
      if (event.code === 'Space') {
        event.preventDefault();
        // TODO: 일시정지 기능 추가
      }
    },
    [isPlaying, dispatch]
  );

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 게임 시작 핸들러
  const handleStart = useCallback(() => {
    if (state.gameState === GameStatus.READY) {
      dispatch({ type: 'START_GAME' });
    }
    // GAME_OVER 상태에서 시작 버튼을 누르면 리셋 후 시작
    if (state.gameState === GameStatus.GAME_OVER) {
      dispatch({ type: 'RESET_GAME' });
      // 다음 렌더링에서 게임 시작
      setTimeout(() => dispatch({ type: 'START_GAME' }), 0);
    }
  }, [state.gameState, dispatch]);

  // 게임 리셋 핸들러
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center p-4">
      <div className="w-full">
        {/* 타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">스네이크 게임</h1>
          <p className="text-gray-400">React + TypeScript로 만든 클래식 게임</p>
        </div>

        {/* 게임 컨테이너 */}
        <GameContainer
          state={state}
          onStart={handleStart}
          onReset={handleReset}
        />

        {/* 게임 오버 메시지 */}
        {state.gameState === GameStatus.GAME_OVER && (
          <div className="text-center mt-8">
            <p className="text-red-400 text-xl font-bold">
              게임 오버! 점수: {state.score}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              "게임 시작" 버튼을 눌러 다시 플레이하세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGamePage;
