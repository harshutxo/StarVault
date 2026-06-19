# StarVault Governance

StarVault should evolve as an open protocol with a stable core and continuous improvement.

## Goals

- Keep the core protocol stable enough for developers to trust.
- Allow new capabilities through public proposals.
- Separate company roadmap from protocol governance.
- Encourage interoperable implementations.
- Make security, privacy, and consent review part of the process.

## Proposal Process

Protocol proposals are called StarVault Improvement Proposals.

```text
SVIP-0001
SVIP-0002
SVIP-0003
```

Each proposal should include:

- Summary
- Motivation
- Specification
- Security considerations
- Privacy considerations
- Interoperability impact
- Migration strategy
- Reference implementation notes

## Proposal Statuses

```text
Draft
Review
Accepted
Experimental
Stable
Deprecated
Rejected
```

## Core Protocol Areas

- Identity
- Consent
- Vault resources
- Access tokens
- Data capability tokens
- Audit events
- Application registry
- AI agent identity
- Federation
- Discovery
- Governance

## Compatibility Rules

- Stable SVP versions must be backwards compatible whenever possible.
- Breaking changes require a migration window.
- Capability additions should be feature-detectable.
- Nodes should expose supported protocol versions through discovery.

## Security Review

Any SVIP touching identity, keys, consent, tokens, or audit must include a security review section.

Required questions:

- What can an attacker gain?
- Can this weaken user consent?
- Can this expand data access silently?
- What happens when keys are compromised?
- How does revocation work?
- What gets logged?

## Governance Reality

Early StarVault governance will be founder-led. Over time, it should move toward an open working group model with maintainers, reviewers, and independent implementers.
