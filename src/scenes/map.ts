import { Map } from '../entities/map'

export const MapScene = ({ canvas, onNext }) => {
  const x = canvas.width / 2
  const y = canvas.height / 2

  let store = Map({
    canvas,
    onNext: onNext,
    onPurchase: () => {},
    getPlayer: () => ({ upgrades: [] }),
  })
  const nextLevel = () => {}
  return {
    nextLevel,
    shutdown() {},
    update() {
      store.update()
    },
    render() {
      store.render()
    },
  }
}
