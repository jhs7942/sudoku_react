# 스도쿠 게임 구현 플랜 - 완성

## Context

빈 디렉토리인 `/Users/jeonghyeonseung/workspaces/claude/스도쿠`에
React + Vite 기반 스도쿠 게임을 새로 구축했다.
이웃 프로젝트 `snake-game`의 아키텍처(Atomic Design + useReducer + Context)를 레퍼런스로 삼았다.
목표: 게임 기능과 상태 흐름이 명확하게 주석으로 문서화된 깔끔한 디자인의 스도쿠 웹앱.

---

## 기술 스택

- React 18 + TypeScript 5
- Vite 5 (빌드 도구)
- Tailwind CSS 3 (스타일링)
- useReducer + Context API (상태 관리)
- 외부 라이브러리 없음 (퍼즐 생성 로직 직접 구현)

---

## 핵심 기능 목록

| 기능 | 설명 | 상태 |
|------|------|------|
| 퍼즐 생성 | 난이도별(쉬움/보통/어려움) 유일해 스도쿠 생성 | ✅ |
| 셀 선택 | 클릭 또는 키보드 방향키로 셀 이동 | ✅ |
| 숫자 입력 | 키보드 1-9 또는 숫자 패드로 입력 | ✅ |
| 오류 표시 | 잘못된 숫자 즉시 빨간색 하이라이트 | ✅ |
| 하이라이트 | 선택 셀과 같은 숫자, 같은 행/열/박스 강조 | ✅ |
| 메모 모드 | 셀에 후보 숫자 작성 (pencil marks) | ✅ |
| 힌트 | 선택한 빈 셀에 정답 자동 입력 (최대 3회/게임) | ✅ |
| Undo / Redo | 입력 히스토리 되돌리기/다시 실행 | ✅ |
| 타이머 | 경과 시간 표시 | ✅ |
| 승리 감지 | 보드 완성 시 축하 모달 표시 | ✅ |
| 새 게임 | 난이도 선택 후 새 퍼즐 시작 | ✅ |

---

## 디렉토리 구조

```
스도쿠/
├── index.html
├── package.json
├── vite.config.ts          # 경로 별칭 설정
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js      # 스도쿠 전용 컬러 토큰 정의
├── postcss.config.js
├── dist/                   # 빌드 결과물 (npm run build)
├── .claude/
│   └── plans/
│       └── plan.md         # 이 파일
└── src/
    ├── main.tsx             # ReactDOM.createRoot 진입점
    ├── App.tsx              # SudokuProvider + SudokuGamePage
    ├── index.css            # Tailwind 지시문 + 기본 스타일
    ├── types/
    │   └── sudoku.ts        # 모든 타입 정의
    ├── context/
    │   └── SudokuContext.tsx # createContext + SudokuProvider + useSudokuContext
    ├── hooks/
    │   ├── useSudokuReducer.ts  # useReducer (상태 + 액션)
    │   └── useTimer.ts          # setInterval 기반 타이머
    ├── utils/
    │   └── sudokuAlgorithms.ts  # 퍼즐 생성, 유효성 검사, 힌트 로직
    ├── pages/
    │   ├── SudokuGamePage.tsx   # 키보드 이벤트 처리, 레이아웃
    │   └── AskDifficultyModal.tsx # 난이도 선택 모달
    └── components/
        ├── atoms/
        │   ├── NumberButton.tsx   # 숫자 패드의 숫자 버튼
        │   ├── IconButton.tsx     # Undo/Redo/Hint/Erase 아이콘 버튼
        │   ├── TimerDisplay.tsx   # MM:SS 형식 타이머
        │   └── DifficultyBadge.tsx # 난이도 표시 배지
        ├── molecules/
        │   ├── SudokuCell.tsx     # 단일 셀 (값/메모/하이라이트 상태 표현)
        │   ├── NumberPad.tsx      # 1-9 숫자 + Erase 버튼 패드
        │   └── GameControls.tsx   # Undo/Redo/Hint/Notes 토글 버튼 그룹
        ├── organisms/
        │   ├── SudokuGrid.tsx     # 9x9 전체 그리드 (3x3 박스 구조)
        │   ├── GameHeader.tsx     # 타이머 + 난이도 + 새 게임 버튼
        │   ├── GameContainer.tsx  # 전체 레이아웃 조합
        │   └── WinModal.tsx       # 승리 시 모달
        └── index.ts               # 컴포넌트 re-export
```

