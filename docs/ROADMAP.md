# StarVault Roadmap

StarVault should be built as a platform with an open protocol. The consumer vault proves the trust loop. The protocol and developer platform make it infrastructure.

## Roadmap Principles

- Start with a user problem: people need to see, control, revoke, and understand data access.
- Use the protocol to standardize consent, access, audit, and identity.
- Use the platform to make adoption easy through SDKs, hosted services, docs, dashboards, and reference apps.
- Treat AI access as a first-class threat and opportunity.
- Keep blockchain optional and limited to audit proofs, timestamping, and integrity.

## Phase 1: Core Protocol MVP

Objective: prove the local vault, consent, token, audit, and scanner loop.

Deliverables:

- Encrypted browser vault
- Identity vault
- Resource registry
- Consent request model
- Approve, deny, revoke, and expire flows
- Scoped token simulation
- Audit log
- Privacy scanner
- Surveillance map
- Protocol docs and SVIP-0001

Success metric:

- A user can understand and control who accesses their data in under 3 minutes.

## Phase 2: Developer Platform

Objective: let external apps request permission through a stable API and SDK.

Deliverables:

- Application registry
- Developer app IDs and keys
- API gateway contract
- JavaScript SDK
- Python SDK
- Webhook event system
- Developer quickstart
- Example partner app

Success metric:

- Three external demo apps can request, receive, and revoke scoped access.

## v2.0: Developer Release

Theme: from product to platform.

v2 is the first version where a third-party developer can realistically integrate StarVault into their own application.

Deliverables:

- Application Registry
- OAuth-like authorization flow
- Data Capability Tokens
- JavaScript SDK `requestAccess`
- Python SDK `request_access`
- Developer Portal
- API Explorer / OpenAPI docs
- User Dashboard control center
- AI Gateway preview
- Security Center
- Admin metrics console

Success criteria:

| Metric | Target |
| --- | --- |
| Registered developers | 100 |
| Test applications | 20 |
| SDK downloads | 500 |
| Successful consent flows | 10,000 |
| API uptime | 99.9% |
| Community SVIPs | 10 |

## Phase 3: AI Context Gateway

Objective: make AI agents request context instead of silently ingesting user data.

Deliverables:

- AI agent identity
- Memory permissions: permanent, session-only, never
- Context request flow for notes, calendar, documents, and preferences
- AI training license request flow
- AI audit timeline

Success metric:

- An AI app can request memory or training access with explicit user approval and revocation.

## Phase 4: Enterprise and Compliance

Objective: make StarVault usable by regulated companies.

Deliverables:

- Policy engine
- Compliance templates for GDPR, HIPAA, SOC 2, and ISO 27001
- App reputation and trust score
- Admin dashboard
- Audit export
- Data processing agreement templates

Success metric:

- A healthcare, finance, or hiring pilot can pass internal privacy review.

## Phase 5: Federation and Decentralization

Objective: allow multiple StarVault nodes and storage providers to interoperate.

Deliverables:

- Discovery document at `/.well-known/starvault`
- Federation handshake
- DID support
- Verifiable credential support
- Distributed storage adapters
- Optional audit anchoring

Success metric:

- Independent StarVault nodes can exchange consent and audit proofs.

## Phase 6: Ecosystem and Marketplace

Objective: turn StarVault into a developer ecosystem.

Deliverables:

- Connector marketplace
- Policy marketplace
- Governance process through SVIPs
- Reference SDKs for JavaScript, Python, Go, Swift, and Java
- Certification program for compliant apps

Success metric:

- Developers can build useful integrations without the core team.

## Next 90 Days

| Period | Focus |
| --- | --- |
| Weeks 1-2 | Harden MVP state model, resource registry, and consent schema. |
| Weeks 3-4 | Create mock REST API contract, SDK examples, and app registry screens. |
| Weeks 5-6 | Build first partner demo: hiring or AI training consent workflow. |
| Weeks 7-8 | Add policy rules, trust scoring, and erasure request exports. |
| Weeks 9-10 | Write whitepaper, SVIP-0001, API docs, and developer quickstart. |
| Weeks 11-12 | Recruit pilot users and 2-3 developer partners for feedback. |

## Immediate Engineering Backlog

1. Add persistent resource IDs and metadata to vault records.
2. Separate consent requests from active permissions.
3. Define token claims and token introspection.
4. Add app registry data model.
5. Add audit event schema.
6. Add policy evaluation function.
7. Add import/export for erasure requests.
8. Add docs for SDK usage.
9. Add tests for encryption, consent, token, revoke, and scanner logic.
10. Prepare hosted API prototype.
