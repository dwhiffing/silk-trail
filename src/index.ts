import { init, initPointer, initKeys, GameLoop } from 'kontra'
// import MUSIC from './music'
import { ShopScene, RoadScene, MapScene, MenuScene } from './scenes'
import './zzfx'

const { canvas } = init()

initPointer()
initKeys()
let scene
// //@ts-ignore
// let musicNode = zzfxP(...zzfxM(...MUSIC))
// //@ts-ignore
// musicNode.loop = true

// let a = document.getElementsByTagName('a')[0]
// a.addEventListener('click', (e) => {
//   //@ts-ignore
//   e.target.innerHTML = e.target.innerHTML === 'mute' ? 'unmute' : 'mute'
//   //@ts-ignore
//   // musicNode.playbackRate.value = musicNode.playbackRate.value === 1 ? 0 : 1
//   //@ts-ignore
//   window.zzfxV = window.zzfxV === 0 ? 0.3 : 0
// })
// // TODO: remove me
// a.click()

const startHelp = () => {
  scene && scene.shutdown()

  scene = MenuScene({
    canvas,
    heading: 'How to play',
    texts: [
      'Your greatest foe has sent an army to\ndestroy your homeworld for resources.\n\nYou are one of the few survivors,\nProtect it at all costs!',
      'Mouse controls your ship.\n\nClick to drop mines or hold to charge energy.\n\nRelease while moving to fire blasts\nor while still for a burst',
      "You can only place a few mines at once to start\n\nMines won't explode if you are too close\n\nMines must be placed at least a few feet apart",
      'Red enemies home in and explode\n\nGreen enemies shield themselves and nearby foes from mines, but not energy\n\nYellow enemies absorb blasts, but not mines and bursts',
    ],
    button1: startShop,
  })
}

const startShop = () => {
  scene && scene.shutdown()
  scene = ShopScene({ canvas, onNext: startMap })
}

const startRoad = () => {
  scene && scene.shutdown()
  scene = RoadScene({
    canvas,
    onNext: startShop,
    onWin: startWin,
    onLose: startLose,
  })
}

const startMap = () => {
  scene && scene.shutdown()
  scene = MapScene({ canvas, onNext: startRoad })
}

const startMenu = () => {
  scene && scene.shutdown()
  scene = MenuScene({
    canvas,
    heading: 'Silk Road',
    description: `Created by Daniel Whiffing`,
    button1: startShop,
    button2: startHelp,
  })
}

const startWin = (finalMoney) => {
  scene && scene.shutdown()
  scene = MenuScene({
    canvas,
    heading: 'Congratulations',
    description: `You cleaned out the Silk Road!\nYour final cash total was: $${finalMoney}`,
    button1: startMenu,
  })
}

const startLose = () => {
  scene && scene.shutdown()
  scene = MenuScene({
    canvas,
    heading: 'Game Over',
    description: 'You died and sealed the fate of the Silk Road.',
    button1: startMenu,
  })
}

// startMenu()
startRoad()

GameLoop({
  update: (...rest) => scene && scene.update(...rest),
  render: (...rest) => scene && scene.render(...rest),
}).start()
