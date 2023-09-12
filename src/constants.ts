export const STARTING_ITEMS = [
  'empty',
  'bag',
  'gem',
  'ingot',
  'axe',
  'ingot',
  'axe',
  'gem',
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
const iToType = (t) => ({
  size: t[0],
  size2: t[1],
  health: t[2],
  damage: t[3],
  weight: t[4],
  value: t[5],
  color: t[6],
})
const iToLevel = (l) => ({
  x: l[0],
  y: l[1],
  name: l[2],
  totalLength: l[3] || 0.1,
  waves: l[4] || [{ type: 'normal', count: 1, progress: 0 }],
})

export const ITEM_TYPES = {
  empty: iToType([0, 0, 0, 0, 0, 0, '#000']),
  bag: iToType([32, 32, 10, 1, 0.8, 1, '#ff0']),
  gem: iToType([32, 32, 10, 1, 0.8, 100, '#fff']),
  ingot: iToType([32, 64, 10, 5, 1.3, 10, '#fff']),
  axe: iToType([36, 64, 10, 10, 1, 10, '#ff0']),
}

export const LEVELS = [
  iToLevel([50, 260, 'ISKENDERUN']),
  iToLevel([245, 400, 'BAGHDAD']),
  iToLevel([412, 330, 'TEHRAN']),
  iToLevel([645, 325, 'MASHHAD']),
  iToLevel([908, 380, 'KABEL']),
  iToLevel([1080, 195, 'KASHI']),
]
