/**
 * TODOs
 * - Make content replicable
 */

import SimplePeer = require('simple-peer')
import wrtc = require('wrtc')

import Koa = require('koa')
import bodyParser = require('koa-bodyparser')
import cors = require('kcors')
import _ = require('koa-route')
const app = new Koa()

app.use(cors())
app.use(bodyParser({ enableTypes: ['text']}))

var peopleIdx = {}

const friendConnection = async (ctx, next) => {
  if (ctx.request.method === 'POST') {
    let id
    let peer = new SimplePeer({ wrtc: wrtc })

    peer.on('connect', () => {})

    peer.on('data', data => {
      let findPeer
      var obj = JSON.parse(data.toString())
      switch (obj.type) {
        case 'join':
          id = obj.id
          peopleIdx[id] = peer
          break
        case 'offer':
          findPeer = peopleIdx[obj.id]
          if (findPeer) {
            obj.id = id
            findPeer.send(JSON.stringify(obj))
          } else {
            peer.send(JSON.stringify({ type: 'offerRej' }))
          }
          break
        case 'answer':
          findPeer = peopleIdx[obj.id]
          if (findPeer) {
            obj.id = id
            findPeer.send(JSON.stringify(obj))
          } else {
            peer.send(JSON.stringify({ type: 'answerRej' }))
          }
          break
        default:
          console.log('Unhandled response')
          console.log(obj)
      }
    })

    peer.on('close', () => {
      delete peopleIdx[id]
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
}

// response
app.use(_.post('/hub', friendConnection))

app.listen(3005)

