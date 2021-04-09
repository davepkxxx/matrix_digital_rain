export default {
  nextStreamFrames: 5,
  nextSymbolFrames: 3,
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  background: 0,
  color: 255,
  textFont: 'Yu Gothic',
  textSize: 18,
  symbolTextChangeRate: 0.03,
  symbolAlphaChangeDiff: -10,
  createText () {
    let r = Math.floor(Math.random() * (10 + 26 * 2 + 90))
    let c
    if (r < 10) { c = 0x0030 + r } else { r -= 10 } // digits
    if (!c && r < 26) { c = 0x0041 + r } else { r -= 26 } // upper-latin
    if (!c && r < 26) { c = 0x0061 + r } else { r -= 26 } // lower-latin
    if (!c) c = 0x30a1 + r // katakana
    return String.fromCharCode(c)
  },
  createStream (env, options) {
    const { createValidStreamX, createSymbol } = options
    const x = createValidStreamX(env, options)

    if (x >= 0) {
      const symbol = createSymbol(env, options, { x })
      return {
        x,
        symbols: [symbol],
        first: symbol,
        last: symbol,
      }
    } else return null
  },
  createValidStreamX (env, options) {
    const { createStreamX, validateStreamX } = options
    for (let i = 0; i < 10; i++) {
      const x = createStreamX(env, options)
      if (validateStreamX(x, env, options)) return x
    }
    return -1
  },
  validateStreamX (x, { streams }) {
    return streams.every(e => e.x !== x || e.first.hidden)
  },
  createStreamX (env, { canvasWidth, textSize }) {
    return Math.floor(Math.random() * (canvasWidth / textSize)) * textSize
  },
  createSymbol (env, options, inital) {
    const { color, textSize, createText } = options

    return {
      x: 0,
      y: textSize,
      text: createText(env, options),
      textSize,
      color,
      ...inital,
    }
  },
  createNextSymbol (env, options) {
    const { stream } = env
    const { textSize, createSymbol } = options
    const symbol = createSymbol(env, options, { x: stream.x, y: stream.last.y + textSize })
    stream.symbols.push(symbol)
    stream.last = symbol
  },
  render ({ p, stream }) {
    stream.symbols.forEach(e => {
      if (!e.hidden) {
        p.fill(e.color)
        p.textSize(e.textSize)
        p.textAlign(p.CENTER)
        p.text(e.text, e.x, e.y)
      }
    })
  },
  nextTick (env, options) {
    const { changeSymbolPerTick, createNextSymbol, isHiddenStream, hideStream } = options
    // fade out
    env.stream.symbols.forEach(symbol => changeSymbolPerTick({ ...env, symbol }, options))
    // next symbol
    if (isHiddenStream(env, options)) hideStream(env, options)
    else createNextSymbol(env, options)
  },
  changeSymbolPerTick (env, options) {
    const { changeSymbolTextPerTick, changeSymbolColorPerTick, isHiddenSymbol, hideSymbol } = options
    changeSymbolTextPerTick(env, options)
    changeSymbolColorPerTick(env, options)
    if (isHiddenSymbol(env, options)) hideSymbol(env, options)
  },
  changeSymbolTextPerTick ({ symbol }, { symbolTextChangeRate, createText }) {
    if (Math.random() < symbolTextChangeRate) symbol.text = createText()
  },
  changeSymbolColorPerTick ({ p, symbol }, { symbolAlphaChangeDiff }) {
    const alpha = p.alpha(symbol.color) + symbolAlphaChangeDiff
    symbol.color = p.color(0, 255, 70, alpha)
  },
  isHiddenSymbol ({ p, symbol }) {
    return symbol.hidden || p.alpha(symbol.color) <= 0
  },
  hideSymbol ({ symbol, stream }) {
    symbol.hidden = true
    stream.lastHidden = symbol
  },
  isHiddenStream ({ stream }, { canvasHeight }) {
    return stream.hidden || (stream.lastHidden && stream.lastHidden.y > canvasHeight)
  },
  hideStream ({ stream }) {
    stream.hidden = true
  }
}