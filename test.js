var SimplePeer = require('simple-peer')

var peer1 = new SimplePeer({ initiator: true, trickle: false })
var peer2 = new SimplePeer()

peer1.on('signal', function (data) {
  // when peer1 has signaling data, give it to peer2 somehow
  console.log('P1')
  console.log(data)
  setTimeout(() => peer2.signal(data), 5000)
})

var signals = []
peer2.on('signal', function (data) {
  // when peer2 has signaling data, give it to peer1 somehow
  console.log('P2')
  signals.push(data)
  if (signals.length === 2) {
    console.log(signals)
    setTimeout(() => {
      peer1.signal(signals[0])
      peer1.signal(signals[1])
    }, 5000)
  }
})

peer1.on('connect', function () {
  // wait for 'connect' event before using the data channel
  console.log('CONNECTED1')
  peer1.send('gg')
})

peer2.on('connect', function (data) {
  console.log('CONNECTED2')
  peer2.send('ff')
})

peer1.on('data', data => console.log(data.toString()))
peer2.on('data', data => console.log(data.toString()))
