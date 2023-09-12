export const GRAVITY = 0.175
export const GROUND_Y = 455
export const MIN_SPEED = 3
export const MAX_SPEED = 8
export const MAX_WAGON_SPEED = 6
export const SIZE = 102
export const MIN_ANGLE = 3.2
export const MAX_ANGLE = 4
export const BASE_MOVEMENT_SPEED = 0.0001
export const BASE_SPEED_CHANGE = 0.12
export const BASE_ANGLE_CHANGE = 0.02
export const MAX_HP = 50
export const MAX_WEIGHT = 20
export const ENEMY_BUFFER = 240
export const PLAYER_BUFFER = 400
export const ATTACK_RANGE = 900
export const ITEM_TYPES = {
  stone: {
    size: 64,
    health: 10,
    damage: 10,
    weight: 0.8,
    value: 1,
    color: '#fff',
  },
  box: {
    size: 64,
    health: 10,
    damage: 10,
    weight: 1.2,
    value: 1,
    color: '#ff0',
  },
}

export const LEVELS = [
  {
    x: 50,
    y: 260,
    name: '1',
    totalLength: 5,
    waves: [{ type: 'normal', count: 5, progress: 0 }],
  },
  {
    name: '2',
    x: 245,
    y: 400,
    totalLength: 0.5,
    waves: [{ type: 'normal', count: 1, progress: 0.5 }],
  },
  {
    name: '3',
    x: 412,
    y: 330,
    totalLength: 1,
    waves: [{ type: 'normal', count: 1, progress: 0.5 }],
  },
  {
    name: '4',
    x: 645,
    y: 325,
    totalLength: 1,
    waves: [{ type: 'normal', count: 1, progress: 0.5 }],
  },
  {
    name: '5',
    x: 908,
    y: 380,
    totalLength: 1,
    waves: [{ type: 'normal', count: 1, progress: 0.5 }],
  },
  {
    name: '6',
    x: 1080,
    y: 195,
    totalLength: 1,
    waves: [
      { type: 'normal', count: 3, progress: 0.25 },
      { type: 'normal', count: 3, progress: 0.5 },
      { type: 'normal', count: 3, progress: 0.75 },
    ],
  },
]
