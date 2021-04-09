let frames = 0
let streams = []

function createText () {
  let r = Math.floor(Math.random() * (10 + 26 * 2 + 90))
  let c
  if (r < 10) { c = 0x0030 + r } else { r -= 10 } // digits
  if (!c && r < 26) { c = 0x0041 + r } else { r -= 26 } // upper-latin
  if (!c && r < 26) { c = 0x0061 + r } else { r -= 26 } // lower-latin
  if (!c) c = 0x30a1 + r // katakana
  return String.fromCharCode(c)
}

function createSymbol (inital) {
  return {
    x: 0,
    y: 12,
    text: createText(),
    size: 12,
    color: color(255),
    ...inital,
  }
}

function createStreamX () {
  return Math.floor(Math.random() * (window.innerWidth / 12)) * 12
}

function createValidStreamX () {
  for (let i = 0; i < 10; i++) {
    const x = createStreamX()
    if (streams.every(e => e.x !== x || e.first.hidden)) return x
  }
  return -1
}

function createStream () {
  const x = createValidStreamX()
  if (x >= 0) {
    const symbol = createSymbol({ x })
    return {
      x,
      symbols: [symbol],
      first: symbol,
      last: symbol,
    }
  } else return null
}

function nextTick (stream) {
  fadeOut(stream)
  // next symbol
  if (!stream.lastHidden || stream.lastHidden.y < window.innerHeight) {
    const symbol = createSymbol({ x: stream.last.x, y: stream.last.y + 12 })
    stream.symbols.push(symbol)
    stream.last = symbol
  } else {
    stream.hidden = true
  }
}

function fadeOut (stream) {
  stream.symbols.forEach(e => {
    // change text
    if (Math.random() < 0.03) e.text = createText()
    // change alpha
    const a = alpha(e.color) - 10
    e.color = color(0, 255, 70, a)
    // hide
    if (a <= 0) {
      e.hidden = true
      stream.lastHidden = e
    }
  })
}

function render (symbols) {
  symbols.forEach(e => {
    if (!e.hidden) {
      fill(e.color)
      textSize(12)
      textAlign(CENTER)
      text(e.text, e.x, e.y)
    }
  })
}

setup = function () {
  createCanvas(window.innerWidth, window.innerHeight)
  background(0)
  textFont('Yu Gothic')
}

draw = function () {
  background(0)
  // add stream
  if (frames % 5 === 0) {
    const stream = createStream()
    if (stream) streams.push(stream)
  }
  // render
  streams = streams.filter((e, i) => {
    render(e.symbols)
    if (frames % 3 === 0) nextTick(e)
    return !e.hidden
  })
  // next frame
  if (frames < 60) { frames++ } else { frames = 0 }
}