import { useEffect, useRef } from 'react';

export default function useDrawMaze(maze: number[][]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 1;
    canvas.width = maze[0].length * cellSize;
    canvas.height = maze.length * cellSize;

    ctx.imageSmoothingEnabled = false;

    // 미로 그리기
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        ctx.fillStyle = cell === 1 ? '#333' : '#fff';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      });
    });
  }, [maze]);

  return canvasRef;
}
