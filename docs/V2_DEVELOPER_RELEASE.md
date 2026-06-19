# StarVault v2.0: Developer Release

Theme: from product to platform.

v2 is the first release where another developer should be able to integrate StarVault into their own application.

## Goals

- Production-ready public APIs
- Multi-application support
- OAuth-like authorization centered on data ownership
- JavaScript and Python SDKs
- User dashboard control center
- Developer portal with API explorer
- AI Gateway preview
- Real security model
- Public beta

## Application Registry

Developers register applications before requesting access.

Registration returns:

- App ID
- Client secret
- Public key binding
- Redirect URIs
- Rate limit tier

Endpoint:

```http
POST /applications
GET /applications
GET /applications/{app_id}
```

Example:

```json
{
  "name": "ResumeAI",
  "redirect_uris": ["https://resumeai.example/callback"],
  "public_key": "-----BEGIN PUBLIC KEY-----...",
  "rate_limit_tier": "sandbox"
}
```

## OAuth-like Authorization

StarVault v2 uses a redirect flow similar to OAuth, but the center of the flow is data ownership and capability consent.

```text
Application
  -> Redirect user to StarVault
  -> StarVault login
  -> Consent screen
  -> Authorization code
  -> Capability token
```

Endpoints:

```http
POST /oauth/authorize
POST /oauth/token
POST /tokens/revoke
POST /tokens/introspect
```

## Data Capability Tokens

The core v2 differentiator is fine-grained data capabilities.

Instead of:

```text
This app can access my resume.
```

StarVault grants:

```json
{
  "resource": "resume",
  "action": "read",
  "fields": ["education", "work_history"],
  "one_time": true,
  "expires_in_seconds": 86400,
  "export_allowed": false,
  "resharing_allowed": false
}
```

Capabilities can express:

- Read-only access
- Specific fields only
- One-time access
- Expiry
- No export
- No re-sharing
- Proof without disclosure

## Dashboard

The dashboard becomes the user control center.

Sections:

- Identity
- Vault
- Resources
- Applications
- Consent Requests
- Audit Timeline
- Settings
- Security Center

Critical user action:

```text
Revoke Access
```

## Developer Portal

The portal should feel closer to Stripe than a marketing site.

Pages:

- Quick Start
- Authentication
- SDKs
- Examples
- API Explorer
- Tutorials
- OpenAPI Docs
- Protocol Docs

Success target:

- A developer can make the first API call in under five minutes.

## SDK Examples

JavaScript:

```ts
const sv = new StarVaultClient("https://api.starvault.org", clientId);

await sv.requestAccess({
  resourceType: "resume",
  purpose: "candidate screening",
  redirectUri: "https://resumeai.example/callback",
  state: "opaque_csrf_token",
  capabilities: [
    {
      action: "read",
      resource: "resume",
      fields: ["education", "work_history"],
      oneTime: true,
      expiresInSeconds: 86400,
      exportAllowed: false,
      resharingAllowed: false
    }
  ]
});
```

Python:

```python
client = StarVaultClient("https://api.starvault.org", client_id)

client.request_access(
    resource="resume",
    purpose="candidate screening",
)
```

## AI Gateway Preview

The AI Gateway gives AI systems a consistent permission model.

```text
AI Assistant
  -> Needs Resume
  -> StarVault asks user
  -> Temporary context access
  -> AI reads
  -> Access expires
```

Preview capabilities:

- AI agent identity
- Temporary document access
- Memory permission modes
- Audit timeline for AI reads

## Security Center

Shows:

- Applications
- Devices
- Keys
- Sessions
- Suspicious activity

## Admin Console

Metrics:

- Users
- Resources
- Requests
- Approvals
- Revocations
- Errors
- API uptime

## Public Beta Targets

| Metric | Target |
| --- | --- |
| Registered developers | 100 |
| Test applications | 20 |
| SDK downloads | 500 |
| Successful consent flows | 10,000 |
| API uptime | 99.9% |
| Community SVIPs | 10 |

## v2 Documentation Set

- SVP-0001: Identity
- SVP-0002: Consent
- SVP-0003: Access Tokens
- SVP-0004: Audit
- SVP-0005: Applications
- SVP-0006: Data Capability Tokens
