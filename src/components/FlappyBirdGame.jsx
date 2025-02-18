import React, { useRef, useEffect } from 'react';
import { initGame } from '../game/gameEngine';

export default function FlappyBirdGame({ birdColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cleanup = initGame(canvas, birdColor);
    return () => {
      cleanup();
    };
  }, [birdColor]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={600}
      className="border border-gray-700"
    />
  );
}