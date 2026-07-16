# StarVault Services

FastAPI service boundary for StarVault v1.0.

Services:

- `identity`: users, login, profiles, future OAuth/passkeys
- `applications`: developer application registry, app IDs, client secrets, redirect URIs
- `barrier`: consent, policy, token, and ledger gate between user data and requesters
- `vault`: encrypted resource upload, download, delete, metadata
- `consent`: request, approve, reject, revoke, expire
- `access`: scoped token issue, revoke, introspect
- `gateway`: public OAuth-like authorization and resource APIs
- `audit`: append-only event trail
- `policy`: rules and compliance evaluation
- `notification`: user and developer notifications
