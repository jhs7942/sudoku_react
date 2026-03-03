import React from 'react';
import SnakeSegment from '@components/molecules/SnakeSegment';
import FoodItem from '@components/molecules/FoodItem';
import type { Coordinate } from '@game-types';

interface GameGridProps {
  snake: Coordinate[];
  food: Coordinate;
  gridWidth: number;
  gridHeight: number;
  cellSize?: number;
}

/**
 * 게임판 전체를 렌더링하는 컴포넌트
 * 뱀, 먹이, 그리드 배경을 포함
 */
const GameGrid = React.memo(
  ({
    snake,
    food,
    gridWidth,
    gridHeight,
    cellSize = 32,
  }: GameGridProps) => {
    const boardWidth = gridWidth * cellSize;
    const boardHeight = gridHeight * cellSize;

    return (
      <div
        className="relative bg-game-grid border-2 border-gray-600 rounded-lg shadow-lg"
        style={{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }}
        role="region"
        aria-label="게임판"
      >
        {/* 배경 그리드 (선택사항) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }}
        />

        {/* 뱀 렌더링 */}
        <SnakeSegment snake={snake} cellSize={cellSize} />

        {/* 먹이 렌더링 */}
        <FoodItem food={food} cellSize={cellSize} />
      </div>
    );
  }
);

GameGrid.displayName = 'GameGrid';

export default GameGrid;
