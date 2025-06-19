import { useEffect, useRef, useState } from "react";
import MazePerson from "./MazePerson";
import useDrawMaze from "./useDrawMaze";
import { isCollide, isEscape } from "./utils";

export interface Coord {
  x: number;
  y: number;
}
export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const INITIAL_POSITION: Coord = { x: 0, y: 1 };
const ESCAPE_POSITION: Coord = { x: 12, y: 11 };

interface Props {
  maze: number[][];
  size: number;
  onEscape: () => void;
}
export default function MazeCanvas({ maze, size, onEscape }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useDrawMaze(maze);
  const [position, setPosition] = useState<Coord>(INITIAL_POSITION);
  const [scale, setScale] = useState<number>(1);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const isEscapedRef = useRef<boolean>(false);

  useEffect(() => {
    setPosition(INITIAL_POSITION);
    setIsHolding(false);
    isEscapedRef.current = false;
  }, [maze])

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scale = Math.min(rect.width / size, rect.height / size);
      setScale(scale);
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  const handlePositionMove = (clientCoord: Coord) => {
    if (!isHolding || isEscapedRef.current) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // 포인터 위치에 따라 움직이기 위한 오프셋 적용
    const offsetPointer = { 
      x: (clientCoord.x - rect.left - (scale / 2)) / scale, 
      y: (clientCoord.y - rect.top - (scale / 2)) / scale
    };
    setPosition(offsetPointer);

    // 벽에 충돌하는 등 정확한 좌표를 찾기 위한 오프셋 적용
    const offsetCoord = {
      x: (clientCoord.x - rect.left) / scale, 
      y: (clientCoord.y - rect.top) / scale
    }
    const personColliderOffset = 0.12;
    const personRect: Rect = { 
      left: offsetCoord.x - personColliderOffset, 
      right: offsetCoord.x + personColliderOffset, 
      top: offsetCoord.y - personColliderOffset, 
      bottom: offsetCoord.y + personColliderOffset 
    };
    const isCollided = isCollide(maze, personRect);
    if (isCollided) {
      handleFail();
    }

    const isEscaped = isEscape(personRect, ESCAPE_POSITION);
    if (isEscaped) {
      handleEscape();
    }
  }

  const handleFail = () => {
    setIsHolding(false);
    setPosition(INITIAL_POSITION);
  }

  const handleEscape = () => {
    if (isEscapedRef.current) return;

    isEscapedRef.current = true;
    setIsHolding(false);
    setPosition(ESCAPE_POSITION);
    onEscape();
  }

  return (
    <div ref={containerRef} className="flex flex-center w-full aspect-square rounded-2xl overflow-hidden">
      <div 
        className="relative"
        style={{ zoom: scale }}
        onMouseMove={(e) => handlePositionMove({ x: e.clientX, y: e.clientY })}
        onTouchMove={(e) => handlePositionMove({ x: e.touches[0].clientX, y: e.touches[0].clientY })}
      >
        <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} width={size} height={size} />
        <MazePerson coord={{ x: position?.x ?? 0, y: position?.y ?? 0 }} isHolding={isHolding} setHolding={setIsHolding} />
      </div>
    </div>
  )
};