var memdb = require('memdb')
var swarmlog = require('./swarmlog.js')
var hubs = require('./hubs.js')
process.env.CHLORIDE_JS = true
var ssbKeys = require('ssb-keys')

var keys
var remotePublicKey

var publicKeyElm = document.getElementById('public-key')
var publicKeyInput = document.getElementById('remote-public-key')
var saveRemotePublicKeyBtn = document.getElementById('save-remote-public-key')
var logElm = document.getElementById('log')
var messageInput = document.getElementById('message')
var sendBtn = document.getElementById('send')

keys = ssbKeys.generate()
publicKeyElm.innerHTML = keys.public

var log = swarmlog({
  keys: keys,
  sodium: require('chloride/browser'),
  db: memdb(),
  valueEncoding: 'json',
  hubs,
})

var sendMsg = () => {
  var msg = messageInput.value
  messageInput.value = ''  
  if (msg !== '') {
    var time = Date.now()
    elm = document.createElement('div')
    elm.innerHTML = time.toString() + ' - you: ' + msg
    logElm.appendChild(elm)
    log.append({ time: time, msg: msg })
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

function listenLog (remotePublicKey, logElm) {
  var log = swarmlog({
    publicKey: remotePublicKey,
    sodium: require('chloride/browser'),
    db: memdb(),
    valueEncoding: 'json',
    hubs,
  })

  var elm
  log.createReadStream({ live: true })
    .on('data', function (data) {
      console.log(data)
      elm = document.createElement('div')
      elm.innerHTML = data.value.time.toString() + ' - remote: ' + data.value.msg
      logElm.appendChild(elm)
    })
}
