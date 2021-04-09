new p5(p => {
  const { innerWidth, innerHeight } = window
  let frames = 0
  let streams = []

  function newText () {
    let r = Math.floor(Math.random() * (10 + 26 * 2 + 90))
    let c
    if (r < 10) { c = 0x0030 + r } else { r -= 10 } // digits
    if (!c && r < 26) { c = 0x0041 + r } else { r -= 26 } // upper-latin
    if (!c && r < 26) { c = 0x0061 + r } else { r -= 26 } // lower-latin
    if (!c) c = 0x30a1 + r // katakana
    return String.fromCharCode(c)
  }

  function newSymbol (inital) {
    return {
      x: 0,
      y: 12,
      text: newText(),
      size: 12,
      color: p.color(255),
      ...inital,
    }
  }

  function newX () {
    return Math.floor(Math.random() * (innerWidth / 12)) * 12
  }

  function newValidX () {
    for (let i = 0; i < 10; i++) {
      const x = newX()
      if (streams.every(e => e.x !== x || e.first.hidden)) return x
    }
    return -1
  }

  function newStream () {
    const x = newValidX()
    if (x >= 0) {
      const symbol = newSymbol({ x })
      return {
        x,
        symbols: [symbol],
        first: symbol,
        last: symbol,
      }
    } else return null
  }

  function nextTime (stream) {
    // fade out
    stream.symbols.forEach(e => {
      // change text
      if (Math.random() < 0.03) e.text = newText()
      // change alpha
      const alpha = p.alpha(e.color) - 10
      e.color = p.color(0, 255, 70, alpha)
      // hide
      if (alpha <= 0) {
        e.hidden = true
        stream.lastHidden = e
      }
    })
    // next symbol
    if (!stream.lastHidden || stream.lastHidden.y < innerHeight) {
      const symbol = newSymbol({ x: stream.last.x, y: stream.last.y + 12 })
      stream.symbols.push(symbol)
      stream.last = symbol
    } else {
      stream.hidden = true
    }
  }

  function render (symbols) {
    symbols.forEach(e => {
      if (!e.hidden) {
        p.fill(e.color)
        p.textSize(12)
        p.textAlign(p.CENTER)
        p.text(e.text, e.x, e.y)
      }
    })
  }

  p.setup = function () {
    p.createCanvas(innerWidth, innerHeight)
    p.background(0)
    p.textFont('Yu Gothic')
  }

  p.draw = function () {
    p.background(0)
    // add steam
    if (frames % 5 === 0) {
      const stream = newStream()
      if (stream) streams.push(stream)
    }
    // render
    streams = streams.filter((e, i) => {
      render(e.symbols)
      if (frames % 3 === 0) nextTime(e)
      return !e.hidden
    })
    // next frame
    if (frames < 60) { frames++ } else { frames = 0 }
  }
})