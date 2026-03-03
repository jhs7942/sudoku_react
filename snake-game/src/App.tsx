import SnakeGamePage from '@/pages/SnakeGamePage';
import { GameProvider } from '@context/GameContext';
import { useGameReducer } from '@hooks/useGameReducer';
import './index.css';

/**
 * 루트 애플리케이션 컴포넌트
 * GameProvider로 전체 앱을 감싸서 상태 관리 제공
 */
function App() {
  const { state, dispatch } = useGameReducer();

  return (
    <GameProvider initialState={state} dispatch={dispatch}>
      <SnakeGamePage />
    </GameProvider>
  );
}

export default App;
