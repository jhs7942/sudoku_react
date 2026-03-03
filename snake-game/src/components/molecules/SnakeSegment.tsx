import React from 'react';
import CellBox from '@components/atoms/CellBox';
import type { Coordinate } from '@game-types';

interface SnakeSegmentProps {
  snake: Coordinate[];
  cellSize?: number;
}

/**
 * 뱀의 모든 세그먼트를 렌더링하는 컴포넌트
 * 머리는 다른 색상, 몸통은 통일된 색상으로 표시
 */
const SnakeSegment = React.memo(({ snake, cellSize = 32 }: SnakeSegmentProps) => {
  return (
    <>
      {snake.map((segment, index) => (
        <CellBox
          key={`${segment.x}-${segment.y}-${index}`}
          x={segment.x}
          y={segment.y}
          color={index === 0 ? 'snake-head' : 'snake-body'}
          cellSize={cellSize}
        />
      ))}
    </>
  );
});

SnakeSegment.displayName = 'SnakeSegment';

export default SnakeSegment;
