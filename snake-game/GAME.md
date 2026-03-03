# 스네이크 게임 - React 설계 문서

## 📋 프로젝트 개요
- **프로젝트명**: Snake Game
- **프레임워크**: React 18
- **스타일링**: Tailwind CSS
- **렌더링**: requestAnimationFrame 최적화
- **상태 관리**: useReducer + Context API
- **설계 패턴**: Atomic Design

---

## 1️⃣ 상태 관리 설계

### 1.1 상태 구조 정의

```
GameState = {
  snake: Array<Coordinate>,           // 뱀의 바디 좌표 배열 [head, ...body]
  food: Coordinate,                   // 먹이의 위치 {x, y}
  direction: Direction,               // 현재 이동 방향 (UP, DOWN, LEFT, RIGHT)
  nextDirection: Direction,           // 다음 틱에 적용할 방향 (키 입력 버퍼)
  score: number,                      // 점수 (먹이 1개 = 10점)
  gameState: GameStatus,              // 게임 상태 (READY, PLAYING, GAME_OVER)
  highScore: number,                  // 최고 점수
  gridWidth: number,                  // 게임 그리드 가로 크기 (칸 수)
  gridHeight: number,                 // 게임 그리드 세로 크기 (칸 수)
  speed: number                       // 게임 속도 (밀리초 단위 틱 간격, 100~300ms)
}
```

### 1.2 상태 관리 방식: useReducer + Context API

**선택 이유:**
- `useState`만으로는 복잡한 상태 변화 로직 관리 어려움
- `useReducer`는 명확한 액션 기반 상태 전환으로 디버깅 용이
- Context API로 전역 상태 공유 (props drilling 방지)
- Zustand는 과도한 의존성 추가 (이 프로젝트 스케일에 불필요)

### 1.3 Action 타입 정의

```
Actions = {
  INIT_GAME,              // 게임 초기화
  START_GAME,             // READY -> PLAYING 상태 전환
  SET_DIRECTION,          // 뱀의 다음 방향 설정 (키 입력)
  UPDATE_GAME,            // 매 틱마다 호출 (뱀 이동, 충돌 판정, 먹이 먹기)
  FOOD_EATEN,             // 먹이 먹었을 때 호출
  GAME_OVER,              // 게임 오버 상태 전환
  RESET_GAME              // 게임 리셋
}
```

### 1.4 Context 구조

```
GameContext = {
  state: GameState,
  dispatch: Dispatch<Action>
}

// 제공자
<GameProvider>
  <Game />
</GameProvider>
```

---

## 2️⃣ 컴포넌트 구조 (Atomic Design)

### 2.1 계층 구조

```
┌─────────────────────────────────┐
│      App (루트 컴포넌트)          │
└──────────────┬──────────────────┘
               │
       ┌───────┴────────┐
       │                │
   ┌───▼─────────┐   ┌──▼──────────┐
   │ GameProvider│   │ GlobalStyles│
   └───┬─────────┘   └─────────────┘
       │
   ┌───▼──────────────┐
   │ SnakeGamePage    │ (Page 컴포넌트)
   └───┬──────────────┘
       │
   ┌───┴─────────────────────────┐
   │       GameContainer         │ (정렬/레이아웃)
   └───┬───────────┬─────────────┘
       │           │
   ┌───▼───┐   ┌───▼──────┐
   │ Board │   │SidePanel │
   └───┬───┘   └───┬──────┘
       │           │
   ┌───┴───────────┴────────┬────────────────┐
   │                        │                │
   │                    ┌───▼──────┐   ┌─────▼──────┐
   │                    │ScoreBoard│   │GameControls│
   │                    └──────────┘   └─────┬──────┘
   │                                         │
   │                                    ┌────┴──────┐
   │                                    │ StartBtn  │
   │                                    │ ResetBtn  │
   │                                    └───────────┘
   │
   ┌──▼──────────────────────────────┐
   │      GameGrid (캔버스 형식)       │
   └──┬───────────────┬──────────────┘
      │               │
   ┌──▼─────┐   ┌─────▼───┐
   │ Snake  │   │  Food   │
   └────────┘   └─────────┘
```

