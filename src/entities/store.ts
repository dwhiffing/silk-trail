import { Text, Sprite, track } from 'kontra'
import { playSound } from '../utils'

// TODO: refactor
export const Store = ({ x, y, canvas, onPurchase, onNext, getPlayer }) => {
  let active = true
  const background = Sprite({
    x: x,
    y: y,
    width: canvas.width,
    height: canvas.height,
    color: '#555',
  })
  let buttons = []
  let selected = null

  // const moneyText = Text({
  //   x: x,
  //   y: y,
  //   text: '',
  //   color: 'rgba(255,255,255,1)',
  //   font: '24px sans-serif',
  //   anchor: { x: 0.5, y: 0.5 },
  // })
  // buttons.push(moneyText)

  // const costText = Text({
  //   x: x,
  //   y: y,
  //   text: '',
  //   color: 'rgba(255,255,255,0)',
  //   font: '24px sans-serif',
  //   anchor: { x: 0.5, y: 0.5 },
  // })
  // buttons.push(costText)

  // const descriptionText = Text({
  //   x: x,
  //   y: y,
  //   text: 'a description',
  //   color: 'rgba(255,255,255,0)',
  //   font: '16px sans-serif',
  //   anchor: { x: 0.5, y: 0.5 },
  // })
  // buttons.push(descriptionText)

  // const purchase = Text({
  //   x: x,
  //   y: y,
  //   text: 'Purchase',
  //   color: 'rgba(255,255,255,0)',
  //   font: '32px sans-serif',
  //   anchor: { x: 0.5, y: 0.5 },
  //   onDown() {
  //     if (typeof selected?.upgrade.key === 'string') {
  //       let player = getPlayer()
  //       const cost = Number(costText.text.replace('Cost: $', ''))
  //       if (player.sprite.money < cost) {
  //         playSound('mineNotPlaced')
  //         return
  //       }

  //       onPurchase(selected.upgrade)
  //       const upgrades = getPlayer().upgrades
  //       if (selected.key !== 'repair')
  //         selected.count.text = upgrades[selected.upgrade.key]

  //       player.sprite.money -= cost
  //       moneyText.text = `Cash: $${player.sprite.money}`

  //       if (
  //         !UPGRADES.find((u) => u.key === selected.upgrade.key).cost[
  //           upgrades[selected.upgrade.key]
  //         ]
  //       ) {
  //         selected.count.color = 'rgba(255,255,255,0.5)'
  //         selected.label.color = 'rgba(255,255,255,0.5)'
  //         costText.text = ''
  //         descriptionText.text = ''
  //       }
  //     }
  //     selected = null
  //     playSound('click')
  //     buttons.forEach((b) => {
  //       if (b.isLabel && b.color === '#ee9') b.color = 'white'
  //     })
  //     this.color = 'rgba(255,255,255,0)'
  //   },
  // })
  // track(purchase)
  // buttons.push(purchase)

  const start = Text({
    x: canvas.width - 10,
    y: canvas.height - 10,
    text: 'Next',
    color: 'white',
    font: '16px sans-serif',
    anchor: { x: 1, y: 1 },
    onDown() {
      active = false
      playSound('nextLevel')

      onNext()
    },
  })
  track(start)
  buttons.push(start)

  const array = []
  array.forEach((upgrade, i) => {
    const _x = x + 50
    const _y = y + 50 + 30 * i
    const onDown = () => {
      const upgrades = getPlayer().upgrades
      const key = upgrade.key
      let cost = upgrade.cost[upgrades[key]]
      if (key === 'repair') cost = 100 - getPlayer().sprite.health
      if (!cost) return
      playSound('click')
      buttons.forEach((b) => {
        if (b.isLabel && b.color === '#ee9') b.color = 'white'
      })
    }
    const label = Text({
      x: _x,
      y: _y,
      text: upgrade.label,
      color: `rgba(255,255,255,${1})`,
      font: '14px sans-serif',
      anchor: { x: 0, y: 0.5 },
      onDown,
      isLabel: true,
    })
    track(label)
    buttons.push(label)
  })

  return {
    update() {
      if (!active) return
      background.update()
    },
    getActive() {
      return active
    },
    setActive(_active) {
      active = _active
      // moneyText.text = `Cash: $${getPlayer().sprite.money}`
    },
    render() {
      if (!active) return
      background.render()
      buttons.forEach((b) => b.render())
    },
  }
}
