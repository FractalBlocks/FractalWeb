var SimplePeer = require('simple-peer')
var wrtc = require('wrtc')

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
var cors = require('koa-cors')
const app = new Koa()

app.use(cors()) // TODO: update to middleware V2
app.use(bodyParser({ enableTypes: ['text']}))

var peopleIdx = {}

// response
app.use(async (ctx, next) => {
  if (ctx.request.method === 'POST') {
    let peer = new SimplePeer({ wrtc: wrtc })

    peer.on('connect', () => {})

    peer.on('data', data => {
      let findPeer
      var obj = JSON.parse(data.toString())
      switch (obj.type) {
        case 'join':
          peopleIdx[obj.value] = peer
          break
        case 'offer':
          findPeer = peopleIdx[obj.value.id]
          if (findPeer) {
            findPeer.send(obj)
          } else {
            peer.send({ type: 'offerRej' })
          }
          break
        case 'answer':
          findPeer = peopleIdx[obj.value.id]
          if (findPeer) {
            findPeer.send(obj)
          } else {
            peer.send({ type: 'answerRej' })
          }
          break
        default:
          console.log('Unhandled response')
          console.log(obj)
      }
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
