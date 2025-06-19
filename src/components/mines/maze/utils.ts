import seedrandom from 'seedrandom';
import type { Coord, Rect } from './MazeCanvas';

const MazeType = {
  WALL: 1,
  ROAD: 0,
} as const;

type MazeCell = (typeof MazeType)[keyof typeof MazeType];

function shuffle<T>(array: T[], rng: seedrandom.PRNG): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const generateMaze = (seed: string, index: number, size: number) => {
  const rng = seedrandom(`${seed}-${index}`);
  const maze: MazeCell[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => 1));

  const start = { x: 1, y: 1 };
  const end = { x: size - 2, y: size - 2 };

  const carve = (x: number, y: number) => {
    const dirs = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0], // 상하좌우
    ];
    shuffle(dirs, rng);

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;

      if (ny >= 1 && ny < size - 1 && nx >= 1 && nx < size - 1 && maze[ny][nx] === 1) {
        maze[y + dy / 2][x + dx / 2] = 0; // 벽 뚫기
        maze[ny][nx] = 0; // 다음 셀 뚫기
        carve(nx, ny);
      }
    }
  };

  maze[start.y][start.x] = 0;
  carve(start.x, start.y);
  maze[end.y][end.x] = 0;

  // ✅ 외벽에 입구/출구 뚫기
  maze[start.y][start.x - 1] = 0; // 왼쪽 입구
  maze[end.y][end.x + 1] = 0; // 오른쪽 출구

  return { maze, start, end };
};

export const isCollide = (maze: number[][], person: Rect) => {
  // 경계 검사
  if (person.top < 0 || person.bottom >= maze.length || person.left < 0 || person.right >= maze[0].length) {
    return true; // 경계를 벗어나면 충돌로 처리
  }

  // 사각형의 네 모서리와 각 변의 중간점들을 확인
  const checkPoints = [
    // 네 모서리
    { x: person.left, y: person.top },
    { x: person.right, y: person.top },
    { x: person.left, y: person.bottom },
    { x: person.right, y: person.bottom },
    // 각 변의 중간점들
    { x: (person.left + person.right) / 2, y: person.top },
    { x: (person.left + person.right) / 2, y: person.bottom },
    { x: person.left, y: (person.top + person.bottom) / 2 },
    { x: person.right, y: (person.top + person.bottom) / 2 },
  ];

  // 각 점이 벽 안에 있는지 확인
  for (const point of checkPoints) {
    const xIndex = Math.floor(point.x);
    const yIndex = Math.floor(point.y);

    if (maze[yIndex]?.[xIndex] === MazeType.WALL) {
      return true;
    }
  }

  return false;
};

export const isEscape = (person: Rect, escapePosition: Coord) => {
  // 사각형의 네 모서리와 각 변의 중간점들을 확인
  const checkPoints = [
    // 네 모서리
    { x: person.left, y: person.top },
    { x: person.right, y: person.top },
    { x: person.left, y: person.bottom },
    { x: person.right, y: person.bottom },
    // 각 변의 중간점들
    { x: (person.left + person.right) / 2, y: person.top },
    { x: (person.left + person.right) / 2, y: person.bottom },
    { x: person.left, y: (person.top + person.bottom) / 2 },
    { x: person.right, y: (person.top + person.bottom) / 2 },
  ];

  // 각 점이 출구 안에 있는지 확인
  for (const point of checkPoints) {
    const xIndex = Math.floor(point.x);
    const yIndex = Math.floor(point.y);

    if (xIndex === escapePosition.x && yIndex === escapePosition.y) {
      return true;
    }
  }

  return false;
};

export const secondsToTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
