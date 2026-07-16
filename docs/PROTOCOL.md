# StarVault Protocol Architecture

StarVault should be treated as a platform with an open protocol. The protocol defines how identity, consent, access, audit, and federation work. The platform provides reference apps, SDKs, hosted services, developer tools, and documentation that make the protocol usable.

SVP should be designed as a living protocol. The goal is not a final feature-complete product, but a stable interoperable core that can evolve through StarVault Improvement Proposals.

```text
Applications
AI | Healthcare | Finance | HR | Social
        |
Developer SDKs
Python | JavaScript | Java | Go | Swift
        |
StarVault Protocol (SVP)
Identity | Data Access Barrier | Consent | Access Gateway | Vault | Policy
Audit | Discovery | Federation | Cryptography | Governance
        |
Storage Providers
Cloud | IPFS | Local | Enterprise
        |
Internet
```

## Core Layers

### Identity Layer

Answers: who owns the data?

Responsibilities:

- User registration
- Authentication
- Public/private keys
- Passkeys
- DIDs later

APIs:

- `POST /users`
- `POST /login`
- `GET /me`

### Vault Layer

Stores encrypted user resources.

Responsibilities:

- Upload
- Download
- Delete
- Metadata
- Resource registry

APIs:

- `POST /vault/upload`
- `GET /vault/resource`
- `DELETE /vault/resource`

### Cryptography Layer

Protects user data before it leaves the user-controlled environment.

Responsibilities:

- AES encryption
- Key derivation
- Key management
- Key rotation

Future:

- Hardware-backed keys
- User-owned recovery
- Threshold recovery

### Consent Layer

This is the heart of StarVault.

Responsibilities:

- Create consent requests
- Approve
- Reject
- Revoke
- Expire
- Record purpose, scope, benefit, and retention

APIs:

- `POST /consent/request`
- `POST /consent/approve`
- `POST /consent/revoke`

### Data Access Barrier

The barrier is the mandatory control point between user data and every application, AI agent, company, researcher, or institution.

Responsibilities:

- Receive data access requests
- Verify consent
- Evaluate policy
- Enforce capability limits
- Issue or deny temporary access
- Record every decision to a tamper-evident ledger
- Keep raw user data off the ledger

APIs:

- `POST /barrier/authorize`
- `POST /barrier/deny`
- `GET /barrier/transactions`

### Access Gateway

Generates temporary, scoped access.

Responsibilities:

- Scoped tokens
- JWT or equivalent signed grants
- Expiration
- One-time access
- Revocation checks

Example:

```json
{
  "resource": "resume",
  "mode": "read",
  "expires_in": "24h",
  "export_allowed": false
}
```

### Audit Layer

Everything is logged so users can inspect who accessed what, why, and when.

APIs:

- `GET /audit/events`

### Policy Engine

Evaluates rules before access is granted.

Example:

```text
Doctor may read medical records.
Doctor cannot export medical records.
AI agent may use notes for this session only.
```

### Discovery Layer

Lets apps and nodes find StarVault capabilities.

Suggested endpoint:

- `GET /.well-known/starvault`

### Federation Layer

Allows multiple StarVault nodes to communicate.

Examples:

- University node
- Hospital node
- Government node
- Personal self-hosted node

### Governance Layer

Defines protocol proposals through StarVault Improvement Proposals.

Proposal format:

- `SVIP-0001`
- `SVIP-0002`
- `SVIP-0003`

Long-term governance should allow outside developers, researchers, institutions, and independent node operators to contribute proposals and implementations.

## Roadmap

### Phase 1: Core Protocol MVP

- Identity Layer
- Vault Layer
- Cryptography Layer
- Consent Engine
- Access Gateway
- Audit Layer
- Resource Registry

### Phase 2: Developer Platform

- Application Registry
- Developer SDKs
- API Gateway
- Event System

### Phase 3: Decentralization

- DID Layer
- Distributed Storage
- Federation
- Optional blockchain anchoring for audit proofs and timestamps

### Phase 4: AI Infrastructure

- AI Context Gateway
- Memory permissions
- AI agent identity
- AI audit history

### Phase 5: Enterprise

- Policy Engine
- Compliance Engine
- Trust Score

### Phase 6: Ecosystem

- Connector marketplace
- Governance
- Protocol docs
- SDK docs
- Tutorials

### 2035 Horizon: Internet Standard

- StarVault Identity replaces platform-owned identities for participating apps.
- Applications support `Connect with StarVault`.
- AI agents receive temporary scoped access instead of permanent data copies.
- StarVault nodes federate globally.
- SVP becomes a standard language for identity, consent, permissions, audit, revocation, and AI context.
