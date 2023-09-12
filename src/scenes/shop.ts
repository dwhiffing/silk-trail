import { Text, Sprite, track } from 'kontra'
import { Background } from '../entities/bg'
import { ITEM_TYPES, LEVELS } from '../constants'
import { playSound } from '../utils'

const yt = 70
const yt2 = 20
const xt = 50

export const ShopScene = ({ canvas, data, onNext }) => {
  const { width, height } = canvas
  const background = Background({ canvas, getSpeed: () => 0.1 })
  let shopItems = LEVELS[data.levelIndex].items
  let market = LEVELS[data.levelIndex].market
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
    playSound('click')
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
    playSound('click')
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
    const item = new ShopItem(canvas, side, i, () => {
      const allItems = [...playerItemLabels, ...shopItemLabels]
      allItems.find((l) => l.id === selectedItemId)?.toggleSelect()
      selectedItemId = item.id
      playerItemLabels.forEach((i) => (i.color = 'white'))
      shopItemLabels.forEach((i) => (i.color = 'white'))
      buySell.text = side === 0 ? 'Sell' : 'Buy'

      // check if can afford and disable buy button
      item.toggleSelect()
      playSound('click')
      updateShop()
    })

    if (side === 0) playerItemLabels.push(item)
    if (side === 1) shopItemLabels.push(item)
  }

  let PAGE_SIZE = 10
  let playerPage = 0
  let shopPage = 0
  const playerPageCount = Math.ceil(data.items.length / PAGE_SIZE)
  const shopPageCount = Math.ceil(shopItems.length / PAGE_SIZE)
  const changePlayerPage = (n) => {
    playerPage = Math.max(0, Math.min(playerPageCount - 1, playerPage + n))
    updateShop()
  }
  const changeShopPage = (n) => {
    shopPage = Math.max(0, Math.min(shopPageCount - 1, shopPage + n))
    updateShop()
  }
  const updateShop = () => {
    const side = selectedItemId.split(':')[0]
    playerItemLabels.forEach((l) => l.setItem())
    shopItemLabels.forEach((l) => l.setItem())
    pCount.text = `${playerPage + 1}/${playerPageCount}`
    sCount.text = `${shopPage + 1}/${shopPageCount}`
    data.items
      .filter((i) => i !== 'empty')
      .slice(playerPage * PAGE_SIZE, (playerPage + 1) * PAGE_SIZE)
      .forEach((l, i) => playerItemLabels[i].setItem(l, market))
    shopItems
      .slice(shopPage * PAGE_SIZE, (shopPage + 1) * PAGE_SIZE)
      .forEach((l, i) => shopItemLabels[i].setItem(l, market))
    gold.text = `Gold: ${data.gold}`
    const item = getSelected()
    buySell.color = `rgba(255,255,255,${
      !item || (side === 'shop' && data.gold < item.value) ? 0.5 : 1
    })`
  }

  new Array(PAGE_SIZE).fill('').forEach((_, i) => renderShopItem(i, 0))
  new Array(PAGE_SIZE).fill('').forEach((_, i) => renderShopItem(i, 1))

  buttons.push(
    Text({
      x: xt + xt / 2,
      y: yt2 + 58,
      text: 'Name                     Weight      Damage      Value',
      color: 'white',
      font: 'bold 22px sans-serif',
      anchor: { x: 0, y: 0 },
    }),
  )
  buttons.push(
    Text({
      x: width / 2 - xt / 2 + xt + xt / 2,
      y: yt2 + 58,
      text: 'Name                     Weight      Damage      Value',
      color: 'white',
      font: 'bold 22px sans-serif',
      anchor: { x: 0, y: 0 },
    }),
  )
  const pNext = Text({
    x: xt + (width / 2 - xt * 2) - 10,
    y: height - yt - 30,
    text: '>',
    color: 'white',
    font: 'bold 22px sans-serif',
    anchor: { x: 0, y: 0 },
    onDown: () => changePlayerPage(1),
  })
  buttons.push(pNext)
  const pCount = Text({
    x: width / 4 + xt / 4,
    y: height - yt - 30,
    text: `1/${playerPageCount}`,
    color: 'white',
    font: 'bold 22px sans-serif',
    anchor: { x: 0.5, y: 0 },
  })
  buttons.push(pCount)
  const sCount = Text({
    x: width / 2 + (width / 4 - xt / 4),
    y: height - yt - 30,
    text: `1/${shopPageCount}`,
    color: 'white',
    font: 'bold 22px sans-serif',
    anchor: { x: 0.5, y: 0 },
  })
  buttons.push(sCount)
  const pPrev = Text({
    x: xt + 20,
    y: height - yt - 30,
    text: '<',
    color: 'white',
    font: 'bold 22px sans-serif',
    anchor: { x: 0, y: 0 },
    onDown: () => changePlayerPage(-1),
  })
  buttons.push(pPrev)
  const sNext = Text({
    x: width - (xt + 30),
    y: height - yt - 30,
    text: '>',
    color: 'white',
    font: 'bold 22px sans-serif',
    anchor: { x: 0, y: 0 },
    onDown: () => changeShopPage(1),
  })
  buttons.push(sNext)
  const sPrev = Text({
    x: xt + 20 + (width / 2 - xt / 2),
    y: height - yt - 30,
    text: '<',
    color: 'white',
    font: 'bold 22px sans-serif',
    anchor: { x: 0, y: 0 },
    onDown: () => changeShopPage(-1),
  })
  buttons.push(sPrev)

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
      x: width / 2,
      y: yt2,
      text: LEVELS[data.levelIndex].name,
      color: 'white',
      font: 'bold 32px sans-serif',
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
  track(pNext)
  track(sNext)
  track(pPrev)
  track(sPrev)
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

