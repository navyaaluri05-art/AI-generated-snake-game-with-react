/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, CircleAlert } from 'lucide-react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 140;
const SPEED_INCREMENT = 3;
const MIN_SPEED = 50;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      setDirection(nextDirection);

      switch (nextDirection) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 100);
        setFood(generateFood(newSnake));
        setSpeed(prevSpeed => Math.max(MIN_SPEED, prevSpeed - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, isPaused, isGameOver, food, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, speed]);

  return (
    <div className="relative flex flex-col items-center space-y-8">
      <div className="flex items-center space-x-12">
        <div className="text-center">
          <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">NODE_VALUE</span>
          <span className="text-6xl font-digital text-[#00FFFF] drop-shadow-[0_0_15px_#00FFFF] glitch" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="w-1 h-12 bg-white/10" />
        <div className="text-center">
          <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">CELL_DIV</span>
          <span className="text-6xl font-digital text-[#FF00FF] drop-shadow-[0_0_15px_#FF00FF]">
            {Math.floor(score / 500) + 1}
          </span>
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-white shadow-[8px_8px_0px_#FF00FF] overflow-hidden"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        <div className="noise opacity-20 pointer-events-none" />
        
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-5">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white" />
          ))}
        </div>

        {/* Snake Rendering */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`}
            className="absolute"
            style={{
              width: 18,
              height: 18,
              left: segment.x * 20 + 1,
              top: segment.y * 20 + 1,
              background: i === 0 
                ? '#FFFFFF' 
                : i % 2 === 0 ? '#00FFFF' : '#FF00FF',
              boxShadow: i === 0 ? '0 0 20px #FFFFFF' : 'none',
              zIndex: snake.length - i
            }}
          />
        ))}

        {/* Food Rendering */}
        <motion.div
          className="absolute bg-white"
          style={{
            width: 14,
            height: 14,
            left: food.x * 20 + 3,
            top: food.y * 20 + 3,
            boxShadow: '0 0 15px #FFFFFF',
          }}
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div 
              className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaused(false)}
            >
              <Play className="w-16 h-16 text-[#00FFFF] mb-4 animate-pulse" />
              <p className="text-white font-mono text-xs uppercase tracking-[0.5em] glitch" data-text="EXECUTE_CORE_LOOP">EXECUTE_CORE_LOOP</p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div 
              className="absolute inset-0 z-50 bg-[#FF00FF] flex flex-col items-center justify-center p-6 text-black"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <CircleAlert className="w-24 h-24 mb-4" />
              <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-2">SYSTEM_CRASH</h2>
              <p className="font-mono text-sm mb-12 uppercase tracking-widest font-bold">VAL: {score} // SECTOR_LOST</p>
              <button
                onClick={resetGame}
                className="pixel-border bg-white text-black px-12 py-4 font-black uppercase text-xl hover:bg-black hover:text-white transition-colors"
              >
                REBOOT_KERNEL
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-12 font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">
        <div className="flex flex-col items-center gap-2">
          <kbd className="border border-white/20 px-2 py-1">↑↓←→</kbd>
          <span>VECTOR_CTRL</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <kbd className="border border-white/20 px-2 py-1">SPACE</kbd>
          <span>INTERRUPT_REQ</span>
        </div>
      </div>
    </div>
  );
};
