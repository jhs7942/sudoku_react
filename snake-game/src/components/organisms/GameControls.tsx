import React from 'react';
import Button from '@components/atoms/Button';
import StatusBadge from '@components/atoms/StatusBadge';
import { GameStatus } from '@game-types';

interface GameControlsProps {
  gameStatus: GameStatus;
  onStart: () => void;
  onReset: () => void;
}

/**
 * 게임 컨트롤 버튼과 상태 표시를 포함하는 컴포넌트
 */
const GameControls = React.memo(({ gameStatus, onStart, onReset }: GameControlsProps) => {
  return (
    <div className="flex flex-col gap-6 bg-gray-700 p-6 rounded-lg">
      {/* 게임 상태 표시 */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300 font-medium">게임 상태</span>
        <StatusBadge status={gameStatus} />
      </div>

      {/* 버튼 그룹 */}
      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          disabled={gameStatus === GameStatus.PLAYING}
          className="w-full"
        >
          {gameStatus === GameStatus.READY ? '게임 시작' : '계속하기'}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={onReset}
          className="w-full"
        >
          게임 리셋
        </Button>
      </div>

      {/* 조작 설명 */}
      <div className="bg-gray-600 p-4 rounded-lg">
        <p className="text-gray-200 text-sm font-semibold mb-2">조작 방법</p>
        <ul className="text-gray-300 text-xs space-y-1">
          <li>• <span className="font-mono">↑ ↓ ← →</span> 또는 <span className="font-mono">W A S D</span>: 뱀 이동</li>
          <li>• <span className="font-mono">스페이스바</span>: 게임 일시정지/재개</li>
        </ul>
      </div>
    </div>
  );
});

GameControls.displayName = 'GameControls';

export default GameControls;
