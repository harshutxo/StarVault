# StarVault V2 — Functional Product Prototype

## Run locally
1. Copy `.env.example` to `.env`.
2. Put your API key in `.env` locally. Never commit it.
3. `npm install`
4. `npm start`
5. Open http://localhost:3000

## Current backend
- Vault health/data API
- Consent API with revoke
- Audit trail API
- Portable identity claim issuance
- Frontend dashboard

## Next production integrations
PostgreSQL, object storage + envelope encryption, real authentication, OAuth/OIDC-compatible StarVault identity, signed consent tokens, append-only audit storage, developer API keys, rate limiting and security monitoring.