---

## 타입 정의 (`src/types/sudoku.ts`)

```typescript
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'won';

export interface HistoryEntry {
  board: number[][];
  notes: Set<number>[][];
}

export interface SudokuState {
  puzzle: number[][];
  solution: number[][];
  board: number[][];
  notes: Set<number>[][];
  selectedCell: [number, number] | null;
  gameStatus: GameStatus;
  difficulty: Difficulty;
  errors: number;
  maxErrors: number;
  hintsUsed: number;
  maxHints: number;
  isNotesMode: boolean;
  timer: number;
  history: HistoryEntry[];
  historyIndex: number;
}

export type SudokuAction =
  | { type: 'START_GAME'; payload: { difficulty: Difficulty } }
  | { type: 'SELECT_CELL'; payload: { row: number; col: number } }
  | { type: 'INPUT_NUMBER'; payload: { number: number } }
  | { type: 'ERASE_CELL' }
  | { type: 'TOGGLE_NOTES_MODE' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'USE_HINT' }
  | { type: 'TICK_TIMER' }
  | { type: 'PAUSE_GAME' }
  | { type: 'WIN_GAME' };
```

---

## 상태 흐름 상세

### 1. 새 게임 시작
```
[사용자] 난이도 버튼 클릭
  → dispatch({ type: 'START_GAME', payload: { difficulty } })
  → generatePuzzle(difficulty) 호출
      → 완전한 solution 생성 (백트래킹 알고리즘)
      → difficulty에 따라 셀 제거 → puzzle 생성
        easy:   35개 빈칸
        medium: 45개 빈칸
        hard:   55개 빈칸
  → 상태 리셋:
      board = puzzle 복사
      notes = 81개 빈 Set 초기화
      selectedCell = null
      errors = 0
      hintsUsed = 0
      timer = 0
      history = []
      historyIndex = -1
      gameStatus = 'playing'
```

### 2. 셀 선택
```
[사용자] 셀 클릭 또는 방향키 입력
  → dispatch({ type: 'SELECT_CELL', payload: { row, col } })
  → selectedCell = [row, col] 업데이트
  → 렌더링 시 자동으로 하이라이트 계산:
      같은 숫자 셀  → 옅은 파란색 배경
      같은 행/열    → 매우 옅은 회색 배경
      같은 3x3 박스 → 매우 옅은 회색 배경
      선택된 셀     → 파란색 배경 (가장 강조)
```

### 3. 숫자 입력
```
[사용자] 키보드 1-9 누르기 또는 숫자 패드 클릭
  → dispatch({ type: 'INPUT_NUMBER', payload: { number } })

  [조건 검사]
  1. selectedCell이 null이면 무시
  2. puzzle[row][col] !== 0이면 (고정값) 무시

  [메모 모드 ON인 경우]
  → notes[row][col]에 number가 있으면 제거, 없으면 추가 (토글)
  → board 변경 없음

  [메모 모드 OFF인 경우]
  → 히스토리 스냅샷 저장: history.push({ board 복사, notes 복사 })
  → historyIndex++
  → board[row][col] = number 업데이트
  → notes[row][col] = new Set() (메모 초기화)
  → validateCell(row, col, number) 호출:
      같은 행/열/박스에 동일 숫자가 있으면 → errors++ (오류 표시)
      solution[row][col] === number이면 → 정상 입력
  → checkWin() 호출:
      board가 solution과 완전히 일치하면 → dispatch WIN_GAME
```

### 4. 셀 지우기
```
[사용자] Erase 버튼 클릭 또는 Delete/Backspace 키
  → dispatch({ type: 'ERASE_CELL' })
  → selectedCell이 null 또는 고정값이면 무시
  → 히스토리 스냅샷 저장
  → board[row][col] = 0
  → notes[row][col] = new Set()
```

### 5. 힌트 사용
```
[사용자] Hint 버튼 클릭
  → dispatch({ type: 'USE_HINT' })
  → selectedCell이 null이면 무시
  → board[row][col]이 이미 채워져 있으면 무시
  → hintsUsed >= maxHints(3)이면 무시 (힌트 소진)
      → Hint 버튼 비활성화 표시: "힌트 0/3 남음"
  → 히스토리 스냅샷 저장
  → board[row][col] = solution[row][col]
  → notes[row][col] = new Set()
  → hintsUsed++
  → checkWin() 호출
```

