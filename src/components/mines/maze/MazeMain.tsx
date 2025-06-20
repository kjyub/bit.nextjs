import { use, useState } from 'react';

import MazeCanvas from './MazeCanvas';
import { generateMaze } from './utils';
import { MineContext } from '../MinePlay';

const SIZE = 13;
const ROUND = 3;

interface Props {
  seed: string;
}
export default function MazeMain({ seed }: Props) {
  const [mazes] = useState(() => Array.from({ length: 10 }, (_, i) => generateMaze(seed, i, SIZE)));
  const { round, setRound, onComplete } = use(MineContext);

  const handleEscape = () => {
    if (round < ROUND) {
      setRound(round + 1);
    } else {
      onComplete();
    }
  };

  return <MazeCanvas maze={mazes[round].maze} size={SIZE} onEscape={handleEscape} />;
}