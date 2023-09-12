import { GROUND_Y } from '../constants'
import { Sprite } from './sprite'

export const Background = ({ canvas, getSpeed }) => {
  const sky = new Rect(0, 0, canvas.width, canvas.height - 223, [
    '#0081AA',
    '#6AC4E0',
  ])

  const mountain = new Mountain(0, GROUND_Y - 129, canvas.width, 155)

  const groundLine = new Rect(
    0,
    GROUND_Y - 130,
    canvas.width,
    canvas.height - GROUND_Y + 130,
    ['#B78F73', '#8C6548'],
  )
  return {
    render() {
      sky.render()
      groundLine.render()
      mountain.render()
    },
    update() {
      mountain.update()
      mountain.dx = getSpeed() * -1
      if (mountain.x < -400) {
        mountain.x = canvas.width
        mountain.scaleX = Math.random() * 0.5 + 0.5
        mountain.scaleY = Math.random() * 0.5 + 0.2
      }
    },
    shutdown() {},
  }
}

export class Rect extends Sprite {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    colors: string[],
    paths?: string[],
  ) {
    super({ x, y, width, height, anchor: { x: 0, y: 0 } })
    this.colors = colors
    this.paths = paths
  }

  draw() {
    if (this.opacity === 0) return

    const gradient = this.context.createLinearGradient(
      0,
      0,
      0,
      this.height * 1.2,
    )
    this.colors.forEach((c, i) =>
      gradient.addColorStop(i / this.colors.length, c),
    )
    this.context.fillStyle = gradient
    this.context.beginPath()
    this.context.rect(0, 0, this.width, this.height)
    this.context.closePath()
    this.context.scale(4, 4)
    if (this.paths) {
      this.context.scale(0.35, 0.35)
      this.paths.forEach((p) => this.context.fill(new Path2D(p)))

      this.context.scale(1, 1)
    } else {
      this.context.fill()
    }
    this.context.scale(1, 1)
  }
}

export class Mountain extends Sprite {
  constructor(x: number, y: number, width: number, height: number) {
    super({ x, y, width, height, anchor: { x: 0, y: 1 } })
  }

  draw() {
    if (this.opacity === 0) return

    this.drawPath('M106 1L1 154H209L106 1Z', 'transparent', '#B78F73', 1)
  }
}

export class Path extends Sprite {
  constructor() {
    super()
  }

  draw() {
    if (this.opacity === 0) return

    this.context.scale(1.35, 1.35)
    this.drawPath(
      'M48 199L91 221L98 232H109L116 244L149 251L171 291',
      '#f00',
      '',
      5,
    )
    this.drawPath('M193 296L209 287L243 284L264 260L294 249', '#000', '', 5)
    this.drawPath(
      'M316 242L330 240L338 231H349L400 216H437L467 234',
      '#000',
      '',
      5,
    )
    this.drawPath('M486 250L507 280L541 293H586L633 298L662 287', '#000', '', 5)
    this.drawPath(
      'M684 283L711 290L734 287L755 294L767 287V263L785 252V234L807 209V191L794 170L796 156',
      '#000',
      '',
      5,
    )
  }
}

export class Circle extends Sprite {
  draw() {
    if (this.opacity === 0) return

    this.context.beginPath()
    this.context.arc(0, 0, this.size / 2, 0, Math.PI * 2)
    this.context.fillStyle = this.color
    this.context.closePath()
    this.context.fill()
  }
}
