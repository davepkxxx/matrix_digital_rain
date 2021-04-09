import defaultOptions from './options/matrix'

export default function sketch (initalOptions) {
  const options = { ...defaultOptions, initalOptions }

  const {
    nextStreamFrames,
    nextSymbolFrames,
    canvasWidth,
    canvasHeight,
    background,
    textFont,
    createStream,
    render,
    nextTick,
  } = options

  const maxFrames = nextStreamFrames * nextSymbolFrames
  let streams = []

  new p5(p => {
    p.setup = function () {
      p.createCanvas(canvasWidth, canvasHeight)
      p.background(background)
      p.textFont(textFont)
    }

    p.draw = function () {
      p.background(background)
      // add stream
      if (frames % nextStreamFrames === 0) {
        const stream = createStream({ p, streams }, options)
        if (stream) streams.push(stream)
      }
      // render
      streams = streams.filter(stream => {
        const env = { p, stream, streams }
        render(env, options)
        if (frames % nextSymbolFrames === 0) nextTick(env, options)
        return !stream.hidden
      })
      // next frame
      if (frames < maxFrames) { frames++ } else { frames = 0 }
    }
  })
}