var SimplePeer = require('simple-peer')

var connected = false

var keys
var remotePublicKey

var publicKeyElm = document.getElementById('public-key')
var publicKeyInput = document.getElementById('remote-public-key')
var saveRemotePublicKeyBtn = document.getElementById('save-remote-public-key')
var remoteAnsElm = document.getElementById('remote-ans')
var remoteAnsInput = document.getElementById('remote-ans-input')
var saveRemoteAnsBtn = document.getElementById('save-remote-ans')
var logElm = document.getElementById('log')
var messageInput = document.getElementById('message')
var sendBtn = document.getElementById('send')

var peer = new SimplePeer({ initiator: true, trickle: false })

var addListeners = (peer, offerer) => {

  peer.on('connect', () => {
    connected = true
    console.log('CONNECTED')
  })

  if (offerer) {
    peer.on('signal', data => {
      publicKeyElm.innerHTML = JSON.stringify(data)
    })
  } else {
    var answer = []
    peer.on('signal', data => {
      answer.push(data)
      if (answer.length === 2) {
        remoteAnsElm.innerHTML = JSON.stringify(answer)
      }
    })
  }

  peer.on('data', data => {
    var obj = JSON.parse(data.toString())
    console.log(obj)
    elm = document.createElement('div')
    elm.innerHTML = obj.time.toString() + ' - remote: ' + obj.msg
    logElm.appendChild(elm)
  })

}

addListeners(peer, true)

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

saveRemotePublicKeyBtn.addEventListener('click', () => {
  remotePublicKey = publicKeyInput.value
  if (remotePublicKey !== '') {
    listenLog(remotePublicKey, logElm)
  }
})

saveRemoteAnsBtn.addEventListener('click', () => {
  if (remoteAnsInput.value !== '') {
    var data = JSON.parse(remoteAnsInput.value)
    setTimeout(() => peer.signal(data[0]), 0)
    setTimeout(() => peer.signal(data[1]), 0)
  }
})

function listenLog (remotePublicKey) {
  var elm
  peer.destroy()
  peer = new SimplePeer()
  addListeners(peer, false)
  peer.signal(remotePublicKey)
}
