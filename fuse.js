const { FuseBox } = require('fuse-box')

const mode = process.argv[2] // dev | prod

const fuse = FuseBox.init({
  homeDir: 'client/',
  output: 'client/$name',
  globals: { default: 'fw' },
})

if (mode === 'dev') {
  fuse.dev({
    port : 3000,
    socketURI: 'ws://localhost:3333',
  })

  fuse
    .bundle('index.js')
    .hmr()
    .watch()
    .instructions('>index.ts')
} else {
  fuse.bundle('index.js').instructions('>index.ts')
}


fuse.run()
