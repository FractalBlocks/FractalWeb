var SimplePeer = require('simple-peer')

var connected = false

var idInput = document.getElementById('identifier')
var connectBtn = document.getElementById('connect-btn')
var logElm = document.getElementById('log')
var messageInput = document.getElementById('message')
var sendBtn = document.getElementById('send')

var peer

connectBtn.addEventListener('click', () => {

  if (idInput.value === '') {
    return
  }

  peer = new SimplePeer({ initiator: true, trickle: false })

  peer.on('connect', () => {
    connected = true
    console.log('CONNECTED')
    peer.send(JSON.stringify({ type: 'join', value: idInput.value }))
  })

  peer.on('signal', data => {
    fetch('http:localhost:3005', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(res => res.text())
      .then(rawSigals => {
        let signals = JSON.parse(rawSigals)
        peer.signal(signals[0]) // answer
        peer.signal(signals[1]) // candidate
      })
  })

  peer.on('data', data => {
    var obj = JSON.parse(data.toString())
    console.log(obj)
    elm = document.createElement('div')
    elm.innerHTML = obj.time.toString() + ' - remote: ' + obj.msg
    logElm.appendChild(elm)
  })
})

var sendMsg = () => {
  if (!connected) {
    return
  }
  var msg = messageInput.value
  messageInput.value = ''
  if (msg !== '') {
    var time = Date.now()
    elm = document.createElement('div')
    elm.innerHTML = time.toString() + ' - you: ' + msg
    logElm.appendChild(elm)
    peer.send(JSON.stringify({ time: time, msg: msg }))
  }
}

sendBtn.addEventListener('click', sendMsg)
messageInput.addEventListener('keyup', ev => {
  if (ev.keyCode === 13) {
    sendMsg()
  }
})
