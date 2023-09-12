export const STARTING_ITEMS = [
  'bag',
  'gem',
  'ingot',
  'axe',
  'ingot',
  'axe',
  'gem',
  'empty',
]
export const STARTING_DATA = { levelIndex: 0, gold: 100, items: STARTING_ITEMS }
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
export const PLAYER_BUFFER = 300
export const ATTACK_RANGE = 900
export const ITEM_TYPES = {
  empty: {
    size: 0,
    size2: 0,
    health: 0,
    damage: 0,
    weight: 0,
    value: 0,
    color: '#000',
  },
  bag: {
    size: 32,
    size2: 32,
    health: 10,
    damage: 1,
    weight: 0.8,
    value: 1,
    color: '#ff0',
  },
  gem: {
    size: 32,
    size2: 32,
    health: 10,
    damage: 1,
    weight: 0.8,
    value: 100,
    color: '#fff',
  },
  ingot: {
    size: 32,
    size2: 64,
    health: 10,
    damage: 5,
    weight: 1.3,
    value: 10,
    color: '#fff',
  },
  axe: {
    size: 36,
    size2: 64,
    health: 10,
    damage: 10,
    weight: 1,
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
    waves: [{ type: 'normal', count: 1, progress: 0 }],
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
