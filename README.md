# FractalWeb (POC)

A minimalist distributed Web communications framework

# POC 1, simple messaging

- Offer / Answer can be interchanged and used to connecct two nodes

- Node1 Offer -> Node2
- Node1 <- Answer Node2

# POC 2, replicated filtered DB

Design

- Minimal
- Atomic Docs (maybe an Hyperlog per doc?)

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
- Indirect replication: Node replicate third party content base on follower permissions of the author in the followersIdx of peopleIdx

# Roadmap

- Implement direct replication
- Implement indirect replication
- Wifi automatic replication
- Implement Persistent Nodes

# Ideas

- Automatic Node Protocol Verification: Nodes that are corrupted are isolated
