# FractalWeb (MVP)

A minimalist distributed Web communications framework

## MVP

- Public Messaging App

## Architecture

- Store
    - Hyperlog
- Processing (APIs)
    - Public Messaging
    - Private Messaging
    - Profile sharing
- Comunications (agnostic)
    - Discovery service
        - LAN Discovery: UDP Multicasting
        - Web Discovery: webrtc-swarm <-> signalhub
    - Sync service
        - WSS Sync (local)
        - Web Sync

## Nodes

Each Node has separated logs for each API, e.g. Profile, Public / Private Messaging for simplicity.
For example if there are a conversation or thread between two Nodes (people) each one has a log.

## Hubs

- Signaling server accesible using invitations
- Public Node that caches logs and media

## TODOs

- Copy tests from swarmlog

## Dependencies

- app

chloride
memdb
ssb-keys

- swarmlog

webrtc-swarm
signalhub
hyperlog-sodium
hyperlog
defined
through2
pump

// npm i --save chloride memdb ssb-keys webrtc-swarm signalhub hyperlog-sodium hyperlog defined through2 pump
