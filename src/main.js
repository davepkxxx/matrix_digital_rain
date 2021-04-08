new p5(p => {
  const { innerWidth, innerHeight } = window
  const stream = newSteam()

  function newText () {
    return String.fromCharCode(p.random(0x30A0, 0x30A0 + 97))
  }

  function newSymbol (inital) {
    const size = (inital && inital.size) || 12
    return {
      x: 0,
      y: size,
      text: newText(),
      size,
      r: 0,
      g: 255,
      b: 70,
      a: 255,
      ...inital
    }
  }

  function newSteam () {
    const symbol = newSymbol()
    return {
      symbols: [symbol],
      last: symbol
    }
  }

  function nextTime (stream) {
    stream.symbols.forEach(e => {
      e.a -= 10
      if (e.a <= 0) stream.lastHidden = e
    })

    if (!stream.lastHidden || stream.lastHidden.y < innerHeight) {
      const symbol = newSymbol({ y: stream.last.y + stream.last.size })
      stream.symbols.push(symbol)
      stream.last = symbol
    }
  }

  function render (symbols) {
    symbols.forEach(e => {
      p.fill(e.r, e.g, e.b, e.a)
      p.textSize(e.size)
      p.text(e.text, e.x, e.y)
    })
  }

  p.setup = function () {
    p.createCanvas(innerWidth, innerHeight)
    p.background(0)
  }

  p.draw = function () {
    p.background(0)
    nextTime(stream)
    render(stream.symbols)
  }
})