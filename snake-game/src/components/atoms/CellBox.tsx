import React from 'react';

interface CellBoxProps {
  x: number;
  y: number;
  color: 'snake-head' | 'snake-body' | 'food' | 'empty';
  cellSize?: number;
}

/**
 * 게임 그리드의 단일 셀 컴포넌트
 * 절대 위치로 고정되어 게임판 위에 렌더링됩니다
 */
const CellBox = React.memo(({ x, y, color, cellSize = 32 }: CellBoxProps) => {
  // 색상 매핑
  const colorMap: Record<string, string> = {
    'snake-head': 'bg-snake-head',
    'snake-body': 'bg-snake-body',
    'food': 'bg-food',
    'empty': 'bg-transparent',
  };

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x * cellSize}px`,
    top: `${y * cellSize}px`,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
  };

  return (
    <div
      className={`${colorMap[color]} rounded-sm border border-gray-700 transition-colors`}
      style={positionStyle}
      role="presentation"
    />
  );
});

CellBox.displayName = 'CellBox';

export default CellBox;
