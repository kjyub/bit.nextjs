export const GameTypes = {
  NONE: 0,
  MAZE: 1,
  HAMMER: 2,
} as const;
export type GameType = (typeof GameTypes)[keyof typeof GameTypes];
export const GameTypeNames = {
  0: '-',
  1: '미로',
  2: '망치',
};
