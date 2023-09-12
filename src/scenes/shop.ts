import { Text, Sprite, track } from 'kontra'
import { Background } from '../entities/bg'
import { ITEM_TYPES } from '../constants'
import { playSound } from '../utils'

const yt = 70
const yt2 = 20
const xt = 50

export const ShopScene = ({ canvas, data, onNext }) => {
  const { width, height } = canvas
  const background = Background({ canvas, getSpeed: () => 0.1 })
  let shopItems = [
    'stone',
    'stone',
    'stone',
    'stone',
    'stone',
    'box',
    'box',
    'box',
    'box',
    'box',
  ]
  const sw = width / 2 - xt * 1.5
  const sh = height - yt * 2
  const x2 = width / 2 + xt / 2
  const bg2 = Sprite({
    x: xt,
    y: yt,
    width: sw,
    height: sh,
    color: '#000000aa',
  })
  const bg3 = Sprite({
    x: x2,
    y: yt,
    width: sw,
    height: sh,
    color: '#000000aa',
  })
  const buttons: any[] = [bg2, bg3]
  const shopItemLabels: any[] = []
  const playerItemLabels: any[] = []
  let selectedItemId = ''

  const onClickNext = () => {
    playSound('nextLevel')
    onNext()
  }

  const getSelected = () => {
    const index = +selectedItemId.split(':')[1]
    return ITEM_TYPES[data.items[index]]
  }

  const onBuySell = () => {
    const index = +selectedItemId.split(':')[1]
    const item = getSelected()
    if (!item) return
    playSound('nextLevel')
    if (selectedItemId.includes('player')) {
      shopItems.push(data.items[index])
      data.items = data.items.filter((d, i) => i !== index)
      data.gold += item.value
    } else if (data.gold >= item.value) {
      // make sure can afford before buying
      data.items.push(shopItems[index])
      shopItems = shopItems.filter((d, i) => i !== index)
      data.gold -= item.value
    }
    updateShop()
  }

  const renderShopItem = (i, side) => {
    const startX = side === 0 ? 0 : width / 2 - xt / 2
    const _x = startX + xt + xt / 2
    const _y = yt + xt / 2 + 32 * i
    const id = `${side === 0 ? 'player' : 'shop'}:${i}`
    const onDown = () => {
      selectedItemId = id
      playerItemLabels.forEach((i) => (i.color = 'white'))
      shopItemLabels.forEach((i) => (i.color = 'white'))
      buySell.text = side === 0 ? 'Sell' : 'Buy'

      // check if can afford and disable buy button
      label.color = 'yellow'
      playSound('click')
      updateShop()
    }

    const label = Text({
      x: _x,
      y: _y,
      text: '',
      color: `rgba(255,255,255,1)`,
      font: '24px sans-serif',
      anchor: { x: 0, y: 0 },
      onDown,
      isLabel: true,
    })
    track(label)
    if (side === 0) playerItemLabels.push(label)
    if (side === 1) shopItemLabels.push(label)
  }

  const updateShop = () => {
    const side = selectedItemId.split(':')[0]
    playerItemLabels.forEach((t) => (t.text = ''))
    shopItemLabels.forEach((t) => (t.text = ''))
    data.items.slice(0, 5).forEach((l, i) => (playerItemLabels[i].text = l))
    shopItems.slice(0, 5).forEach((l, i) => (shopItemLabels[i].text = l))
    gold.text = `Gold: ${data.gold}`
    const item = getSelected()
    buySell.color = `rgba(255,255,255,${
      !item || (side === 'shop' && data.gold < item.value) ? 0.5 : 1
    })`
  }

  new Array(5).fill('').forEach((_, i) => renderShopItem(i, 0))
  new Array(5).fill('').forEach((_, i) => renderShopItem(i, 1))

  buttons.push(
    Text({
      x: width / 4,
      y: yt2,
      text: 'Player',
      color: 'white',
      font: '28px sans-serif',
      anchor: { x: 0.5, y: 0 },
    }),
  )

  buttons.push(
    Text({
      x: width / 2 + width / 4 - 5,
      y: yt2,
      text: 'Shop',
      color: 'white',
      font: '28px sans-serif',
      anchor: { x: 0.5, y: 0 },
    }),
  )

  const gold = Text({
    x: width / 2,
    y: height - yt2,
    text: `Gold: ${data.gold}`,
    color: 'white',
    font: '28px sans-serif',
    anchor: { x: 0.5, y: 1 },
  })
  buttons.push(gold)

  const buySell = Text({
    x: width - xt,
    y: height - yt2,
    text: 'Buy',
    color: 'white',
    font: '28px sans-serif',
    anchor: { x: 1, y: 1 },
    onDown: onBuySell,
  })
  buttons.push(buySell)
  track(buySell)

  const start = Text({
    x: xt,
    y: height - yt2,
    text: 'Next',
    color: 'white',
    font: '28px sans-serif',
    anchor: { x: 0, y: 1 },
    onDown: onClickNext,
  })
  track(start)
  buttons.push(start)

  updateShop()
  return {
    shutdown() {},
    update() {
      background.update()
    },
    render() {
      background.render()
      buttons.forEach((b) => b.render())
      playerItemLabels.forEach((b) => b.render())
      shopItemLabels.forEach((b) => b.render())
    },
  }
}
