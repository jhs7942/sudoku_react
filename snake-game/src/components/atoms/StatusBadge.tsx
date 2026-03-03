import React from 'react';
import { GameStatus } from '@game-types';

interface StatusBadgeProps {
  status: GameStatus;
}

/**
 * 게임 상태를 표시하는 배지 컴포넌트
 */
const StatusBadge = React.memo(({ status }: StatusBadgeProps) => {
  // 상태에 따른 스타일
  const statusStyles: Record<GameStatus, { bg: string; text: string; label: string }> = {
    [GameStatus.READY]: {
      bg: 'bg-blue-600',
      text: 'text-white',
      label: '준비 중',
    },
    [GameStatus.PLAYING]: {
      bg: 'bg-green-600',
      text: 'text-white',
      label: '진행 중',
    },
    [GameStatus.GAME_OVER]: {
      bg: 'bg-red-600',
      text: 'text-white',
      label: '게임 오버',
    },
  };

  const { bg, text, label } = statusStyles[status];

  return (
    <span className={`${bg} ${text} px-3 py-1 rounded-full text-sm font-semibold inline-block`}>
      {label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
