import React, { useState } from 'react';
import './Calculator.css';

/*
  계산기 컴포넌트입니다.

  이 컴포넌트는 React의 "함수형 컴포넌트"입니다.
  함수형 컴포넌트는 보통의 함수처럼 보이지만 JSX를 반환하는 컴포넌트입니다.

  React.FC 의미:
  - FC = Functional Component (함수형 컴포넌트)
  - TypeScript에 이것이 React 컴포넌트라고 알려줍니다
*/
const Calculator: React.FC = () => {
  /*
    ===== 상태(State) 설명 =====

    상태란 컴포넌트가 기억하고 있는 정보입니다.
    상태가 변하면 React가 화면을 자동으로 다시 그려줍니다.

    useState(초기값)는 다음을 반환합니다:
    - [현재값, 값을변경하는함수]
  */

  /*
    display: 계산기 화면에 보이는 값

    예시:
    - 사용자가 "5"를 누르면 display = "5"
    - 사용자가 "7"을 누르면 display = "57"
    - 계산 결과 = "12"

    초기값: "0" (화면에 처음부터 "0"을 보여줍니다)
    타입: string (문자열 - 숫자처럼 보이지만 텍스트입니다)
  */
  const [display, setDisplay] = useState<string>('0');

  /*
    previousValue: 첫 번째 숫자를 기억하고 있습니다.

    예시: "5 + 3 =" 할 때
    - 사용자가 "5" 입력 → previousValue = 5
    - 사용자가 "+" 누름 → display 초기화
    - 사용자가 "3" 입력 → previousValue = 5 (유지됨)
    - 사용자가 "=" 누름 → 5 + 3 = 8 계산

    초기값: null (아직 숫자를 누르지 않았으므로 없음)
    타입: number | null (숫자 또는 없음)
  */
  const [previousValue, setPreviousValue] = useState<number | null>(null);

  /*
    operator: 사용자가 선택한 연산자를 기억합니다.

    예시: "5 + 3 =" 할 때
    - 사용자가 "5" 입력
    - 사용자가 "+" 누름 → operator = '+'
    - 사용자가 "3" 입력
    - 사용자가 "=" 누름 → '+' 연산자를 사용해서 5 + 3 계산

    초기값: null (아직 연산자를 누르지 않았으므로 없음)
    타입: string | null (연산자 문자 또는 없음)
  */
  const [operator, setOperator] = useState<string | null>(null);

  /*
    waitingForOperand: "다음에 입력할 숫자가 새로운 숫자인가?"를 표시합니다.

    예시: "5 + 3 =" 할 때
    - 사용자가 "5" 입력 → waitingForOperand = false
    - 사용자가 "+" 누름 → waitingForOperand = true (다음 입력은 새 숫자라는 뜻)
    - 사용자가 "3" 입력 → display = "3" (기존 "5"가 아니라 새로 "3"으로 시작)

    왜 필요할까?
    "5 + 33 =" 하고 싶다면, "+" 누른 후 "3"을 누르면 display = "3"이어야 합니다.
    만약 이 플래그가 없으면 display = "53"이 되어 잘못됩니다.

    초기값: false (처음에는 새 숫자가 아닙니다)
    타입: boolean (참/거짓)
  */
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  /*
    숫자 버튼(0~9)을 클릭했을 때 실행되는 함수입니다.

    동작 원리:
    1. 연산자를 누른 직후라면: "새로운 숫자 입력 시작"
    2. 그렇지 않다면: "기존 숫자에 붙이기"

    예시 1: "5" 누른 후 "+" 누른 후 "3" 누르기
    - waitingForOperand = true ("+를 눌렀으므로)
    - setDisplay("3") 실행 → display = "3"
    - 결과: display = "3" (맞습니다!)

    예시 2: "5" 누른 후 "3" 누르기 (연산자 없이)
    - waitingForOperand = false
    - display = "5" + "3" = "53"
    - 결과: display = "53" (맞습니다!)

    예시 3: 계산기 시작해서 "5" 누르기
    - display = "0" (초기값)
    - "0" === "0" ? "5" : "0" + "5"
    - "0"을 새로운 "5"로 바꾸기 (0이 없어져야 깔끔합니다)
    - 결과: display = "5" (맞습니다!)
  */
  const handleNumberClick = (num: string) => {
    // 조건 1: 새로운 숫자를 입력해야 하는가?
    if (waitingForOperand) {
      // 그렇다면 → display를 새 숫자로 설정
      setDisplay(num);
      // 다음은 새 숫자가 아니므로 플래그 변경
      setWaitingForOperand(false);
    } else {
      // 조건 2: 새로운 숫자가 아니라면
      // display가 "0"인가? (초기값)
      if (display === '0') {
        // "0"을 새 숫자로 바꾸기
        setDisplay(num);
      } else {
        // 기존 숫자에 새 숫자 붙이기
        setDisplay(display + num);
      }
    }
  };

  /*
    소수점(.) 버튼을 클릭했을 때 실행되는 함수입니다.

    주의사항:
    - "3.14"는 맞지만, "3.14.15"는 틀렸습니다!
    - 소수점을 한 번만 추가해야 합니다.

    동작:
    1. 이미 소수점이 있으면 → 추가하지 않음
    2. 새 숫자 입력이면 → "0."으로 시작
    3. 기존 숫자이면 → 소수점 추가

    예시: "5." 만들기
    - display = "5", "." 버튼 누르기
    - display = "5" + "." = "5."
  */
  const handleDecimal = () => {
    // 안전 장치: 이미 소수점이 있으면 중단
    if (display.includes('.')) {
      return;  // 함수 종료 (아무것도 하지 않음)
    }

    // 새로운 숫자를 입력하는 상황인가?
    if (waitingForOperand) {
      // "0.5" 이런 식으로 시작할 수 있도록
      setDisplay('0.');
      setWaitingForOperand(false);
    } else {
      // 기존 숫자에 소수점 붙이기
      setDisplay(display + '.');
    }
  };

  /*
    연산자(+, -, *, /) 버튼을 클릭했을 때 실행되는 함수입니다.

    가장 복잡한 함수이므로 단계별로 설명합니다:

    경우 1: "5 + 3 +"를 누르는 경우
    - previousValue = 5 (저장됨)
    - operator = "+" (저장됨)
    - 새로운 연산자 "+"를 누름
    → "5 + 3"을 먼저 계산 (= 8), 그 결과를 다음 계산의 첫 번째 숫자로 사용
    → display = "8", previousValue = 8, operator = "+"

    경우 2: "5 +"를 누르는 경우 (숫자를 하나만 입력)
    - previousValue = null
    - operator = null
    - 연산자 "+"를 누름
    → 그냥 현재 숫자(5)를 저장, 다음 숫자 입력 대기
    → display = "5" (유지), previousValue = 5, operator = "+"

    이것이 "연속 계산"입니다. 계산기는 "=" 없이도 계산할 수 있습니다.
  */
  const handleOperator = (nextOperator: string) => {
    // Step 1: display의 숫자를 JavaScript 숫자로 변환
    // parseFloat("5") → 5, parseFloat("3.14") → 3.14
    const inputValue = parseFloat(display);

    // Step 2: 연속 계산 확인
    // 조건:
    // - previousValue가 null이 아님 (첫 번째 숫자가 있음)
    // - operator가 null이 아님 (연산자가 있음)
    // - waitingForOperand가 false (새로 입력한 숫자가 있음)
    if (previousValue !== null && operator && !waitingForOperand) {
      // 3가지 조건이 모두 참이면 → 지금 계산 수행!
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));      // 결과를 화면에 표시
      setPreviousValue(result);        // 다음 계산을 위해 결과 저장
    } else {
      // 위 조건이 아니면 → 지금은 계산하지 않고 저장만 함
      setPreviousValue(inputValue);    // 현재 입력값을 저장
    }

    // Step 3: 새로운 연산자 설정
    setOperator(nextOperator);
    // Step 4: 다음 숫자 입력 준비
    setWaitingForOperand(true);  // 다음은 새로운 숫자다!
  };

  /*
    두 숫자와 연산자를 받아서 계산한 결과를 반환하는 "도우미 함수"입니다.

    매개변수:
    - prev: 이전 숫자 (첫 번째 숫자)
    - current: 현재 숫자 (두 번째 숫자)
    - op: 연산자 ("+", "-", "*", "/")

    반환값: 계산 결과 (숫자)

    예시:
    - calculate(5, 3, "+") → 5 + 3 = 8 반환
    - calculate(10, 2, "/") → 10 / 2 = 5 반환

    switch-case:
    switch는 여러 경우를 처리할 때 사용합니다.
    "op가 무엇인가?"에 따라 다른 계산을 합니다.
  */
  const calculate = (prev: number, current: number, op: string): number => {
    // op(연산자)가 무엇인지 확인
    switch (op) {
      case '+':
        return prev + current;  // 덧셈
      case '-':
        return prev - current;  // 뺄셈
      case '*':
        return prev * current;  // 곱셈
      case '/':
        // 나눗셈 - 특별한 경우 처리
        // 0으로 나누면 에러가 발생하므로 미리 방지합니다
        return current === 0 ? 0 : prev / current;
        // 의미: current가 0이면 0 반환, 아니면 prev / current 계산
      default:
        // switch의 모든 case에 해당하지 않으면
        return current;  // current만 반환 (오류 방지)
    }
  };

  /*
    등호(=) 버튼을 클릭했을 때 실행되는 함수입니다.
    이 함수는 "실제 계산을 수행하고 모든 상태를 초기화"합니다.

    동작:
    1. "5 + 3 =" → 8을 계산하고 display = "8"로 표시
    2. 모든 상태 초기화 (다시 계산하려면 처음부터 시작)
    3. 다음 숫자 입력 대기

    예시: "5 + 3 =" 계산
    - previousValue = 5 (저장됨)
    - operator = "+" (저장됨)
    - display = "3" (입력됨)
    - "=" 누르기
    → 5 + 3 = 8 계산
    → display = "8" 표시
    → previousValue = null, operator = null (초기화)
  */
  const handleEquals = () => {
    // 필수 조건: previousValue와 operator가 모두 있어야 함
    if (previousValue !== null && operator) {
      // display에 있는 두 번째 숫자를 가져옴
      const inputValue = parseFloat(display);

      // 계산 수행
      const result = calculate(previousValue, inputValue, operator);

      // 결과를 화면에 표시
      setDisplay(String(result));

      // 모든 상태 초기화 (다음 계산을 위해)
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);  // 다음은 새로운 숫자부터 시작
    }
  };

  /*
    초기화 버튼 (C = Clear)을 클릭했을 때 실행되는 함수입니다.
    이 버튼은 계산기를 완전히 "리셋"시킵니다.

    동작: 모든 것을 초기 상태로 돌리기
    - display = "0"
    - previousValue = null (저장된 숫자 지우기)
    - operator = null (저장된 연산자 지우기)
    - waitingForOperand = false (처음부터 시작)

    예시:
    - "5 + 3 + 7"을 입력 중인데 "C" 누르기
    → 모두 무시되고 display = "0"
  */
  const handleClear = () => {
    // 모든 상태를 초기값으로 되돌림
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  /*
    백스페이스(←) 버튼을 클릭했을 때 실행되는 함수입니다.
    마지막에 입력한 숫자 하나를 지웁니다.

    동작:
    - "123" 입력 후 백스페이스 누르기 → "12"
    - "12" 입력 후 백스페이스 누르기 → "1"
    - "1" 입력 후 백스페이스 누르기 → "0"

    String.slice(0, -1) 의미:
    - slice(시작, 끝) = 문자열의 일부를 추출
    - 0 = 처음부터
    - -1 = 마지막 글자 제외
    - "123".slice(0, -1) → "12"
  */
  const handleBackspace = () => {
    // 마지막 문자를 제거한 새로운 문자열 만들기
    const newDisplay = display.slice(0, -1);

    // 만약 모든 글자가 제거되면 "0" 표시 (계산기는 빈 화면을 보여주면 안됨)
    setDisplay(newDisplay === '' ? '0' : newDisplay);
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        {/* 계산기 제목 */}
        <h1 className="calculator-title">계산기</h1>

        {/* 계산 결과를 보여주는 화면 */}
        <div className="display">
          <input
            type="text"
            value={display}
            readOnly
            className="display-input"
          />
        </div>

        {/*
          계산기 버튼들의 레이아웃입니다.

          전체 구조:
          ┌─────────────────┬──────────────────┐
          │  왼쪽(숫자패드)  │  오른쪽(연산자)  │
          │                 │                  │
          │ C   ←           │                  │
          │ 7   8   9       │  ÷               │
          │ 4   5   6       │  ×               │
          │ 1   2   3       │  −               │
          │ 0   .           │  +               │
          │                 │  =               │
          └─────────────────┴──────────────────┘

          왼쪽: 함수 버튼(C, ←) + 숫자 버튼(0-9, .)
          오른쪽: 연산자 버튼(÷, ×, −, +, =)
        */}
        <div className="buttons-container">

          {/* ===== 왼쪽 섹션: 함수 + 숫자 패드 ===== */}
          <div className="buttons-left">

            {/*
              표준 숫자 패드 배치 (1-9, 0):

              [C]  [←]  [ ]   <- 첫 번째 행 (함수 버튼)
              [1]  [2]  [3]   <- 두 번째 행
              [4]  [5]  [6]   <- 세 번째 행
              [7]  [8]  [9]   <- 네 번째 행
              [0]  [.]  [ ]   <- 다섯 번째 행

              특징:
              - 1을 두 번째 행 첫 번째 칸으로 이동
              - 숫자 1-9가 123 / 456 / 789 순서로 정렬
              - 첫 번째 행 3번째와 마지막 행 3번째는 공백
            */}
            <button className="btn btn-function" onClick={handleClear}>
              C
            </button>
            <button className="btn btn-function" onClick={handleBackspace}>
              ←
            </button>
            {/*
              빈 칸 자리표시자(placeholder)입니다.
              CSS Grid는 빈 칸을 자동으로 건너뛰지 않습니다.
              이 빈 div가 없으면 1번 버튼이 첫 행 3번째 칸으로 올라갑니다.
              빈 div를 추가해서 1번이 두 번째 행으로 내려가도록 합니다.
            */}
            <div />

            {/* 두 번째 행: 1, 2, 3 */}
            <button className="btn" onClick={() => handleNumberClick('1')}>
              1
            </button>
            <button className="btn" onClick={() => handleNumberClick('2')}>
              2
            </button>
            <button className="btn" onClick={() => handleNumberClick('3')}>
              3
            </button>

            {/* 세 번째 행: 4, 5, 6 */}
            <button className="btn" onClick={() => handleNumberClick('4')}>
              4
            </button>
            <button className="btn" onClick={() => handleNumberClick('5')}>
              5
            </button>
            <button className="btn" onClick={() => handleNumberClick('6')}>
              6
            </button>

            {/* 네 번째 행: 7, 8, 9 */}
            <button className="btn" onClick={() => handleNumberClick('7')}>
              7
            </button>
            <button className="btn" onClick={() => handleNumberClick('8')}>
              8
            </button>
            <button className="btn" onClick={() => handleNumberClick('9')}>
              9
            </button>

            {/* 다섯 번째 행: 0, . */}
            <button
              className="btn btn-zero"
              onClick={() => handleNumberClick('0')}
            >
              0
            </button>
            <button className="btn" onClick={handleDecimal}>
              .
            </button>
            {/* 다섯 번째 행의 3번째 칸: 자동으로 비워집니다 */}
          </div>

          {/* ===== 오른쪽 섹션: 연산자 ===== */}
          <div className="buttons-right">

            {/* 나누기 */}
            <button
              className="btn btn-operator"
              onClick={() => handleOperator('/')}
            >
              ÷
            </button>

            {/* 곱하기 */}
            <button
              className="btn btn-operator"
              onClick={() => handleOperator('*')}
            >
              ×
            </button>

            {/* 빼기 */}
            <button
              className="btn btn-operator"
              onClick={() => handleOperator('-')}
            >
              −
            </button>

            {/* 더하기 */}
            <button
              className="btn btn-operator"
              onClick={() => handleOperator('+')}
            >
              +
            </button>

            {/* 등호 */}
            <button
              className="btn btn-equals"
              onClick={handleEquals}
            >
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
