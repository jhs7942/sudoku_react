// 게임판 좌표 타입
export interface Coordinate {
  x: number;
  y: number;
}

// 뱀의 이동 방향
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

// 게임 상태
export enum GameStatus {
  READY = 'READY',        // 게임 준비 중
  PLAYING = 'PLAYING',    // 게임 진행 중
  GAME_OVER = 'GAME_OVER', // 게임 종료
}

// 게임 상태 전체 구조
export interface GameState {
  snake: Coordinate[];        // 뱀의 바디 좌표 배열 [head, ...body]
  food: Coordinate;           // 먹이의 위치
  direction: Direction;       // 현재 이동 방향
  nextDirection: Direction;   // 다음 틱에 적용할 방향
  score: number;             // 현재 점수
  gameState: GameStatus;     // 게임 상태
  highScore: number;         // 최고 점수
  gridWidth: number;         // 게임 그리드 가로 크기 (칸 수)
  gridHeight: number;        // 게임 그리드 세로 크기 (칸 수)
  speed: number;             // 게임 속도 (밀리초 단위)
}

// 게임 액션 타입
export type GameAction =
  | { type: 'INIT_GAME' }
  | { type: 'START_GAME' }
  | { type: 'SET_DIRECTION'; payload: Direction }
  | { type: 'UPDATE_GAME'; payload: { snake: Coordinate[]; score: number; food?: Coordinate } }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' };
