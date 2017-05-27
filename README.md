# FractalWeb

A minimalist distributed Web communications framework

## Core design principles

- Bring the user ideas to life
- Give all the possible control to the user, and good defaults
- Give the user real value following good design principles (http://www.timewellspent.io/)

## Design

- Written in Typescript
- WebRTC and WebAssembly based

## Use cases

- A user can make public posts
- A user can make private Posts and only replicate on demand to their friends

## POC 1, Simple messaging

Completed:

- Users can join the server with an id
- Users can connect to other users via id
- Users can send messages between them when connected

## POC 2, replicated filtered DB

Design

- Minimal
- Atomic

Each node should have:

- Content index
- People index
  - Followers index

Example:

```javascript

contentIdx = {
  'contentId': { author: '', timestamp: '', type: '', keywords: [], value: '' },
}

peopleIdx = {
  'peopleId': { followersIdx: { token: '' } },
}

```

Concepts:

- Content is indexed in contentIdx
- Direct replication: Node replicate their content based on permissions of followersIdx of itself
- Indirect replication: Node replicate third party content based on follower permissions of the author in the followersIdx of peopleIdx

## POC 2, Asymetric encryption

Use ssb-keys library for that

## Server

The design goal is to have one server per user

Responsabilities:

- Peaple Lookup
- Signaling

### TODOs:

- Secure Authentication via signed message

## Roadmap

- Implement direct replication
- Implement indirect replication
- Wifi automatic replication
- Implement Persistent Nodes

# Ideas

- Automatic Node Protocol Verification: Nodes that are corrupted are isolated

## Resources

- https://wearespindle.com/end-to-end-encryption-between-node-js-and-webcrypto/
