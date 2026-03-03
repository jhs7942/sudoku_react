import { useEffect, useRef } from 'react';
import type { GameState, GameAction } from '@game-types';
import { GameStatus } from '@game-types';
import { moveSnake, checkCollision, checkFood, growSnake, generateRandomFood } from '@utils/gameAlgorithms';

interface UseGameLoopProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

/**
 * requestAnimationFrame을 사용한 게임 루프 커스텀 훅
 * 게임이 PLAYING 상태일 때만 실행
 */
export const useGameLoop = ({ state, dispatch }: UseGameLoopProps) => {
  const animationIdRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // 게임이 진행 중이 아니면 루프 종료
    if (state.gameState !== GameStatus.PLAYING) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    const gameLoop = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // 누적 시간에 deltaTime 추가
      accumulatedTimeRef.current += deltaTime;

      // 누적 시간이 게임 속도(틱 간격)를 초과했을 때 게임 업데이트
      if (accumulatedTimeRef.current >= state.speed) {
        accumulatedTimeRef.current -= state.speed;

        // 뱀 이동
        const newSnake = moveSnake(state.snake, state.direction, state.nextDirection);

        // 충돌 판정
        if (checkCollision(newSnake, state.gridWidth, state.gridHeight)) {
          dispatch({ type: 'GAME_OVER' });
          return;
        }

        // 먹이 판정
        let updatedSnake = newSnake;
        let newFood = state.food;
        let newScore = state.score;

        if (checkFood(newSnake, state.food)) {
          // 뱀 성장 (머리 위치 유지, 꼬리 추가)
          updatedSnake = growSnake(newSnake, newSnake[0]);
          newScore += 10;
          newFood = generateRandomFood(state.gridWidth, state.gridHeight, updatedSnake);
        }

        // 상태 업데이트
        dispatch({
          type: 'UPDATE_GAME',
          payload: {
            snake: updatedSnake,
            score: newScore,
            food: newFood,
          },
        });
      }

      // 다음 프레임 요청
      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    // 게임 루프 시작
    animationIdRef.current = requestAnimationFrame(gameLoop);

    // cleanup: 컴포넌트 언마운트 또는 상태 변경 시 애니메이션 프레임 취소
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [state.gameState, state.speed, state.gridWidth, state.gridHeight, state.direction, state.nextDirection, state.snake, state.food, state.score, dispatch]);
};
