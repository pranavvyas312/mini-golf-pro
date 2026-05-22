
import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "The Beginning",
    par: 2,
    startPos: { x: 100, y: 300 },
    hole: { pos: { x: 700, y: 300 }, radius: 15 },
    walls: [
      { x1: 50, y1: 150, x2: 750, y2: 150 },
      { x1: 50, y1: 450, x2: 750, y2: 450 },
      { x1: 50, y1: 150, x2: 50, y2: 450 },
      { x1: 750, y1: 150, x2: 750, y2: 450 },
    ],
    obstacles: [],
    width: 800,
    height: 600
  },
  {
    id: 2,
    name: "The Narrow Pass",
    par: 3,
    startPos: { x: 100, y: 300 },
    hole: { pos: { x: 700, y: 300 }, radius: 15 },
    walls: [
      { x1: 50, y1: 100, x2: 750, y2: 100 },
      { x1: 50, y1: 500, x2: 750, y2: 500 },
      { x1: 50, y1: 100, x2: 50, y2: 500 },
      { x1: 750, y1: 100, x2: 750, y2: 500 },
    ],
    obstacles: [
      { type: 'rect', x: 350, y: 100, width: 100, height: 150 },
      { type: 'rect', x: 350, y: 350, width: 100, height: 150 },
    ],
    width: 800,
    height: 600
  },
  {
    id: 3,
    name: "The Zig Zag",
    par: 3,
    startPos: { x: 100, y: 150 },
    hole: { pos: { x: 700, y: 450 }, radius: 15 },
    walls: [
      { x1: 50, y1: 50, x2: 750, y2: 50 },
      { x1: 50, y1: 550, x2: 750, y2: 550 },
      { x1: 50, y1: 50, x2: 50, y2: 550 },
      { x1: 750, y1: 50, x2: 750, y2: 550 },
    ],
    obstacles: [
      { type: 'rect', x: 200, y: 50, width: 50, height: 350 },
      { type: 'rect', x: 500, y: 200, width: 50, height: 350 },
    ],
    width: 800,
    height: 600
  },
  {
    id: 4,
    name: "Circle Trap",
    par: 4,
    startPos: { x: 100, y: 300 },
    hole: { pos: { x: 700, y: 300 }, radius: 15 },
    walls: [
      { x1: 50, y1: 50, x2: 750, y2: 50 },
      { x1: 50, y1: 550, x2: 750, y2: 550 },
      { x1: 50, y1: 50, x2: 50, y2: 550 },
      { x1: 750, y1: 50, x2: 750, y2: 550 },
    ],
    obstacles: [
      { type: 'circle', x: 400, y: 300, radius: 80 },
      { type: 'rect', x: 380, y: 50, width: 40, height: 150 },
      { type: 'rect', x: 380, y: 400, width: 40, height: 150 },
    ],
    width: 800,
    height: 600
  },
  {
    id: 5,
    name: "The Gauntlet",
    par: 5,
    startPos: { x: 400, y: 500 },
    hole: { pos: { x: 400, y: 100 }, radius: 15 },
    walls: [
      { x1: 200, y1: 50, x2: 600, y2: 50 },
      { x1: 200, y1: 550, x2: 600, y2: 550 },
      { x1: 200, y1: 50, x2: 200, y2: 550 },
      { x1: 600, y1: 50, x2: 600, y2: 550 },
    ],
    obstacles: [
      { type: 'rect', x: 200, y: 300, width: 250, height: 20 },
      { type: 'rect', x: 350, y: 200, width: 250, height: 20 },
    ],
    width: 800,
    height: 600
  },
  {
    id: 6,
    name: "The Bridge",
    par: 4,
    startPos: { x: 100, y: 300 },
    hole: { pos: { x: 700, y: 300 }, radius: 15 },
    walls: [
      { x1: 50, y1: 150, x2: 750, y2: 150 },
      { x1: 50, y1: 450, x2: 750, y2: 450 },
      { x1: 50, y1: 150, x2: 50, y2: 450 },
      { x1: 750, y1: 150, x2: 750, y2: 450 },
    ],
    obstacles: [
      { type: 'water', x: 250, y: 150, width: 300, height: 130 },
      { type: 'water', x: 250, y: 320, width: 300, height: 130 },
      // Gap at y: 280 to 320 is the "bridge"
    ],
    width: 800,
    height: 600
  },
  {
    id: 7,
    name: "The Maze",
    par: 5,
    startPos: { x: 100, y: 100 },
    hole: { pos: { x: 700, y: 500 }, radius: 15 },
    walls: [
      { x1: 50, y1: 50, x2: 750, y2: 50 },
      { x1: 50, y1: 550, x2: 750, y2: 550 },
      { x1: 50, y1: 50, x2: 50, y2: 550 },
      { x1: 750, y1: 50, x2: 750, y2: 550 },
    ],
    obstacles: [
      { type: 'rect', x: 200, y: 50, width: 20, height: 400 },
      { type: 'rect', x: 350, y: 150, width: 20, height: 400 },
      { type: 'rect', x: 500, y: 50, width: 20, height: 400 },
      { type: 'rect', x: 650, y: 150, width: 20, height: 400 },
    ],
    width: 800,
    height: 600
  }
];
