# Claude Code 효율적 명령 가이드

> 스도쿠 프로젝트 구현 경험 기반으로 정리한 실전 예시 모음

---

## 핵심 원칙

| 원칙 | 나쁜 예 | 좋은 예 |
|------|---------|---------|
| **범위 명확화** | "스도쿠 만들어줘" | "React + TypeScript + Vite로 스도쿠 만들어줘. 외부 게임 라이브러리 없이" |
| **단계 분리** | 전체 기능 한 번에 요청 | 설계 → 프로토타입 → 기능 구현 → 테스트 순서로 나눠서 요청 |
| **제약 명시** | (제약 없음) | "새 파일 최소화, 기존 파일 수정 우선" |
| **검증 포함** | 구현만 요청 | "구현 후 `npm run build`로 빌드 에러 확인해줘" |

---

## 1단계: 프로젝트 설계 명령

### 좋은 예시

```
다음 조건으로 스도쿠 게임 구현 계획을 plan.md에 정리해줘:

기술 스택: React 18, TypeScript 5, Vite 5, Tailwind CSS
상태 관리: useReducer + Context API (외부 상태 라이브러리 없음)
컴포넌트: Atomic Design (atoms/molecules/organisms)
경로 별칭: @/ (tsconfig paths와 vite resolve.alias 동기화)

계획에 포함할 것:
- 디렉토리 구조
- 타입 정의 (types/sudoku.ts)
- Reducer 액션 목록
- 컴포넌트별 props 인터페이스

코드 작성 전 계획만 먼저 보여줘.
```

**왜 좋은가:**
- 코드 없이 계획만 먼저 → 토큰 절약
- 경로 별칭 방식 명시 → `@types` 충돌 같은 에러 사전 방지
- 외부 라이브러리 제한 명시 → 불필요한 의존성 추가 방지

---

## 2단계: 기반 코드 구현 명령

### 좋은 예시

```
plan.md를 참고해서 다음 파일만 먼저 만들어줘:

1. package.json (의존성만, scripts 포함)
2. vite.config.ts (경로 별칭: @/ → src/)
3. tsconfig.json (strict: true, paths는 vite와 동일하게)
4. src/types/sudoku.ts (타입 정의만)
5. src/utils/sudokuAlgorithms.ts (함수 시그니처와 주석만, 구현 없음)

주의: tsconfig paths에 @types는 절대 사용하지 말 것
(TypeScript 내장 @types 폴더와 충돌함)
대신 @/ 또는 @utils/, @components/ 등 사용
```

**왜 좋은가:**
- 파일 목록 제한 → 한 번에 너무 많이 생성하지 않음
- 알려진 실수(`@types` 충돌) 미리 차단
- "구현 없음" 명시로 스텁 파일만 먼저 생성 → 점진적 구현 가능

---

## 3단계: 핵심 로직 구현 명령

### 좋은 예시

```
src/utils/sudokuAlgorithms.ts의 다음 함수를 구현해줘:

1. generateSolvedBoard(): number[][]
   - 백트래킹 알고리즘
   - 숫자 순서 랜덤화 (매번 다른 퍼즐)

2. generatePuzzle(difficulty): { puzzle, solution }
   - easy: 35개 빈칸, medium: 45개, hard: 55개
   - 유일해 보장 필요 없음 (성능 우선)

파일 전체를 교체하지 말고, 해당 함수 부분만 Edit 도구로 수정해줘.
```

**왜 좋은가:**
- 함수 단위로 요청 → 실수 범위 최소화
- "파일 전체 교체 금지" → 기존 코드 손실 방지
- 알고리즘 동작 조건 명시 → 재질문 없이 바로 구현

---

## 4단계: 컴포넌트 구현 명령

### 좋은 예시

```
SudokuCell 컴포넌트를 만들어줘 (src/components/molecules/SudokuCell.tsx)

props:
- row, col: number
- value: number (0이면 빈칸)
- notes: Set<number>
- isGiven, isSelected, isRelated, isSameNumber, isError: boolean

렌더링 규칙:
- value > 0: 큰 숫자 표시 (isGiven=bold slate-800, isError=red-600, 기본=blue-600)
- value === 0 && notes.size > 0: 3x3 미니 그리드로 메모 표시
- 배경 우선순위: isSelected > isSameNumber > isRelated > 기본

CSS: Tailwind만 사용, 인라인 style 최소화
useSudokuContext 직접 import 금지 (props로만 받기)
```

