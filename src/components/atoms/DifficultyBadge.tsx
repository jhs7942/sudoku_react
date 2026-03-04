import type { Difficulty } from '@/types/sudoku';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

/**
 * DifficultyBadge - 난이도 표시 배지
 * 현재 게임의 난이도를 시각적으로 표시
 */
export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const badges = {
    easy: { label: '쉬움', bg: 'bg-green-500' },
    medium: { label: '보통', bg: 'bg-yellow-500' },
    hard: { label: '어려움', bg: 'bg-red-500' },
  };

  const { label, bg } = badges[difficulty];

  return (
    <div className={`${bg} text-white px-4 py-2 rounded-lg font-semibold`}>
      {label}
    </div>
  );
}
