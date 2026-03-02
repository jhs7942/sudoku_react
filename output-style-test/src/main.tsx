import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// React 앱을 렌더링합니다
// getElementById('root')는 index.html의 <div id="root"></div>를 찾아서 그곳에 앱을 띄웁니다
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
