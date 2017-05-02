module.exports = function normkey (id) {
  if (/\.ed25519$/.test(id)) {
    var b64 = id.replace(/\.ed25519$/,'').replace(/^@/,'')
    return Buffer(b64,'base64')
  } else if (Buffer.isBuffer(id)) {
    return id
  } else if (id) return Buffer(id, 'hex')
}
