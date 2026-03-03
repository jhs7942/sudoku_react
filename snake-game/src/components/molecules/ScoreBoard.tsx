import React from 'react';
import ScoreDisplay from '@components/atoms/ScoreDisplay';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

/**
 * 현재 점수와 최고 점수를 함께 표시하는 컴포넌트
 */
const ScoreBoard = React.memo(({ score, highScore }: ScoreBoardProps) => {
  return (
    <div className="flex gap-6 bg-gray-700 p-4 rounded-lg">
      <ScoreDisplay label="점수" score={score} size="lg" />
      <div className="border-r border-gray-600" />
      <ScoreDisplay label="최고 점수" score={highScore} size="lg" />
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';

export default ScoreBoard;
