import { emit, SpriteClass } from 'kontra'
import { ITEM_TYPES } from './player'

export class Sprite extends SpriteClass {
  constructor(properties = {}) {
    super({ anchor: { x: 0.5, y: 0.5 }, ...properties })
  }

  takeDamage(n) {
    if (this.health <= 0 || this.block) return

    if (n > 0) this.health -= n
    if (this.health <= 0) this.die()
  }

  die() {
    this.ttl = 0
    this.opacity = 0
  }

  update(dt?: number) {
    super.update(dt)
  }

  render() {
    super.render()
  }
}

const paths = [
  'M129.5 192.5L157 164.5H125L90.4999 160.5L88.4999 190.5L111.5 214.5L89.4999 199.5L101 226L83.4999 199.5L78 163.201L86.2536 139L118.93 118.1L167 114.575L210.455 133.963L233.5 129.5L248.896 119.5L242 106.5L253 112.813H261.709L280.014 121.625L278.184 125.15L267.201 126.913L225.099 149.825L190 162L168 205L131.5 216.8L163.5 199.5L173.845 163.201L134.5 196L122.591 223.85L129.5 192.5Z',
  'M191 156L149.096 167.19L122 162.5L100.296 201.571L114.756 245L91.2593 201.571L100.296 166.146L55.1111 188.905L27.5 235.952L46.0741 188.905L77.5 162.5L85.837 140.048L125.6 114.714L168.978 111.095L194.281 125.571L223.812 122L241.274 111.095L234 96.5L241.274 100.238L253.926 102.048L272 111.095L270.193 114.714L259.348 116.524L223.812 144.5L202 152.5L248 201L253.926 211.5L223.812 185.508L212.356 219.667L218.84 180.839L191 156Z',
]
export class ShipSprite extends Sprite {
  constructor(properties) {
    super({ anchor: { x: 0, y: 1 }, ...properties })
    this._frame = 0
  }

  update() {
    this._frame++
  }

  draw() {
    if (this.opacity === 0) return
    this.context.strokeStyle = '#000'
    this.context.lineWidth = 2
    this.context.fillStyle = this.color

    const k = 20
    const index = Math.round((this._frame % k) / k)

    var path = new Path2D(paths[index])
    this.context.stroke(path)
    this.context.fill(path)

    const n = index === 0 ? 0 : -10
    const x = index === 0 ? 0 : -3
    this.context.translate(x, n)
    this.context.fillStyle = 'white'
    var path = new Path2D(
      'M154.105 127.58L171.758 147.149L189 148L188.284 116.945L183.235 109.319L185.826 103.921L165.419 74.6856L161.882 61.6419L169.953 52.1965L161.882 45L150.907 49.9476L150 65.69L154.105 109.713V127.58Z',
    )
    this.context.stroke(path)
    this.context.fill(path)
    this.context.fillStyle = '#DEA248'
    var path = new Path2D(
      'M166.388 54H158.188L155 63.0365L163.691 66L166.388 58.9616L168 59.5954L166.388 54Z',
    )
    this.context.stroke(path)
    this.context.fill(path)
    var path = new Path2D('M187 104L249.5 125')
    this.context.stroke(path)
    this.context.translate(-x, -n)
  }
}
