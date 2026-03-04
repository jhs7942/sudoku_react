import { useEffect } from 'react';
import type { GameStatus } from '@/types/sudoku';

/**
 * useTimer 훅
 * gameStatus가 'playing'일 때만 1초마다 onTick 호출
 * 게임이 종료되거나 일시 중지되면 자동으로 중지
 */
export function useTimer(gameStatus: GameStatus, onTick: () => void) {
  useEffect(() => {
    // 게임이 진행 중일 때만 타이머 시작
    if (gameStatus !== 'playing') {
      return;
    }

    const interval = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, onTick]);
}
