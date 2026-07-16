# StarVault Data Access Barrier

StarVault's central design is a barrier between the user's data and every party that wants to access it.

```text
User Data
   |
StarVault Data Access Barrier
   |
Consent -> Policy -> Capability Token -> Ledger Record
   |
Application / AI / Company / Researcher
```

No application, AI agent, company, or researcher should touch user data directly. Every access must pass through the barrier.

## Core Rule

```text
No data leaves without consent.
No access happens without limits.
No transaction disappears.
```

## Questions Every Access Must Answer

- Who is requesting?
- What data do they want?
- Why do they need it?
- How long do they need it?
- What can they do with it?
- Can they copy or export it?
- Can they train AI on it?
- Can the user revoke it?
- Was the transaction recorded?

## Ledger Model

StarVault should use a Hyperledger-style permissioned ledger for transaction accountability. Raw personal data must never be written to the ledger.

Ledger events store metadata and proofs:

- Transaction ID
- Hashed user ID
- Application ID
- Resource type
- Permission scope
- Purpose
- Consent ID
- Capability token ID
- Decision
- Timestamp
- Previous event hash
- Event hash

## Why Hyperledger-Style Instead Of Public Blockchain

Use Hyperledger Fabric or a similar permissioned ledger because StarVault needs:

- Private consortium governance
- Enterprise auditability
- Permissioned validators
- No public exposure of personal metadata
- Deterministic transaction records
- Pluggable privacy controls

The ledger proves that an access transaction happened. It does not store the user's data.

## Barrier Flow

```text
1. App registers with StarVault.
2. App requests a resource.
3. User sees purpose, scope, duration, export rules, and AI-training rules.
4. Policy engine checks the request.
5. User approves or denies.
6. Access gateway issues a capability token if approved.
7. Barrier records transaction metadata to the ledger.
8. App receives temporary access.
9. User can revoke access.
10. Revocation is also written to the ledger.
```

## First Implementation

The first implementation can use a local append-only hash chain. Later, the same event model can be backed by Hyperledger Fabric.

Local development:

- `POST /barrier/authorize`
- `POST /barrier/deny`
- `POST /barrier/revoke/{token_id}`
- `GET /barrier/transactions`
- `GET /barrier/verify`

Production direction:

- Hyperledger Fabric channel for data-access transaction metadata
- Chaincode for consent approval, denial, revocation, and expiry
- Private data collections for sensitive metadata where needed
- Off-chain encrypted vault for actual user data
