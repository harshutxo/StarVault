# StarVault Hyperledger Direction

The production ledger should use Hyperledger Fabric or a similar permissioned ledger for data-access transaction metadata.

Important rule:

```text
Never store raw user data on-chain.
```

The ledger stores:

- Transaction ID
- Hashed user ID
- Requester application ID
- Resource type
- Purpose
- Scope/capability summary
- Consent ID
- Capability token ID
- Decision
- Previous event hash
- Event hash
- Timestamp

## Chaincode Responsibilities

- Record approved access
- Record denied access
- Record revoked access
- Record expired access
- Verify hash-chain continuity
- Return user-visible transaction history

## Future Fabric Layout

```text
organizations:
  starvault-foundation
  audited-enterprise-node
  research-node
  government-node

channels:
  data-access-transactions

chaincode:
  starvault-barrier
```
