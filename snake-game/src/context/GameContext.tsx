import React, { createContext, type ReactNode } from 'react';
import type { GameState, GameAction } from '@game-types';

// 게임 컨텍스트 타입
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// 컨텍스트 생성
export const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider 컴포넌트
interface GameProviderProps {
  children: ReactNode;
  initialState: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameProvider = ({ children, initialState, dispatch }: GameProviderProps) => {
  return (
    <GameContext.Provider value={{ state: initialState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// 컨텍스트 사용 커스텀 훅
export const useGameContext = () => {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext는 GameProvider 내에서만 사용 가능합니다');
  }
  return context;
};
