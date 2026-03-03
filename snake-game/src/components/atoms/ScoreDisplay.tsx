import React from 'react';

interface ScoreDisplayProps {
  label: string;
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 점수를 표시하는 컴포넌트
 */
const ScoreDisplay = React.memo(({ label, score, size = 'md' }: ScoreDisplayProps) => {
  const sizeStyles: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold',
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-gray-400 text-sm font-medium">{label}</span>
      <span className={`${sizeStyles[size]} text-white font-bold tabular-nums`}>
        {score}
      </span>
    </div>
  );
});

ScoreDisplay.displayName = 'ScoreDisplay';

export default ScoreDisplay;