### 2.2 컴포넌트 상세 설계

#### **Atoms (원자 컴포넌트)**
- `CellBox`: 단일 그리드 셀 (크기, 색상, 위치)
- `Button`: 기본 버튼 (스타일: Tailwind)
- `ScoreDisplay`: 점수 텍스트 (숫자 표시)
- `StatusBadge`: 게임 상태 배지 (READY/PLAYING/GAME_OVER)

#### **Molecules (분자 컴포넌트)**
- `SnakeSegment`: 뱀의 세그먼트 (여러 CellBox 조합)
- `FoodItem`: 먹이 (CellBox + 스타일)
- `ControlButton`: 버튼 + 레이블 (예: START, RESET)
- `ScoreBoard`: 현재 점수 + 최고 점수 (ScoreDisplay 2개)

#### **Organisms (유기체 컴포넌트)**
- `GameGrid`: 게임 판 전체 (그리드 배경, Snake, Food 렌더링)
- `GameControls`: 모든 버튼 그룹 (START, RESET, 방향 키 표시)
- `GameContainer`: GameGrid + GameControls + ScoreBoard 배치
- `SnakeGamePage`: 전체 페이지 레이아웃

### 2.3 Props Drilling 방지 전략

```
GameContext 제공:
- state: snake, food, direction, score, gameState, gridWidth, gridHeight
- dispatch: 모든 액션 디스패치

깊은 네스팅의 컴포넌트는 Context 직접 구독
- GameGrid에서 useContext(GameContext)
- GameControls에서 useContext(GameContext)
- ScoreBoard에서 useContext(GameContext)
```

---

## 3️⃣ 핵심 로직 알고리즘

### 3.1 뱀 이동 로직 (move)

```
[move 알고리즘 순서도]

START
  ↓
currentDirection 확인
  ├─→ nextDirection이 설정되어 있나?
  │    ├─ YES → currentDirection = nextDirection (방향 변경)
  │    └─ NO → 현재 방향 유지
  ↓
head = snake[0] (뱀 머리)
↓
newHead 계산:
  ├─ UP:    {x: head.x, y: head.y - 1}
  ├─ DOWN:  {x: head.x, y: head.y + 1}
  ├─ LEFT:  {x: head.x - 1, y: head.y}
  └─ RIGHT: {x: head.x + 1, y: head.y}
↓
newSnake = [newHead, ...snake.slice(0, -1)]
  (머리 앞에 추가, 꼬리 제거)
↓
RETURN newSnake
END
```

### 3.2 충돌 판정 로직 (collision)

```
[collision 알고리즘 순서도]

START
  ↓
head = snake[0]
  ↓
[경계 충돌 체크]
  ├─ head.x < 0 OR head.x >= gridWidth?
  │   └─ YES → COLLISION (벽 충돌)
  ├─ head.y < 0 OR head.y >= gridHeight?
  │   └─ YES → COLLISION (벽 충돌)
  └─ NO → 경계 안전
  ↓
[자기 자신 충돌 체크]
  ├─ snake.slice(1).some(segment → segment === head)?
  │   └─ YES → COLLISION (자신과 충돌)
  └─ NO → 안전
  ↓
RETURN NO_COLLISION
END
```

### 3.3 먹이 먹기 판정 (checkFood)

```
[checkFood 알고리즘 순서도]

START
  ↓
head = snake[0]
  ↓
head === food 위치?
  ├─ YES →
  │        score += 10
  │        newFood = generateRandomFood()
  │        newSnake = [head, ...snake] (꼬리 추가 안 함 = 성장)
  │        RETURN { eaten: true, newSnake, newFood, newScore }
  └─ NO → RETURN { eaten: false }
  ↓
END
```

