var SimplePeer = require('simple-peer')
var wrtc = require('wrtc')

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()

app.use(bodyParser({ enableTypes: ['text']}))

var peer

// response
app.use(async (ctx, next) => {
  if (ctx.request.method === 'POST') {
    console.log(ctx.request.body)
    peer = new SimplePeer({ wrtc: wrtc })
    peer.on('connect', () => {
      console.log('CONNECTED')
    })

    peer.on('data', data => {
      var obj = JSON.parse(data.toString())
      console.log(obj)
    })

    await new Promise((resolve, reject) => {
      var answer = []
      peer.on('signal', data => {
        answer.push(data)
        if (answer.length === 2) {
          ctx.body = JSON.stringify(answer)
          resolve()
        }
      })
      peer.signal(ctx.request.body)
    })

  }
  await next()
})

app.listen(3005)
