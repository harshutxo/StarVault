# StarVault Protocol API Draft

This is an early draft of the StarVault Protocol API surface. It is not production-ready, but it gives the project a clear technical target.

## Identity

```http
POST /users
POST /login
GET /me
```

## Vault

```http
POST /vault/upload
GET /vault/resource/:id
DELETE /vault/resource/:id
```

## Consent

```http
POST /consent/request
POST /consent/approve
POST /consent/reject
POST /consent/revoke
```

Example consent request:

```json
{
  "requester_app_id": "app_hiresignal",
  "resource_type": "resume",
  "purpose": "candidate verification",
  "scope": ["read"],
  "duration_seconds": 86400,
  "export_allowed": false,
  "user_benefit": "job application verification"
}
```

## Access Gateway

```http
POST /tokens/issue
POST /tokens/revoke
POST /tokens/introspect
```

Example token claims:

```json
{
  "sub": "user_123",
  "aud": "app_hiresignal",
  "resource": "resume_456",
  "scope": ["read"],
  "purpose": "candidate verification",
  "exp": 1790000000,
  "export_allowed": false
}
```

## Data Access Barrier

```http
POST /barrier/authorize
POST /barrier/deny
GET /barrier/transactions
```

Example barrier authorization request:

```json
{
  "user_id": "user_123",
  "requester_app_id": "sv_app_resumeai",
  "requester_name": "ResumeAI",
  "resource_type": "resume",
  "purpose": "candidate screening",
  "consent_id": "consent_123",
  "capabilities": [
    {
      "action": "read",
      "resource": "resume",
      "fields": ["education", "work_history"],
      "one_time": true,
      "expires_in_seconds": 7200,
      "export_allowed": false,
      "resharing_allowed": false
    }
  ]
}
```

The response includes a capability token when approved and a ledger event in all cases.

## Audit

```http
GET /audit/events
```

Example audit event:

```json
{
  "event_id": "evt_123",
  "actor": "app_hiresignal",
  "action": "resource.read",
  "resource": "resume_456",
  "purpose": "candidate verification",
  "time": "2026-06-18T16:00:00Z"
}
```

## Discovery

```http
GET /.well-known/starvault
```

Example response:

```json
{
  "protocol": "svp",
  "version": "0.1",
  "node_id": "svn_example",
  "capabilities": ["consent", "vault", "audit", "tokens"]
}
```
