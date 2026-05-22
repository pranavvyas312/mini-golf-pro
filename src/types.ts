
export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Ball {
  pos: Point;
  vel: Vector;
  radius: number;
}

export interface Hole {
  pos: Point;
  radius: number;
}

export interface Wall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Obstacle {
  type: 'rect' | 'circle' | 'water';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  rotation?: number; // degrees
  speed?: number; // for moving obstacles
  path?: Point[]; // for moving obstacles
}

export interface Level {
  id: number;
  name: string;
  par: number;
  startPos: Point;
  hole: Hole;
  walls: Wall[];
  obstacles: Obstacle[];
  width: number;
  height: number;
}
