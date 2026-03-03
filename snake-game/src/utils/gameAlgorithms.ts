import type { Coordinate } from '@game-types';
import { Direction } from '@game-types';

// 무작위 식량 생성
export const generateRandomFood = (
  gridWidth: number,
  gridHeight: number,
  snake: Coordinate[]
): Coordinate => {
  let newFood: Coordinate;

  // 뱀의 바디와 겹치지 않는 좌표 생성
  do {
    newFood = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

  return newFood;
};

// 뱀 이동 로직
export const moveSnake = (
  snake: Coordinate[],
  currentDirection: Direction,
  nextDirection: Direction
): Coordinate[] => {
  // 반대 방향 입력 방지
  const isOppositeDirection = (current: Direction, next: Direction): boolean => {
    return (
      (current === Direction.UP && next === Direction.DOWN) ||
      (current === Direction.DOWN && next === Direction.UP) ||
      (current === Direction.LEFT && next === Direction.RIGHT) ||
      (current === Direction.RIGHT && next === Direction.LEFT)
    );
  };

  // 다음 방향 결정
  const direction = nextDirection && !isOppositeDirection(currentDirection, nextDirection)
    ? nextDirection
    : currentDirection;

  // 현재 머리 위치
  const head = snake[0];

  // 새로운 머리 위치 계산
  let newHead: Coordinate;
  switch (direction) {
    case Direction.UP:
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case Direction.DOWN:
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case Direction.LEFT:
      newHead = { x: head.x - 1, y: head.y };
      break;
    case Direction.RIGHT:
      newHead = { x: head.x + 1, y: head.y };
      break;
  }

  // 새로운 뱀 몸통 (머리 추가, 꼬리 제거)
  const newSnake = [newHead, ...snake.slice(0, -1)];

  return newSnake;
};

// 충돌 판정 로직
export const checkCollision = (
  snake: Coordinate[],
  gridWidth: number,
  gridHeight: number
): boolean => {
  const head = snake[0];

  // 벽 충돌 체크
  if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
    return true;
  }

  // 자신과 충돌 체크 (머리를 제외한 바디와 비교)
  if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
    return true;
  }

  return false;
};

// 먹이 먹기 판정
export const checkFood = (
  snake: Coordinate[],
  food: Coordinate
): boolean => {
  const head = snake[0];
  return head.x === food.x && head.y === food.y;
};

// 뱀 성장 (꼬리 유지)
export const growSnake = (snake: Coordinate[], head: Coordinate): Coordinate[] => {
  return [head, ...snake];
};