class ShopItem {
  nameLabel: Text
  clickLabel: Text
  weightLabel: Text
  damageLabel: Text
  valueLabel: Text
  id: string
  constructor(canvas, side, index, onDown) {
    const { width, height } = canvas

    const startX = side === 0 ? 0 : width / 2 - xt / 2
    const _x = startX + xt + xt / 2
    const _y = yt + xt / 2 + 32 * index + 15
    this.id = `${side === 0 ? 'player' : 'shop'}:${index}`
    const color = 'white'
    const text = ''
    const font = '24px sans-serif'
    const anchor = { x: 0.5, y: 0 }

    this.clickLabel = Text({
      x: _x,
      y: _y,
      text: '',
      width: 500,
      color,
      font,
      anchor: { x: 0, y: 0 },
      onDown,
    })

    this.nameLabel = Text({
      x: _x,
      y: _y,
      text,
      color,
      font,
      anchor: { x: 0, y: 0 },
    })

    this.weightLabel = Text({
      x: _x + 225,
      y: _y,
      text,
      color,
      font,
      anchor,
    })

    this.damageLabel = Text({
      x: _x + 340,
      y: _y,
      text,
      color,
      font,
      anchor,
    })

    this.valueLabel = Text({
      x: _x + 450,
      y: _y,
      text,
      color,
      font,
      anchor,
    })
    track(this.clickLabel)
  }

  setItem(i: any, market: any) {
    const item = ITEM_TYPES[i]
    const _v = market?.[item?.name] || 1
    this.nameLabel.text = item?.name || ''
    this.weightLabel.text = item?.weight || ''
    this.valueLabel.text = item?.value ? `${item?.value * _v}` : ''
    this.damageLabel.text = item?.damage || ''
    if (_v < 0.8) this.toggleColor('#f66')
    if (_v > 1.2) this.toggleColor('#6f6')
  }

  toggleSelect() {
    const isSelected = this.nameLabel.color === '#ff0'
    this.toggleColor(isSelected ? '#fff' : '#ff0')
  }

  toggleColor(color: string) {
    this.nameLabel.color = color
    this.weightLabel.color = color
    this.valueLabel.color = color
    this.damageLabel.color = color
  }

  update(dt?: number) {}

  render() {
    this.nameLabel.render()
    this.clickLabel.render()
    this.weightLabel.render()
    this.damageLabel.render()
    this.valueLabel.render()
  }
}