### 6. Undo / Redo
```
[사용자] Undo 버튼 클릭 또는 Ctrl+Z
  → dispatch({ type: 'UNDO' })
  → historyIndex <= 0이면 무시 (더 되돌릴 내역 없음)
  → historyIndex--
  → board = history[historyIndex].board 복원 (깊은 복사)
  → notes = history[historyIndex].notes 복원 (깊은 복사)

[사용자] Redo 버튼 클릭 또는 Ctrl+Y
  → dispatch({ type: 'REDO' })
  → historyIndex >= history.length - 1이면 무시
  → historyIndex++
  → board = history[historyIndex].board 복원
  → notes = history[historyIndex].notes 복원
```

### 7. 타이머
```
[useTimer 훅] gameStatus === 'playing'인 동안
  → setInterval로 1초마다 dispatch({ type: 'TICK_TIMER' })
  → timer += 1
  → gameStatus가 'won' 또는 'paused'가 되면 interval 정리
```

### 8. 승리 감지
```
[checkWin 유틸 함수] INPUT_NUMBER, USE_HINT 후 자동 호출
  → 모든 board[row][col]이 solution[row][col]과 일치하는지 확인
  → true이면 dispatch({ type: 'WIN_GAME' })
  → gameStatus = 'won'
  → WinModal 렌더링 (경과 시간, 오류 횟수, 난이도 표시)
```

---

## 유틸 함수 (`src/utils/sudokuAlgorithms.ts`)

```typescript
// 빈 9x9 보드 생성
createEmptyBoard(): number[][]

// 빈 메모 배열 초기화 (9x9 Set 배열)
createEmptyNotes(): Set<number>[][]

// 특정 셀에 숫자를 놓을 수 있는지 검사 (행/열/박스 확인)
isValidPlacement(board: number[][], row: number, col: number, num: number): boolean

// 완전한 스도쿠 보드 생성 (백트래킹)
generateSolvedBoard(): number[][]

// 난이도에 따라 셀 제거하여 퍼즐 생성 (유일해 보장)
generatePuzzle(difficulty: Difficulty): { puzzle: number[][], solution: number[][] }

// 현재 보드가 정답과 일치하는지 확인
checkWin(board: number[][], solution: number[][]): boolean

// 특정 셀에 입력한 숫자가 유효한지 확인 (오류 여부)
isValidCell(board: number[][], solution: number[][], row: number, col: number): boolean

// 보드의 모든 셀이 정답과 일치하면서 유효한지 확인
isBoardValid(board: number[][], solution: number[][]): boolean
```

---

## 디자인 토큰 (`tailwind.config.js`)

```javascript
colors: {
  // 배경
  'sudoku-bg': '#f8fafc',          // 전체 배경 (slate-50)
  'grid-bg': '#ffffff',             // 그리드 배경

  // 셀 하이라이트
  'cell-selected': '#bfdbfe',       // 선택된 셀 (blue-200)
  'cell-related': '#f1f5f9',        // 같은 행/열/박스 (slate-100)
  'cell-samenumber': '#dbeafe',     // 같은 숫자 (blue-100)
  'cell-error': '#fee2e2',          // 오류 셀 (red-100)

  // 텍스트
  'number-given': '#1e293b',        // 초기 주어진 숫자 (slate-800, bold)
  'number-input': '#2563eb',        // 사용자 입력 숫자 (blue-600)
  'number-error': '#dc2626',        // 오류 숫자 (red-600)
  'number-note': '#94a3b8',         // 메모 숫자 (slate-400, small)

  // 테두리
  'border-box': '#334155',          // 3x3 박스 구분선 (slate-700)
  'border-cell': '#cbd5e1',         // 일반 셀 구분선 (slate-300)
}
```

---

## 컴포넌트 상세 설계

### 원자 단위 (Atoms)
- **NumberButton**: 1-9 숫자 버튼 (완성된 숫자는 비활성화)
- **IconButton**: 제어 버튼 (Undo, Redo, Hint, Erase)
- **TimerDisplay**: MM:SS 형식 타이머
- **DifficultyBadge**: 난이도 표시 (쉬움/보통/어려움)

