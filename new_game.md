# 새 게임 버튼 → 난이도 선택 화면으로 이동하기

## 목표

"새 게임" 버튼 클릭 시 같은 난이도로 즉시 재시작되는 것을 바꿔서,
난이도 선택 모달(`AskDifficultyModal`)이 다시 표시되도록 한다.

---

## 핵심 아이디어

`SudokuGamePage.tsx`에는 이미 다음 로직이 있다:

```tsx
// src/pages/SudokuGamePage.tsx (약 153번 줄)
{state.gameStatus === 'idle' && (
  <AskDifficultyModal ... />
)}
```

즉, **`gameStatus`를 `'idle'`로 되돌리기만 하면** 모달이 자동으로 표시된다.

---

## Step 1: 액션 타입 추가

**파일:** `src/types/sudoku.ts`

**현재 코드 (58번 줄):**
```ts
  | { type: 'WIN_GAME' };
```

**변경 후:**
```ts
  | { type: 'WIN_GAME' }
  | { type: 'RESET_GAME' };
```

> **왜?** Reducer는 `dispatch`로 보낸 액션 타입만 처리할 수 있다.
> TypeScript에서 `SudokuAction` 유니온 타입에 새 액션을 먼저 등록해야
> 다른 파일에서 타입 에러 없이 사용할 수 있다.

---

## Step 2: Reducer에 케이스 추가

**파일:** `src/hooks/useSudokuReducer.ts`

**현재 코드 (약 333번 줄):**
```ts
    case 'WIN_GAME': {
      return {
        ...state,
        gameStatus: 'won',
      };
    }

    default:
      return state;
```

**변경 후:**
```ts
    case 'WIN_GAME': {
      return {
        ...state,
        gameStatus: 'won',
      };
    }

    // 게임 초기화 - 난이도 선택 모달로 돌아감
    case 'RESET_GAME': {
      return getInitialState();
    }

    default:
      return state;
```

> **왜?** `getInitialState()`는 이 파일 17번 줄에 이미 정의된 함수로,
> `gameStatus: 'idle'`을 포함한 초기 상태를 반환한다.
> 새로 만들 필요 없이 재사용하면 된다.

---

## Step 3: 핸들러 변경

**파일:** `src/pages/SudokuGamePage.tsx`

**현재 코드 (약 171번 줄):**
```tsx
onNewGame={() => {
  // 간단하게 처리하기 위해 새로운 게임을 바로 시작
  dispatch({
    type: 'START_GAME',
    payload: { difficulty: state.difficulty },
  });
}}
```

**변경 후:**
```tsx
onNewGame={() => {
  // 게임 상태를 idle로 되돌려 난이도 선택 모달 표시
  dispatch({ type: 'RESET_GAME' });
}}
```

> **왜?** `START_GAME`은 같은 난이도로 즉시 재시작한다.
> `RESET_GAME`은 상태를 `idle`로 바꿔서 모달이 뜨게 한다.

---

## Step 4: 잔여 주석 정리 (선택)

**파일:** `src/components/organisms/GameHeader.tsx`

**현재 코드 (9~19번 줄):**
```ts
interface GameHeaderProps {
  timer: number;
  difficulty: Difficulty;
  onNewGame: () => void;
        // {/* 난이도 선택 모달 - 게임 시작 또는 새 게임 시 표시 */}
        // {state.gameStatus === 'idle' && (
        //   <AskDifficultyModal
        //     ...
        //   />
        // )}
}
```

**변경 후:**
```ts
interface GameHeaderProps {
  timer: number;
  difficulty: Difficulty;
  onNewGame: () => void;
}
```

> **왜?** 인터페이스 블록 안에 들어간 주석은 여기 있을 이유가 없다.
> 다른 파일에서 복사하다 잘못 붙여넣은 것으로, 혼란을 주므로 제거한다.

---

## 데이터 흐름 요약

```
버튼 클릭
  └─ dispatch({ type: 'RESET_GAME' })
       └─ Reducer: getInitialState() 반환
            └─ state.gameStatus = 'idle'
                 └─ SudokuGamePage: 'idle'일 때 <AskDifficultyModal> 렌더
```

---

## 검증 방법

1. `npm run dev` 실행
2. 난이도 선택 후 게임 시작
3. 게임 중 "🆕 새 게임" 버튼 클릭 → 난이도 선택 모달이 표시되어야 함
4. 다른 난이도 선택 → 새 난이도로 게임 시작되어야 함
5. 승리 모달의 "다시 플레이" 버튼 → 기존과 동일하게 동작해야 함
   (`START_GAME`을 사용하므로 영향 없음)
