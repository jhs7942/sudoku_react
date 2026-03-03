import { useReducer } from 'react';
import type { GameState, GameAction } from '@game-types';
import { GameStatus, Direction } from '@game-types';
import { generateRandomFood } from '@utils/gameAlgorithms';

// 초기 게임 상태
const initialGameState: GameState = {
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  direction: Direction.RIGHT,
  nextDirection: Direction.RIGHT,
  score: 0,
  gameState: GameStatus.READY,
  highScore: 0,
  gridWidth: 20,
  gridHeight: 20,
  speed: 150, // 150ms 간격으로 게임 틱
};

// 게임 리듀서
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'INIT_GAME':
      // 게임 초기화
      return {
        ...initialGameState,
        highScore: state.highScore,
        food: generateRandomFood(initialGameState.gridWidth, initialGameState.gridHeight, [
          initialGameState.snake[0],
        ]),
      };

    case 'START_GAME':
      // 게임 시작
      return {
        ...state,
        gameState: GameStatus.PLAYING,
      };

    case 'SET_DIRECTION':
      // 다음 방향 설정 (키 입력 버퍼)
      return {
        ...state,
        nextDirection: action.payload,
      };

    case 'UPDATE_GAME': {
      // 게임 상태 업데이트 (틱마다 호출)
      const { snake, score, food } = action.payload;

      return {
        ...state,
        snake,
        score,
        ...(food && { food }),
        direction: state.nextDirection,
      };
    }

    case 'GAME_OVER':
      // 게임 오버 상태 전환
      return {
        ...state,
        gameState: GameStatus.GAME_OVER,
        highScore: Math.max(state.highScore, state.score),
      };

    case 'RESET_GAME':
      // 게임 리셋
      return {
        ...initialGameState,
        highScore: state.highScore,
        food: generateRandomFood(initialGameState.gridWidth, initialGameState.gridHeight, [
          initialGameState.snake[0],
        ]),
      };

    default:
      return state;
  }
};

// 커스텀 훅
export const useGameReducer = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return { state, dispatch };
};
