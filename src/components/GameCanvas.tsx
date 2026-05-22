
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Ball, Level, Point } from '../types';
import { FRICTION, MIN_SPEED, resolveWallCollision, resolveObstacleCollision, getDistance } from '../physics';

interface GameCanvasProps {
  level: Level;
  onHoleIn: (strokes: number) => void;
  onStroke: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ level, onHoleIn, onStroke }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ball, setBall] = useState<Ball>({
    pos: { ...level.startPos },
    vel: { x: 0, y: 0 },
    radius: 8
  });
  const [strokes, setStrokes] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [aimStart, setAimStart] = useState<Point | null>(null);
  const [aimCurrent, setAimCurrent] = useState<Point | null>(null);
  const [isHoleIn, setIsHoleIn] = useState(false);

  const requestRef = useRef<number>(0);

  // Reset ball when level changes
  useEffect(() => {
    setBall({
      pos: { ...level.startPos },
      vel: { x: 0, y: 0 },
      radius: 8
    });
    setStrokes(0);
    setIsMoving(false);
    setIsHoleIn(false);
  }, [level]);

  const update = useCallback(() => {
    if (!isMoving) return;

    setBall((prev: Ball) => {
      const nextBall = { ...prev, pos: { ...prev.pos }, vel: { ...prev.vel } };
      
      // Update position
      nextBall.pos.x += nextBall.vel.x;
      nextBall.pos.y += nextBall.vel.y;

      // Friction
      nextBall.vel.x *= FRICTION;
      nextBall.vel.y *= FRICTION;

      // Stop if slow
      if (Math.abs(nextBall.vel.x) < MIN_SPEED && Math.abs(nextBall.vel.y) < MIN_SPEED) {
        nextBall.vel = { x: 0, y: 0 };
        setIsMoving(false);
      }

      // Check hole
      const distToHole = getDistance(nextBall.pos, level.hole.pos);
      if (distToHole < level.hole.radius + 2) {
        // Simple gravity effect towards hole
        if (distToHole < 8) {
           setIsHoleIn(true);
           setTimeout(() => onHoleIn(strokes), 800);
           return { ...nextBall, vel: {x:0, y:0}, pos: level.hole.pos };
        }
        const force = 0.1;
        const dx = level.hole.pos.x - nextBall.pos.x;
        const dy = level.hole.pos.y - nextBall.pos.y;
        nextBall.vel.x += (dx / distToHole) * force;
        nextBall.vel.y += (dy / distToHole) * force;
      }

      // Collisions
      level.walls.forEach((wall) => resolveWallCollision(nextBall, wall));
      level.obstacles.forEach((obs) => {
        if (obs.type === 'water') {
           const ox = obs.x;
           const oy = obs.y;
           const ow = obs.width || 0;
           const oh = obs.height || 0;
           if (nextBall.pos.x > ox && nextBall.pos.x < ox + ow && nextBall.pos.y > oy && nextBall.pos.y < oy + oh) {
              // Reset to start
              nextBall.pos = { ...level.startPos };
              nextBall.vel = { x: 0, y: 0 };
              setStrokes(s => s + 1);
              setIsMoving(false);
           }
        } else {
          resolveObstacleCollision(nextBall, obs);
        }
      });

      return nextBall;
    });
  }, [isMoving, level, strokes, onHoleIn]);

  const animate = useCallback(() => {
    update();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#2d5a27'; // Grass color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid/pattern
    ctx.strokeStyle = '#3a7232';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for(let i=0; i<canvas.height; i+=40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Draw Walls
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    level.walls.forEach(wall => {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    });

    // Draw Obstacles
    level.obstacles.forEach(obs => {
      if (obs.type === 'water') {
        ctx.fillStyle = '#1e40af'; // Blue water
        ctx.fillRect(obs.x, obs.y, obs.width || 0, obs.height || 0);
        // Add some ripples
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        for(let i=10; i<(obs.width||0); i+=20) {
          ctx.beginPath();
          ctx.moveTo(obs.x + i, obs.y + 10);
          ctx.lineTo(obs.x + i + 10, obs.y + 10);
          ctx.stroke();
        }
      } else if (obs.type === 'rect') {
        ctx.fillStyle = '#795548';
        ctx.fillRect(obs.x, obs.y, obs.width || 0, obs.height || 0);
      } else if (obs.type === 'circle') {
        ctx.fillStyle = '#795548';
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.radius || 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Hole
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(level.hole.pos.x, level.hole.pos.y, level.hole.radius, 0, Math.PI * 2);
    ctx.fill();
    // Inner hole shadow
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Hole Flag
    const hx = level.hole.pos.x;
    const hy = level.hole.pos.y;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx, hy - 40);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(hx, hy - 40);
    ctx.lineTo(hx + 20, hy - 30);
    ctx.lineTo(hx, hy - 20);
    ctx.fill();

    // Draw Ball
    if (!isHoleIn) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      // Ball shadow/detail
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw Aim Line
    if (aimStart && aimCurrent && !isMoving && !isHoleIn) {
      const dx = aimStart.x - aimCurrent.x;
      const dy = aimStart.y - aimCurrent.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const limitedDist = Math.min(dist, 150);
      const powerPct = limitedDist / 150;

      // Slingshot line (showing pull back)
      ctx.beginPath();
      ctx.moveTo(ball.pos.x, ball.pos.y);
      ctx.lineTo(ball.pos.x - (aimCurrent.x - aimStart.x), ball.pos.y - (aimCurrent.y - aimStart.y));
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([2, 4]);
      ctx.stroke();

      // Predicted Direction line
      ctx.beginPath();
      const angle = Math.atan2(dy, dx);
      ctx.moveTo(ball.pos.x, ball.pos.y);
      ctx.lineTo(ball.pos.x + Math.cos(angle) * (limitedDist * 1.5), ball.pos.y + Math.sin(angle) * (limitedDist * 1.5));
      ctx.strokeStyle = powerPct > 0.8 ? '#ef4444' : powerPct > 0.4 ? '#fbbf24' : '#10b981';
      ctx.setLineDash([]);
      ctx.lineWidth = 2 + powerPct * 4;
      ctx.stroke();

      // Power meter indicator around ball
      ctx.beginPath();
      ctx.arc(ball.pos.x, ball.pos.y, ball.radius + 10, -Math.PI/2, -Math.PI/2 + (Math.PI * 2 * powerPct));
      ctx.strokeStyle = powerPct > 0.8 ? '#ef4444' : powerPct > 0.4 ? '#fbbf24' : '#10b981';
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [ball, isMoving, level, aimStart, aimCurrent, update, isHoleIn]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMoving || isHoleIn) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicked near ball
    const dist = getDistance({ x, y }, ball.pos);
    if (dist < 50) {
      setAimStart({ x, y });
      setAimCurrent({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!aimStart) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAimCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    if (!aimStart || !aimCurrent) return;

    const dx = aimStart.x - aimCurrent.x;
    const dy = aimStart.y - aimCurrent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const powerScale = Math.min(dist, 150) / 10;
    
    if (powerScale > 0.5) {
      const angle = Math.atan2(dy, dx);
      setBall(prev => ({
        ...prev,
        vel: {
          x: Math.cos(angle) * powerScale,
          y: Math.sin(angle) * powerScale
        }
      }));
      setStrokes(s => s + 1);
      onStroke();
      setIsMoving(true);
    }

    setAimStart(null);
    setAimCurrent(null);
  };

  return (
    <div className="relative border-4 border-emerald-800 rounded-lg overflow-hidden shadow-2xl bg-emerald-900">
      <canvas
        ref={canvasRef}
        width={level.width}
        height={level.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as any);
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as any);
        }}
        onTouchEnd={handleMouseUp}
        className="cursor-crosshair block mx-auto touch-none"
      />
      
      {/* HUD */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-lg text-white font-bold pointer-events-none">
        <div className="text-xs uppercase opacity-70">Strokes</div>
        <div className="text-2xl">{strokes}</div>
        <div className="text-xs mt-1 uppercase opacity-70">Par {level.par}</div>
      </div>

      {!isMoving && !isHoleIn && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm pointer-events-none animate-pulse">
          Click and drag ball to aim
        </div>
      )}

      {isHoleIn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] pointer-events-none">
          <div className="bg-emerald-500 text-emerald-950 font-black text-4xl px-8 py-4 rounded-2xl shadow-2xl animate-bounce border-4 border-white">
            HOLE IN!
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
