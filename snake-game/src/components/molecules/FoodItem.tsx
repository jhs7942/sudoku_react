import React from 'react';
import CellBox from '@components/atoms/CellBox';
import type { Coordinate } from '@game-types';

interface FoodItemProps {
  food: Coordinate;
  cellSize?: number;
}

/**
 * 게임판 위의 먹이를 렌더링하는 컴포넌트
 */
const FoodItem = React.memo(({ food, cellSize = 32 }: FoodItemProps) => {
  return (
    <CellBox
      x={food.x}
      y={food.y}
      color="food"
      cellSize={cellSize}
    />
  );
});

FoodItem.displayName = 'FoodItem';

export default FoodItem;
