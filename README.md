# StarVault

StarVault is a launch MVP for a personal data vault: secure local encrypted storage, identity vault, permission dashboard, access logs, data imports, revoke controls, and an AI privacy scanner.

Positioning:

> StarVault is the operating system for personal data ownership in the AI age.

## MVP scope

- Secure encrypted browser vault using WebCrypto AES-GCM and PBKDF2
- Identity profile storage inside the encrypted vault
- Permission dashboard for app/company access requests
- One-click permission revoke flow
- Local access logs and import history
- Demo import connectors for common app export sources
- AI privacy scanner prototype for sensitive data and risky permissions

## Run locally

Serve the folder locally so browser encryption APIs run in a trusted localhost context.

```powershell
node server.mjs
```

Then visit `http://localhost:5173`.

## Product roadmap

### Phase 1: Personal Data Vault

The consumer MVP solves the immediate trust problem: users get value before any marketplace or token model exists.

### Phase 2: Consent Infrastructure API

Companies can request permissioned access with audit trails for health apps, finance apps, AI companies, and hiring platforms.

### Phase 3: Monetization Layer

Users may opt into anonymized insights, licensed data access, research participation, or AI training permissions after trust is established.

## Important prototype note

This MVP encrypts data locally in the browser. A production StarVault should add backend authentication, secure key recovery, hardware-backed key options, API audit infrastructure, compliance review, and independent security testing.