### 3.4 게임 틱 로직 (gameTick)

```
[gameTick 알고리즘 순서도]

START (매 100~300ms마다 실행)
  ↓
[1] 뱀 이동 실행
    newSnake = move(snake, currentDirection)
  ↓
[2] 충돌 판정
    collision = checkCollision(newSnake, gridWidth, gridHeight)
    ├─ YES → gameState = GAME_OVER → END
    └─ NO → 계속
  ↓
[3] 먹이 판정
    foodResult = checkFood(newSnake, food)
    ├─ eaten: true →
    │   score += 10
    │   food = generateNewFood()
    │   newSnake = newSnake (이미 꼬리가 안 제거됨)
    └─ eaten: false → 그대로 진행
  ↓
[4] 상태 업데이트
    snake = newSnake
    direction = nextDirection (or currentDirection)
    nextDirection = null (입력 버퍼 초기화)
  ↓
RETURN 업데이트된 state
END
```

### 3.5 키 입력 처리 (setDirection)

```
[setDirection 알고리즘]

START (키 입력 감지)
  ↓
입력된 키 확인:
  ├─ ArrowUp / 'W' → nextDirection = UP
  ├─ ArrowDown / 'S' → nextDirection = DOWN
  ├─ ArrowLeft / 'A' → nextDirection = LEFT
  └─ ArrowRight / 'D' → nextDirection = RIGHT
  ↓
[반대 방향 입력 방지]
  └─ 현재 방향이 DOWN이고 UP 입력?
      └─ 무시 (nextDirection 설정 안 함)
  ↓
다음 틱에서 newDirection 적용
END
```

---

## 4️⃣ 기술 제약 조건 및 최적화 전략

### 4.1 React 18 최적화

#### **자동 배칭 (Automatic Batching)**
- `dispatch()` 호출 여러 개가 한 번의 리렌더링으로 통합
- 게임 틱 중 여러 상태 업데이트 시 효율성 증가

#### **Concurrent Rendering**
- `useTransition` 사용 금지 (게임은 즉각적인 반응 필요)
- `useDeferredValue` 사용 금지 (게임 상태 업데이트 지연 불가)

#### **메모이제이션 전략**
```
React.memo() 적용:
- CellBox (props: x, y, color 자주 변경)
- SnakeSegment (snake 배열 매번 변경)
- FoodItem (food 위치 변경 시에만)

useMemo 적용:
- snake 배열 → snake가 변경될 때만 재계산
- food 생성 로직 → food가 변경될 때만

useCallback 적용:
- setDirection (키보드 이벤트 리스너)
- dispatch(gameTick) (setInterval 콜백)
```

### 4.2 requestAnimationFrame 최적화 전략

#### **렌더링 루프 구조**
```
1. requestAnimationFrame 콜백 등록
   └─ deltaTime 기반 누적 시간 계산
      └─ 누적 시간 >= tickInterval (100~300ms)?
         ├─ YES → dispatch(UPDATE_GAME)
         └─ NO → 다음 프레임 대기

2. 이점:
   - 브라우저 리페인트 주기와 동기화 (60fps 기준)
   - 높은 주사율 모니터 지원 (144fps 등)
   - setInterval 사용 시 불규칙한 타이밍 제거
   - CPU 효율성 증가 (불필요한 렌더링 제거)

3. 구현 위치:
   - useEffect 내 gameState === PLAYING일 때만 활성화
   - cleanup: cancelAnimationFrame() 호출
```

#### **Canvas vs DOM 비교**
```
DOM 렌더링 선택:
✅ CSS Grid 또는 Flex로 게임판 구성
✅ Tailwind CSS로 스타일 일관성 유지
✅ React 컴포넌트 재사용성 높음
✅ 디버깅 용이 (개발자 도구)

❌ Canvas (선택 안 함):
- 불필요한 복잡성
- React와 부자연스러운 통합
- 이 프로젝트 스케일에 오버스펙
```

