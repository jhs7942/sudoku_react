import Calculator from './Calculator';
import './App.css';

// 메인 앱 컴포넌트입니다
function App() {
  return (
    <div className="app">
      {/* 계산기 컴포넌트를 렌더링합니다 */}
      <Calculator />
    </div>
  );
}

export default App;
