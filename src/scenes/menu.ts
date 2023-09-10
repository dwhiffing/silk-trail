import { Background } from '../entities/bg'
import { Text, track } from 'kontra'

export const MenuScene = ({
  canvas,
  data,
  heading,
  description,
  texts,
  button1,
  button2,
}: any) => {
  const width = canvas.width
  const height = canvas.height
  const background = Background({ canvas, getSpeed: () => 3 })
  let i = 0
  let text = Text({
    text: heading,
    textAlign: 'center',
    font: '64px sans-serif',
    color: '#eee',
    x: width / 2,
    y: height / 2 - 180 - (heading === 'How to play' ? 60 : 0),
  })
  let text2 = Text({
    text: description || texts[0],
    font: '28px sans-serif',
    textAlign: 'center',
    lineHeight: 1,
    color: '#ddd',
    x: width / 2,
    y: height / 2 - 100 - (heading === 'How to play' ? 60 : 0),
  })
  let helpButton
  if (button2) {
    helpButton = Text({
      x: width / 2,
      y: height / 2 + 130,
      text: 'Help',
      color: '#aaa',
      font: '52px sans-serif',
      anchor: { x: 0.5, y: 0.5 },
      onDown: button2,
    })
    track(helpButton)
  }
  let button = Text({
    x: width / 2,
    y: height / 2 + 190,
    text: texts ? 'Next' : 'Start',
    color: '#aaa',
    font: '52px sans-serif',
    anchor: { x: 0.5, y: 0.5 },
    onDown: () => {
      if (texts && i < texts.length - 1) {
        text2.text = texts[++i]
        if (i === texts.length - 1) button.text = 'Start'
      } else {
        button1()
      }
    },
  })

  track(button)

  return {
    shutdown() {},
    update() {
      background.update()
    },
    render() {
      background.render()
      text.render()
      text2.render()
      button.render()
      helpButton?.render()
    },
  }
}