### 4.3 Tailwind CSS 스타일링 전략

#### **디자인 토큰**
```
색상 팔레트:
- 게임판 배경: bg-gray-800 (어두운 배경)
- 뱀: bg-green-500 (밝은 초록)
- 뱀 머리: bg-green-700 (짙은 초록, 구분)
- 먹이: bg-red-500 (빨강)
- 텍스트: text-white (밝은 텍스트)
- 버튼: btn-primary (맞춤 클래스)

크기:
- 그리드 셀: w-8 h-8 (32px)
- 게임판: 20x20 셀 (640x640px)
```

#### **반응형 디자인**
```
모바일:
- 게임판: 20x15 셀 (축소)
- 버튼: 더 큰 터치 영역 (min-h-12)
- 세로 방향 레이아웃

데스크톱:
- 게임판: 20x20 셀 (표준)
- 버튼: 표준 크기
- 가로 방향 레이아웃 (게임판 + 패널)
```

### 4.4 성능 목표

```
목표치:
- FPS: 60fps 유지 (requestAnimationFrame 동기화)
- 게임 응답성: <50ms (키 입력 → 화면 반영)
- 초기 로딩: <2초
- 메모리: <10MB (정상 범위)

모니터링:
- React DevTools Profiler로 렌더링 시간 추적
- Chrome DevTools Performance 탭으로 FPS 확인
```

---

## 5️⃣ 개발 단계별 계획

### Phase 1: 기초 구조 (1~2일)
1. GameProvider + Context 설정
2. Atoms 컴포넌트 (CellBox, Button, ScoreDisplay)
3. GameGrid 기본 렌더링

### Phase 2: 게임 로직 (2~3일)
1. move, checkCollision, checkFood 알고리즘 구현
2. useReducer reducer 함수 작성
3. gameTick 로직 및 requestAnimationFrame 연동

### Phase 3: UI/UX (1~2일)
1. Molecules, Organisms 컴포넌트 완성
2. Tailwind CSS 스타일링
3. 게임 컨트롤 버튼 기능화

### Phase 4: 최적화 및 테스트 (1일)
1. 성능 프로파일링 및 최적화
2. 반응형 디자인 검증
3. 엣지 케이스 테스트 (벽 충돌, 자충돌 등)

---

## 6️⃣ 파일 구조 예상도

```
src/
├── App.tsx                          (루트 컴포넌트)
├── pages/
│   └── SnakeGamePage.tsx            (페이지 레벨)
├── components/
│   ├── atoms/
│   │   ├── CellBox.tsx
│   │   ├── Button.tsx
│   │   ├── ScoreDisplay.tsx
│   │   └── StatusBadge.tsx
│   ├── molecules/
│   │   ├── SnakeSegment.tsx
│   │   ├── FoodItem.tsx
│   │   ├── ControlButton.tsx
│   │   └── ScoreBoard.tsx
│   └── organisms/
│       ├── GameGrid.tsx
│       ├── GameControls.tsx
│       └── GameContainer.tsx
├── context/
│   └── GameContext.tsx              (상태 관리)
├── hooks/
│   ├── useGameReducer.ts            (reducer 로직)
│   └── useGameLoop.ts               (requestAnimationFrame)
├── types/
│   └── game.ts                      (타입 정의)
├── utils/
│   └── gameAlgorithms.ts            (move, collision, etc)
└── styles/
    └── tailwind.config.js           (Tailwind 설정)
```

---

## ✅ 설계 승인 체크리스트

- [ ] 상태 관리 설계 (useReducer + Context) 동의
- [ ] 컴포넌트 구조 (Atomic Design) 동의
- [ ] 핵심 로직 알고리즘 동의
- [ ] 기술 스택 (React 18, Tailwind, requestAnimationFrame) 동의
- [ ] 파일 구조 동의

**설계 승인 후 → 구현 단계로 진행**

