import { TimerDisplay } from '@components/atoms/TimerDisplay';
import { DifficultyBadge } from '@components/atoms/DifficultyBadge';
import type { Difficulty } from '@/types/sudoku';

interface GameHeaderProps {
  timer: number;
  difficulty: Difficulty;
  onNewGame: () => void;
}

/**
 * GameHeader - 게임 헤더 컴포넌트
 * 타이머, 난이도 배지, 새 게임 버튼 표시
 */
export function GameHeader({
  timer,
  difficulty,
  onNewGame,
}: GameHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        {/* 타이머 */}
        <TimerDisplay seconds={timer} />

        {/* 난이도 배지 */}
        <DifficultyBadge difficulty={difficulty} />

        {/* 새 게임 버튼 */}
        <button
          onClick={onNewGame}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-150 active:scale-95"
        >
          🆕 새 게임
        </button>
      </div>
    </div>
  );
}
