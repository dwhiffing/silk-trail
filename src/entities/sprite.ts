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
  'M129 193L157 165H125L90 161L88 191L111 215L89 200L101 227L83 200L78 164L86 140L119 119L167 115L210 135L233 130L249 120L242 107L253 113H262L280 122L278 126L267 127L225 151L190 163L168 206L131 218L163 200L174 164L134 197L123 225L129 193Z',
  'M192 157L150 168L123 163L101 202L115 246L92 202L101 167L56 190L28 237L47 190L78 163L86 141L126 115L170 112L195 126L225 123L242 112L235 97L242 101L255 103L273 112L271 115L260 117L225 145L203 153L249 202L255 212L225 186L213 221L220 182L192 157Z',
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

    this.context.lineWidth = 5
    var path = new Path2D(paths[index])
    this.context.stroke(path)
    this.context.fill(path)

    const n = index === 0 ? 0 : -10
    const x = index === 0 ? 0 : -3
    this.context.translate(x, n)
    this.context.fillStyle = 'white'
    var path = new Path2D(
      'M154 128L172 147L189 148L188 117L183 109L186 104L165 75L162 62L170 52L162 45L151 50L150 66L154 110V128Z',
    )
    this.context.stroke(path)
    this.context.fill(path)
    this.context.fillStyle = '#DEA248'
    var path = new Path2D('M166 54H158L155 63L164 66L166 59L168 60L166 54Z')
    this.context.stroke(path)
    this.context.fill(path)
    var path = new Path2D('M187 104L249.5 125')
    this.context.stroke(path)
    this.context.translate(-x, -n)
  }
}
