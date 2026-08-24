# StarVault Dashboard

User-facing application for identity, vault resources, consent requests, applications, audit history, settings, and security.

## V2 Dashboard

The first interactive StarVault V2 dashboard prototype is in [`prototype/`](./prototype/).

Open `prototype/index.html` directly for the UI prototype. It demonstrates:

- Personal data overview and vault health
- Vault resource categories
- Portable StarVault identity
- Consent center with revoke controls
- Audit timeline
- Developer API surface preview
- Responsive StarVault visual system

## Planned production stack

- Next.js
- TypeScript
- Tailwind CSS
- React Query
- Passkeys / WebAuthn
- PostgreSQL
- Encrypted object storage
- Signed consent and capability tokens
- Append-only audit infrastructure

The prototype intentionally contains no real secrets and no production credentials.