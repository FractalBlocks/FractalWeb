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
const app = new Koa()

let privateKey = 'asdasddsdfds_SDF_SDF_'

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
  ctx.body = 'hola_/'
}))

interface Login {
  publicKey: string
  passwordHash
}

app.use(_.post('/login', async (ctx, next) => {
  let login: Login = ctx.request.body
  if (!login.publicKey || !login.) {

  }
  var token = jwtLib.sign({ foo: 'bar' }, privateKey)
  ctx.body = 'hola'

}))

// Middleware below this line is only reached if JWT token is valid
app.use(jwt({ secret: privateKey }))

app.use(_.get('/gg', async (ctx, next) => {
  ctx.body = 'hola_gg'
}))

// response
// app.use(_.post('/hub', friendConnection))

app.listen(3005)
