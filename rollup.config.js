export default [{
  input: 'node_modules/p5/lib/p5.js',
  output: {
    file: 'public/dist/p5.js',
    sourcemap: true
  }
}, {
  input: 'src/main.js',
  output: {
    file: 'public/dist/bundle.js'
  },
  external: ['p5']
}]