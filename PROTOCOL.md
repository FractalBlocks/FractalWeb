# FractalWeb Protocol

# Client - Client

- Client

## Client - Server

/friend: Friend request

- Client send an HTTP-POST request to Server `hub/` with an WebRTC offer in the body


/hub: Connection

- Client send an HTTP-POST request to Server `hub/` with an WebRTC offer in the body
- Server returns the WebRTC answer and candidate in the response body
- When connection is established Client send via data channel: `{ id: id, type: 'join' }`
- Server verify that Client is a friend with secure-handshake (TODO: define it)
- TODO: complete that
