# Architecture

- Each user has a server an can have many clients
- A server allows user to have a permanent store and prescence on the Web, also can have many servers according with her traffic (load balancing)
- Clients can be flexible and partial stores, clients can have many possible UIs, allows user control and customization

## Models

- User
  - _classes: Friend | Following | Follower
  - id
  - jwt, authentication token
  - ServerURL
- Content
  - _classes: Liked | Tagged | Shared, these are classes that owner
  - id
  - type
  - author
  - tagged: user index of related users
  - related: content index of related things
  - keywords
  - timestamp
  - hash, object hash (id + plain normalized stringified object)

## Use cases

- Client initialization
- Server initialization
- Client can be in lazy mode, connection with Server only
- Client can be in Hiper mode, connection with all the users
- Server can host many clients via friends replication

## Post spreading

- Client post content
- Client send to friends / followers
- Client want to fetch some news, fetch for latest friends news and sync

## Web app architecture

- Service worker as a App Shell via WebWorker
  - Waiting for https://github.com/w3c/webrtc-pc/issues/230
  - Related to https://github.com/webtorrent/webtorrent/issues/288
- Webapp as a client

## Server

- Listen for changes in other nodes
- Make resumes, this means multiple a optimized feeds

## Client

- Make and post content
- Fetch news

## Simplest version, ASAP

- Make a Pub (Public Server)
- Make a lite client
