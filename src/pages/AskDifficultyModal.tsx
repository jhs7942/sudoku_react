import type { Difficulty } from '@/types/sudoku';

interface AskDifficultyModalProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

/**
 * AskDifficultyModal - 난이도 선택 모달
 * 게임 시작 시 난이도를 선택하는 모달
 */
export function AskDifficultyModal({
  onSelectDifficulty,
}: AskDifficultyModalProps) {
  const difficulties: Array<{ level: Difficulty; label: string; description: string }> = [
    { level: 'easy', label: '쉬움', description: '35개 빈칸' },
    { level: 'medium', label: '보통', description: '45개 빈칸' },
    { level: 'hard', label: '어려움', description: '55개 빈칸' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* 제목 */}
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          스도쿠
        </h1>
        <p className="text-gray-600 mb-8">
          난이도를 선택하고 게임을 시작하세요
        </p>

        {/* 난이도 선택 버튼들 */}
        <div className="space-y-3">
          {difficulties.map(({ level, label, description }) => (
            <button
              key={level}
              onClick={() => onSelectDifficulty(level)}
              className={`
                w-full px-6 py-4 rounded-lg font-semibold text-lg
                transition-all duration-150 active:scale-95
                ${
                  level === 'easy'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : level === 'medium'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                }
              `}
            >
              <div className="text-xl">{label}</div>
              <div className="text-sm opacity-90">{description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
