/**
 * TODOs
 * - Make content replicable
 */

// import SimplePeer = require('simple-peer')
// import wrtc = require('wrtc')

import Koa = require('koa')
import bodyParser = require('koa-bodyparser')
import cors = require('kcors')
import jwt = require('koa-jwt')
import jwtLib = require('jsonwebtoken')
import _ = require('koa-route')
import ssbKeys = require('ssb-keys')
import fs = require('fs')

const app = new Koa()

// Configure with files and generate keys with ssb-keys
let keys = ssbKeys.loadOrCreateSync('./keys.json')
let privateKey = keys.private
let publicKey = keys.public
let passwordHash
fs.readFile('./server/passwordHash', 'utf8', function (err,data) {
  if (err) {
    return console.log(err)
  }
  passwordHash = data.slice(0, -1)
})

app.use(cors())
app.use(bodyParser({ enableTypes: ['text']}))

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use((ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401
      ctx.body = 'Protected resource, use Authorization header to get access\n'
    } else {
      throw err
    }
  })
})

// Unprotected middleware

app.use(_.get('/', async (ctx, next) => {
  ctx.body = JSON.stringify({ serverName: 'FractalWeb', version: '0.0.1', publicKey })
}))

app.use(_.post('/login', async (ctx, next) => {
  if (passwordHash !== ctx.request.body) {
    return
  }
  var token = jwtLib.sign({ publicKey }, privateKey)
  ctx.body = token
}))

// authentication with signed handshake (pub | normal mode)
app.use(_.post('/auth', async (ctx, next) => {
  ctx.body = 'hola_ggasd'
}))

// Middleware below this line is only reached if JWT token is valid
app.use(jwt({ secret: privateKey }))



app.use(_.post('/connect', async (ctx, next) => {
  ctx.body = 'hola_ggasd'
}))

app.use(_.post('/request', async (ctx, next) => {
  ctx.body = 'hola_gg'
}))

app.listen(3005)
