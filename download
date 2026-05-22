
import { Ball, Wall, Obstacle, Point, Vector } from './types';

export const FRICTION = 0.985;
export const MIN_SPEED = 0.1;
export const WALL_BOUNCE = 0.7;

export function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export function normalize(v: Vector): Vector {
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function reflect(vel: Vector, normal: Vector): Vector {
  const dot = vel.x * normal.x + vel.y * normal.y;
  return {
    x: (vel.x - 2 * dot * normal.x) * WALL_BOUNCE,
    y: (vel.y - 2 * dot * normal.y) * WALL_BOUNCE
  };
}

export function closestPointOnSegment(p: Point, a: Point, b: Point): Point {
  const ap = { x: p.x - a.x, y: p.y - a.y };
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const ab2 = ab.x * ab.x + ab.y * ab.y;
  const ap_ab = ap.x * ab.x + ap.y * ab.y;
  let t = ap_ab / ab2;
  t = Math.max(0, Math.min(1, t));
  return { x: a.x + ab.x * t, y: a.y + ab.y * t };
}

export function resolveWallCollision(ball: Ball, wall: Wall): boolean {
  const closest = closestPointOnSegment(ball.pos, { x: wall.x1, y: wall.y1 }, { x: wall.x2, y: wall.y2 });
  const dist = getDistance(ball.pos, closest);

  if (dist < ball.radius) {
    const normal = normalize({ x: ball.pos.x - closest.x, y: ball.pos.y - closest.y });
    
    // Correct position
    ball.pos.x = closest.x + normal.x * ball.radius;
    ball.pos.y = closest.y + normal.y * ball.radius;

    // Reflect velocity
    ball.vel = reflect(ball.vel, normal);
    return true;
  }
  return false;
}

export function resolveObstacleCollision(ball: Ball, obstacle: Obstacle): boolean {
  if (obstacle.type === 'circle') {
    const dist = getDistance(ball.pos, { x: obstacle.x, y: obstacle.y });
    const minD = ball.radius + (obstacle.radius || 0);
    if (dist < minD) {
      const normal = normalize({ x: ball.pos.x - obstacle.x, y: ball.pos.y - obstacle.y });
      ball.pos.x = obstacle.x + normal.x * minD;
      ball.pos.y = obstacle.y + normal.y * minD;
      ball.vel = reflect(ball.vel, normal);
      return true;
    }
  } else if (obstacle.type === 'rect') {
    const ox = obstacle.x;
    const oy = obstacle.y;
    const ow = obstacle.width || 0;
    const oh = obstacle.height || 0;

    // Closest point on rectangle to ball center
    const closestX = Math.max(ox, Math.min(ball.pos.x, ox + ow));
    const closestY = Math.max(oy, Math.min(ball.pos.y, oy + oh));

    const distX = ball.pos.x - closestX;
    const distY = ball.pos.y - closestY;
    const distSq = distX * distX + distY * distY;

    if (distSq < ball.radius * ball.radius) {
      const dist = Math.sqrt(distSq);
      let normal: Vector;
      
      if (dist === 0) {
        // Ball center is inside the rect - find shortest way out
        const dl = ball.pos.x - ox;
        const dr = ox + ow - ball.pos.x;
        const dt = ball.pos.y - oy;
        const db = oy + oh - ball.pos.y;
        const min = Math.min(dl, dr, dt, db);
        if (min === dl) { ball.pos.x = ox - ball.radius; normal = { x: -1, y: 0 }; }
        else if (min === dr) { ball.pos.x = ox + ow + ball.radius; normal = { x: 1, y: 0 }; }
        else if (min === dt) { ball.pos.y = oy - ball.radius; normal = { x: 0, y: -1 }; }
        else { ball.pos.y = oy + oh + ball.radius; normal = { x: 0, y: 1 }; }
      } else {
        normal = { x: distX / dist, y: distY / dist };
        ball.pos.x = closestX + normal.x * ball.radius;
        ball.pos.y = closestY + normal.y * ball.radius;
      }
      
      ball.vel = reflect(ball.vel, normal);
      return true;
    }
  }
  return false;
}
