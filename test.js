var SimplePeer = require('simple-peer')

var peer1 = new SimplePeer({ initiator: true, trickle: false })
var peer2 = new SimplePeer()

peer1.on('signal', function (data) {
  // when peer1 has signaling data, give it to peer2 somehow
  console.log('P1')
  console.log(data)
  peer2.signal(data)
})

peer2.on('signal', function (data) {
  // when peer2 has signaling data, give it to peer1 somehow
  console.log('P2')
  console.log(data)
  peer1.signal(data)
})

peer1.on('connect', function () {
  // wait for 'connect' event before using the data channel
  console.log('CONNECTED1')
})

peer2.on('connect', function (data) {
  console.log('CONNECTED2')
})