### 분자 단위 (Molecules)
- **SudokuCell**: 단일 셀 렌더링
  - 값이 있으면: 큰 숫자 표시
  - 메모가 있으면: 3x3 미니 그리드로 메모 표시
  - 배경색: selected > sameNumber > related > default
  - 초기값은 굵은 검은색, 오류는 빨간색, 정상은 파란색
- **NumberPad**: 1-9 숫자 패드 + Erase
- **GameControls**: Undo/Redo/Hint/Notes 토글 버튼

### 유기체 단위 (Organisms)
- **SudokuGrid**: 9x9 CSS Grid
  - 3x3 박스 테두리를 위해 동적 테두리 스타일
  - 셀의 하이라이트 상태 계산 및 전달
- **GameHeader**: 타이머 + 난이도 배지 + 새 게임 버튼
- **GameContainer**: 그리드 + 제어판 레이아웃 조합
- **WinModal**: 승리 시 축하 메시지 + 통계 표시

### 페이지
- **SudokuGamePage**: 키보드 이벤트 처리
  - 방향키: 셀 이동
  - 1-9: 숫자 입력
  - Delete/Backspace: 셀 지우기
  - Ctrl+Z: Undo
  - Ctrl+Y: Redo
  - N: 메모 모드 토글
  - H: 힌트 사용
- **AskDifficultyModal**: 난이도 선택 모달

---

## 레이아웃 구조

```
┌─────────────────────────────────────┐
│  GameHeader                          │
│  [⏱️ 타이머] [난이도] [🆕 새 게임] │
├─────────────┬───────────────────────┤
│             │  GameControls         │
│ SudokuGrid  │  [↶] [↷]             │
│  (9x9)      │  [💡] [✏️]           │
│             ├───────────────────────┤
│             │  NumberPad            │
│             │  [1][2][3]            │
│             │  [4][5][6]            │
│             │  [7][8][9][X]         │
└─────────────┴───────────────────────┘
```

---

## 실행 및 빌드

### 개발 서버 실행
```bash
npm run dev
# 또는 기존에 백그라운드로 실행 중인 경우
# http://localhost:5173 에서 확인
```

### 프로덕션 빌드
```bash
npm run build
# dist/ 폴더에 최적화된 파일 생성
# 번들 크기: ~50KB (gzip)
```

### 빌드 결과 미리보기
```bash
npm run preview
```

---

## 키보드 단축키

| 단축키 | 기능 |
|--------|------|
| ↑↓←→ | 셀 이동 |
| 1-9 | 숫자 입력 |
| Delete / Backspace | 셀 지우기 |
| Ctrl+Z (Cmd+Z Mac) | 실행 취소 |
| Ctrl+Y (Cmd+Y Mac) | 다시 실행 |
| N | 메모 모드 토글 |
| H | 힌트 사용 |

---

## 검증 방법

### ✅ 기능 테스트 완료
1. **개발 서버 실행**: `npm run dev` → 브라우저에서 동작 확인
2. **난이도별 게임**: 쉬움/보통/어려움 난이도 선택 후 생성 확인
3. **셀 입력**: 키보드 및 마우스 입력 모두 정상
4. **오류 표시**: 중복 숫자 입력 시 빨간색 하이라이트 확인
5. **메모 모드**: N 키로 토글, 3x3 그리드 메모 표시 확인
6. **Undo/Redo**: 입력 히스토리 제대로 관리됨
7. **힌트**: 3회 제한, 남은 횟수 표시 확인
8. **승리**: 완성 시 축하 모달 표시 + 통계 확인
9. **빌드**: `npm run build` → 빌드 성공, 크기 50KB (gzip)

---

## 구현 완료 일시

- **구현 시작**: 2026-03-04
- **구현 완료**: 2026-03-04
- **빌드 상태**: ✅ 성공
- **개발 서버**: ✅ 실행 중 (포트 5173)

---

## 다음 단계 (선택사항)

1. **통계 저장**: localStorage에 최고 기록 저장
2. **난이도 통계**: 난이도별 최단 시간 기록
3. **테마 지원**: 다크 모드 추가
4. **음향 효과**: 입력 및 승리 음향 추가
5. **게임 난이도 미세 조정**: 더 도전적인 퍼즐 생성
6. **모바일 최적화**: 터치 제스처 지원
