# StarVault

StarVault is a launch MVP for a personal data permission network: secure local encrypted storage, identity vault, consent API gateway, scoped access tokens, permission dashboard, access logs, data imports, revoke controls, surveillance mapping, and an AI privacy scanner.

The long-term architecture is a platform with an open protocol. The StarVault Protocol (SVP) defines how identity, consent, access, audit, discovery, federation, and governance work. The StarVault platform provides reference apps, SDKs, developer tooling, hosted services, and documentation that make adoption easier.

There is probably no final version of StarVault. The protocol should evolve through a stable core, public proposals, interoperable implementations, and long-term research.

Positioning:

> StarVault is the network layer for human consent in the AI economy.

## StarVault v1.0 monorepo

This repository is being reshaped into a production-style protocol company monorepo:

```text
apps/
  website
  dashboard
  developer-portal
  admin
services/
  identity
  applications
  vault
  consent
  access
  gateway
  audit
  policy
  notification
packages/
  ui
  protocol
  protocol-spec
  protocol-sdk-js
  protocol-sdk-python
  shared-types
docs/
whitepaper/
infrastructure/
```

The original static prototype still lives at the repository root and can be run with `node server.mjs`. The new Next.js website lives in `apps/website`.

## MVP scope

- Secure encrypted browser vault using WebCrypto AES-GCM and PBKDF2
- Identity profile storage inside the encrypted vault
- Permission dashboard for app/company access requests
- One-click permission revoke flow
- Local access logs and import history
- Demo import connectors for common app export sources
- AI privacy scanner prototype for sensitive data and risky permissions
- Surveillance map for data broker exposure and extraction attempts
- Deny-by-default consent policy with purpose, scope, expiry, benefit, and revocation tracking
- Data broker opt-out and erasure request queue
- Local StarVault Network console for consent API requests
- Scoped, revocable network access-token simulation
- Network primitives for consent requests, token issue/revoke, audit events, and identity proofs
- Protocol architecture console for SVP layers, component status, and governance proposals

## Protocol docs

- [Protocol architecture](docs/PROTOCOL.md)
- [API draft](docs/API.md)
- [Roadmap](docs/ROADMAP.md)
- [v2 Developer Release](docs/V2_DEVELOPER_RELEASE.md)
- [Long-term vision](docs/LONG_TERM_VISION.md)
- [Governance](docs/GOVERNANCE.md)
- [Research agenda](docs/RESEARCH.md)
- [Public API surface](docs/OPENAPI.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [SVIP-0001: Core Consent Request Format](docs/SVIP-0001.md)
- [SVP-0006: Data Capability Tokens](docs/SVP-0006-DATA-CAPABILITY-TOKENS.md)

## Run locally

Prototype:

Serve the folder locally so browser encryption APIs run in a trusted localhost context.

```powershell
node server.mjs
```

Then visit `http://localhost:5173`.

Next.js website:

```powershell
npm install
npm run dev
```

GitHub Pages website:

```text
https://harshutxo.github.io/StarVault/
```

## Product roadmap

### Phase 1: Personal Data Vault

The consumer MVP solves the immediate trust problem: users get value before any marketplace or token model exists.

### Phase 2: Consent Infrastructure API

Companies can request permissioned access with audit trails for health apps, finance apps, AI companies, and hiring platforms.

### Phase 2.5: StarVault Network Layer

StarVault becomes a gateway between users and external data requesters. Apps submit consent requests, users issue scoped tokens, and every grant remains time-limited, auditable, and revocable.

### Phase 3: Monetization Layer

Users may opt into anonymized insights, licensed data access, research participation, or AI training permissions after trust is established.

## Important prototype note

This MVP encrypts data locally in the browser. A production StarVault should add backend authentication, secure key recovery, hardware-backed key options, API audit infrastructure, compliance review, and independent security testing.