**왜 좋은가:**
- Props 인터페이스 미리 정의 → 타입 에러 방지
- 렌더링 우선순위 명시 → 조건부 클래스 로직 명확
- Context 직접 접근 금지 → 컴포넌트 재사용성 유지

---

## 5단계: 상태 관리 구현 명령

### 좋은 예시

```
src/hooks/useSudokuReducer.ts에서 INPUT_NUMBER 액션 핸들러를 구현해줘.

동작 순서:
1. selectedCell이 null이면 state 반환 (변경 없음)
2. puzzle[row][col] !== 0이면 state 반환 (고정값 보호)
3. isNotesMode가 true면: notes[row][col] Set 토글만
4. 일반 모드:
   a. 히스토리 스냅샷 저장 (board + notes 깊은 복사)
   b. board[row][col] = number
   c. notes[row][col] = new Set()
   d. checkWin() 호출 → true면 gameStatus = 'won'

깊은 복사: JSON.parse(JSON.stringify()) 사용 금지
대신: board.map(row => [...row]) 방식 사용
```

**왜 좋은가:**
- 동작 순서를 번호로 명시 → 조건 누락 방지
- 깊은 복사 방식 지정 → Set은 JSON 직렬화 안 되므로 중요
- 한 액션씩 구현 → 버그 발생 시 범위 좁힘

---

## 6단계: 디버그 및 수정 명령

### 좋은 예시

```
npm run build 실행했더니 다음 에러가 났어:

ERROR: Cannot import type declaration files.
Consider importing 'sudoku' instead of '@types/sudoku'

에러 원인 분석하고, 영향받는 모든 파일에서 import를 수정해줘.
수정 후 변경된 파일 목록만 알려줘.
```

**왜 좋은가:**
- 에러 메시지 전체 붙여넣기 → Claude가 정확한 원인 파악
- "영향받는 모든 파일" 명시 → 하나씩 찾는 비효율 제거
- "변경된 파일 목록만" → 불필요한 코드 설명 출력 억제

---

## 토큰 절약 전략

### 출력 제한 요청

```
# 이렇게 요청하면 출력 토큰 절약됨

"구현만 해줘, 설명은 필요 없어"
"변경된 부분만 보여줘"
"에러 원인과 수정 코드만 보여줘"
"파일 전체 말고 수정된 함수만 보여줘"
```

### 범위 제한 요청

```
# 한 번에 처리할 파일 수 제한

"이번엔 atoms 컴포넌트 3개만 만들어줘"
"utils 파일만 수정해줘, 다른 파일 건드리지 말고"
"SudokuGrid.tsx만 수정해줘"
```

### 점진적 구현 패턴

```
1단계: "기능 없는 프로토타입 만들어줘 (빈 컴포넌트, 타입만)"
2단계: "핵심 로직(알고리즘, reducer) 구현해줘"
3단계: "UI 컴포넌트 구현해줘"
4단계: "연결해줘 (Context에 reducer 연결, 페이지에 컴포넌트 연결)"
5단계: "빌드 에러 수정해줘"
```

---

## 흔한 실수와 예방법

| 실수 | 예방 명령 |
|------|-----------|
| `@types` 경로 별칭 충돌 | "경로 별칭에 `@types` 절대 사용 금지" |
| 불필요한 `import React` | "React 17+ JSX transform 사용, React import 불필요" |
| Set 객체 JSON 복사 오류 | "Set은 spread로 복사: `new Set(original)`" |
| Context 과도한 의존 | "컴포넌트는 props로만 데이터 받기, Context는 페이지에서만" |
| 파일 전체 재작성 | "Edit 도구로 해당 함수만 수정, 파일 전체 Write 금지" |

---

## 이 프로젝트(스도쿠) 전용 참고사항

- **경로 별칭**: `@/` → `src/` (vite.config.ts와 tsconfig.json 동기화 필수)
- **상태 타입**: `src/types/sudoku.ts`에 모든 타입 집중 관리
- **깊은 복사**: notes(Set 배열)는 `notes.map(row => row.map(s => new Set(s)))`
- **하이라이트 계산**: SudokuGrid에서 계산 후 props 전달 (SudokuCell 내부 계산 금지)
- **키보드 이벤트**: SudokuGamePage에서 전역 관리 (`window.addEventListener`)
