new p5(p => {
  const { innerWidth, innerHeight } = window

  p.setup = function () {
    p.createCanvas(innerWidth, innerHeight)
    p.background(0)
  }

  p.draw = function () {
    p.background(0)
  }
})