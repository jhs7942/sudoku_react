import React from 'react';
import GameGrid from './GameGrid';
import GameControls from './GameControls';
import ScoreBoard from '@components/molecules/ScoreBoard';
import type { GameState } from '@game-types';

interface GameContainerProps {
  state: GameState;
  onStart: () => void;
  onReset: () => void;
}

/**
 * 게임판, 컨트롤, 점수판을 배치하는 컨테이너
 * 반응형 레이아웃 제공
 */
const GameContainer = React.memo(({ state, onStart, onReset }: GameContainerProps) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* 점수판 */}
      <ScoreBoard score={state.score} highScore={state.highScore} />

      {/* 메인 게임 영역 - 반응형 레이아웃 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 게임판 */}
        <div className="flex-shrink-0">
          <GameGrid
            snake={state.snake}
            food={state.food}
            gridWidth={state.gridWidth}
            gridHeight={state.gridHeight}
            cellSize={32}
          />
        </div>

        {/* 컨트롤 패널 */}
        <div className="flex-grow md:max-w-xs">
          <GameControls
            gameStatus={state.gameState}
            onStart={onStart}
            onReset={onReset}
          />
        </div>
      </div>
    </div>
  );
});

GameContainer.displayName = 'GameContainer';

export default GameContainer;
