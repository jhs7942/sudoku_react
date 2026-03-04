import { createContext, useContext } from 'react';
import type { SudokuState, SudokuAction } from '@/types/sudoku';
import { useSudokuReducer } from '@hooks/useSudokuReducer';
import { useTimer } from '@hooks/useTimer';

/**
 * Sudoku Context 타입
 */
interface SudokuContextType {
  state: SudokuState;
  dispatch: React.Dispatch<SudokuAction>;
}

/**
 * Context 생성
 */
const SudokuContext = createContext<SudokuContextType | undefined>(undefined);

/**
 * SudokuProvider 컴포넌트
 * 앱 전체에서 게임 상태를 공유하기 위한 공급자
 */
export function SudokuProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useSudokuReducer();

  // 타이머 설정
  useTimer(state.gameStatus, () => {
    dispatch({ type: 'TICK_TIMER' });
  });

  return (
    <SudokuContext.Provider value={{ state, dispatch }}>
      {children}
    </SudokuContext.Provider>
  );
}

/**
 * useSudokuContext 훅
 * 어디서든 게임 상태와 dispatch에 접근 가능
 * Context를 사용하지 않으면 에러 발생
 */
export function useSudokuContext(): SudokuContextType {
  const context = useContext(SudokuContext);
  if (!context) {
    throw new Error(
      'useSudokuContext must be used within a SudokuProvider'
    );
  }
  return context;
}
