var SimplePeer = require('simple-peer')

var connected = false
var connectedFriend = false
var id

var idInput = document.getElementById('identifier')
var serverInput = document.getElementById('server-url')
var connectBtn = document.getElementById('connect-btn')
var friendInput = document.getElementById('friend-id')
var connectFriendBtn = document.getElementById('connect-friend-btn')


var logElm = document.getElementById('log')
var messageInput = document.getElementById('message')
var sendBtn = document.getElementById('send')

var serverPeer
var friendPeer

connectBtn.addEventListener('click', () => {

  id = idInput.value

  if (id === '' || serverInput.value === '') {
    return
  }

  serverPeer = new SimplePeer({ initiator: true, trickle: false })

  serverPeer.on('connect', () => {
    connected = true
    console.log('CONNECTED')
    serverPeer.send(JSON.stringify({ id: id, type: 'join' }))
  })

  serverPeer.on('signal', data => {
    fetch(serverInput.value, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(res => res.text())
      .then(rawSigals => {
        let signals = JSON.parse(rawSigals)
        serverPeer.signal(signals[0]) // answer
        serverPeer.signal(signals[1]) // candidate
      })
  })

  serverPeer.on('data', data => {
    var obj = JSON.parse(data.toString())
    console.log(obj)
    switch (obj.type) {
      case 'offer':
        acceptFriendConn(obj)
        break
      case 'answer':
        if (friendPeer) {
          friendPeer.signal(obj.value[0]) // answer
          friendPeer.signal(obj.value[1]) // candidate
        }
        break
      default:
        console.log('Unknown message from server')
        console.log(obj)
    }
  })

})

connectFriendBtn.addEventListener('click', () => {
  if (friendInput.value === '' || !connected) {
    return
  }
  connectToFriend (friendInput.value)
})

function connectToFriend (id) {
  friendPeer = new SimplePeer({ initiator: true, trickle: false })

  friendPeer.on('connect', () => {
    connectedFriend = true
    console.log('CONNECTED TO ' + id)
  })

  friendPeer.on('signal', data => {
    serverPeer.send(JSON.stringify({ id: id, type: 'offer', value: data }))
  })

  friendPeer.on('data', data => {
    var obj = JSON.parse(data.toString())
    console.log(obj)
    elm = document.createElement('div')
    elm.innerHTML = obj.time.toString() + ' - remote: ' + obj.msg
    logElm.appendChild(elm)
  })

}

function acceptFriendConn (obj) {
  friendPeer = new SimplePeer()

  friendPeer.on('connect', () => {
    connectedFriend = true
    console.log('CONNECTED TO ' + obj.id)
  })

  var answer = []
  friendPeer.on('signal', data => {
    answer.push(data)
    if (answer.length === 2) {
      serverPeer.send(JSON.stringify({ id: obj.id, type: 'answer', value: answer }))
    }
  })

  friendPeer.on('data', data => {
    var obj = JSON.parse(data.toString())
    console.log(obj)
    elm = document.createElement('div')
    elm.innerHTML = obj.time.toString() + ' - remote: ' + obj.msg
    logElm.appendChild(elm)
  })

  friendPeer.signal(obj.value)
}

// SEND MSG

var sendMsg = () => {
  if (!connectedFriend) {
    return
  }
  var msg = messageInput.value
  messageInput.value = ''
  if (msg !== '') {
    var time = Date.now()
    elm = document.createElement('div')
    elm.innerHTML = time.toString() + ' - you: ' + msg
    logElm.appendChild(elm)
    friendPeer.send(JSON.stringify({ time: time, msg: msg }))
  }
}

sendBtn.addEventListener('click', sendMsg)
messageInput.addEventListener('keyup', ev => {
  if (ev.keyCode === 13) {
    sendMsg()
  }
})
