import { Store } from '../entities/store'

export const ShopScene = ({ canvas, onNext }) => {
  const x = 0
  const y = 0

  let store = Store({
    x,
    y,
    canvas,
    onNext: onNext,
    onPurchase: () => {},
    getPlayer: () => ({ upgrades: [] }),
  })
  return {
    shutdown() {},
    update() {
      store.update()
    },
    render() {
      store.render()
    },
  }
}
