var SimplePeer = require('simple-peer')

var connected = false

var keys
var Offer

var offerElm = document.getElementById('offer')
var offerInput = document.getElementById('remote-offer')
var saveOfferBtn = document.getElementById('save-remote-offer')
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
      offerElm.innerHTML = JSON.stringify(data)
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

saveOfferBtn.addEventListener('click', () => {
  Offer = offerInput.value
  if (Offer !== '') {
    listenLog(Offer)
  }
})

saveRemoteAnsBtn.addEventListener('click', () => {
  if (remoteAnsInput.value !== '') {
    var data = JSON.parse(remoteAnsInput.value)
    peer.signal(data[0])
    peer.signal(data[1])
  }
})

function listenLog (offer) {
  var elm
  peer = new SimplePeer()
  addListeners(peer, false)
  peer.signal(offer)
}
