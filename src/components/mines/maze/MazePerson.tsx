import type { Coord } from './MazeCanvas';

interface Props {
  coord: Coord;
  isHolding: boolean;
  setHolding: (isHolding: boolean) => void;
}
export default function MazePerson({ coord, isHolding, setHolding }: Props) {
  return (
    <div
      className="absolute left-0 top-0 z-10 w-[1px] h-[1px] will-change-transform"
      style={{ transform: `translate(${coord.x}px, ${coord.y}px)` }}
    >
      <div className="relative">
        <div className="absolute flex flex-center w-[1px] h-[1px]" style={{ scale: 0.1 }}>
          <div
            className={`min-w-[4px] min-h-[4px] shrink-0 bg-orange-500 rounded-full ${isHolding ? '' : 'animate-bounce'}`}
            onMouseDown={() => setHolding(true)}
            onMouseUp={() => setHolding(false)}
            onTouchStart={() => {
              setHolding(true);
            }}
            onTouchEnd={() => {
              setHolding(false);
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
