import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// React 18 - 새로운 Root API 사용
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
