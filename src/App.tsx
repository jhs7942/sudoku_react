import { SudokuProvider } from '@context/SudokuContext';
import { SudokuGamePage } from './pages/SudokuGamePage';

/**
 * App - 루트 컴포넌트
 * SudokuProvider로 전체 앱을 래핑하여 Context 제공
 */
export function App() {
  return (
    <SudokuProvider>
      <SudokuGamePage />
    </SudokuProvider>
  );
}
