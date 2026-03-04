import type { Difficulty } from '@/types/sudoku';

interface WinModalProps {
  timer: number;
  errors: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
}

/**
 * WinModal - 승리 모달
 * 퍼즐 완성 시 축하 메시지와 게임 통계 표시
 */
export function WinModal({
  timer,
  errors,
  difficulty,
  onPlayAgain,
}: WinModalProps) {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const difficultyLabel = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* 축하 아이콘 */}
        <div className="text-6xl mb-4">🎉</div>

        {/* 축하 메시지 */}
        <h2 className="text-3xl font-bold text-blue-600 mb-2">
          축하합니다!
        </h2>
        <p className="text-gray-600 mb-6">
          스도쿠 퍼즐을 완성했습니다!
        </p>

        {/* 통계 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">경과 시간:</span>
            <span className="font-semibold text-lg">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">오류 횟수:</span>
            <span className="font-semibold text-lg">{errors}회</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">난이도:</span>
            <span className="font-semibold text-lg">
              {difficultyLabel[difficulty]}
            </span>
          </div>
        </div>

        {/* 다시 하기 버튼 */}
        <button
          onClick={onPlayAgain}
          className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-150 active:scale-95"
        >
          🎮 다시 하기
        </button>
      </div>
    </div>
  );
}
