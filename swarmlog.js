var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hsodium = require('hyperlog-sodium')
var hyperlog = require('hyperlog')
var defined = require('defined')
var through = require('through2')
var pump = require('pump')
var normkey = require('./normkey')

module.exports = function (opts) {
  if (typeof opts === 'string') opts = { id: opts }
  if (!opts) opts = {}
  var keys = opts.keys || {}
  var kopts = {
    publicKey: normkey(defined(
      opts.publicKey, opts.public, opts.pub, opts.identity, opts.id,
      keys.publicKey, keys.public, keys.pub, keys.identity, keys.id
    )),
    secretKey: normkey(defined(
      opts.secretKey, opts.secret, opts.private, opts.priv,
      keys.secretKey, keys.secret, keys.private, keys.priv
    ))
  }
  var topic = kopts.publicKey.toString('hex')
  var log = hyperlog(opts.db, hsodium(opts.sodium, kopts, opts))
  var hub = signalhub('swarmlog.' + topic, opts.hubs)
  var sw = swarm(hub, opts)
  var peerStream = opts.peerStream || function (peer) { return peer }

  var streams = []
  sw.on('peer', function (peer, id) {
    var stream = peerStream(peer)
    stream.push(stream)
    pump(stream, toBuffer(), log.replicate({ live: true }), stream)
  })
  log.swarm = sw
  log.hub = hub
  return log
}

function toBuffer () {
  return through.obj(function (buf, enc, next) {
    next(null, Buffer.isBuffer(buf) ? buf : Buffer(buf))
  })
}
