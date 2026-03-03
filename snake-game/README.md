# 스네이크 게임

React 18과 TypeScript로 만든 클래식 스네이크 게임입니다.

## 🎮 게임 설명

뱀을 조작하여 먹이를 먹고 점수를 올려보세요! 벽이나 자신의 몸에 충돌하면 게임이 끝납니다.

## 🎯 기능

- ✅ 실시간 게임 루프 (requestAnimationFrame)
- ✅ 부드러운 뱀 이동 및 충돌 판정
- ✅ 점수 시스템 및 최고 점수 기록
- ✅ 게임 상태 관리 (Ready/Playing/GameOver)
- ✅ 반응형 UI (모바일 지원)
- ✅ 키보드 입력 처리 (화살표키, WASD)

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: useReducer + Context API

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── atoms/           # 기본 UI 컴포넌트
│   ├── molecules/       # 조합 컴포넌트
│   └── organisms/       # 복합 컴포넌트
├── context/            # Context API
├── hooks/              # 커스텀 훅
├── pages/              # 페이지 컴포넌트
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── App.tsx             # 루트 컴포넌트
├── main.tsx            # 진입점
└── index.css           # 글로벌 스타일
```

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어보세요.

### 빌드

```bash
npm run build
```

## 🎮 조작 방법

- **↑ ↓ ← →** 또는 **W A S D**: 뱀 이동
- **스페이스바**: 게임 일시정지/재개 (향후 지원)
- **게임 시작 버튼**: 게임 시작/계속하기
- **게임 리셋 버튼**: 게임 초기화

## 📐 게임 규칙

1. 뱀이 먹이를 먹으면 길어지고 점수가 10점 증가
2. 벽(게임판 경계)에 부딪히면 게임 오버
3. 자신의 몸에 부딪히면 게임 오버
4. 최고 점수는 자동으로 저장됨

## 🎨 설계

자세한 설계 문서는 [GAME.md](./GAME.md)를 참고하세요.

### Atomic Design 원칙

- **Atoms**: CellBox, Button, ScoreDisplay, StatusBadge
- **Molecules**: SnakeSegment, FoodItem, ScoreBoard
- **Organisms**: GameGrid, GameControls, GameContainer

## 📝 라이선스

MIT

## 👤 작성자

Claude (AI Assistant)
