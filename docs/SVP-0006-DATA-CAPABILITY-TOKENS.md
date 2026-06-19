# SVP-0006: Data Capability Tokens

Status: Draft

## Summary

Data Capability Tokens are scoped, time-limited grants that describe exactly what an application may do with a specific personal data resource.

## Motivation

Allow/deny permissions are too coarse for AI systems and enterprise workflows. StarVault needs a more precise model:

- Read only
- Specific fields only
- One-time access
- Expiry
- No export
- No re-sharing
- Proof without disclosure

## Capability Shape

```json
{
  "action": "read",
  "resource": "resume",
  "fields": ["education", "work_history"],
  "one_time": true,
  "expires_in_seconds": 86400,
  "export_allowed": false,
  "resharing_allowed": false
}
```

## Token Claims

```json
{
  "iss": "starvault",
  "sub": "user_123",
  "aud": "sv_app_123",
  "resource": "resume_456",
  "capabilities": [],
  "purpose": "candidate screening",
  "exp": 1790000000,
  "jti": "svt_123"
}
```

## Enforcement Rules

- Missing capability means deny.
- Expired capability means deny.
- Export is denied unless explicitly allowed.
- Re-sharing is denied unless explicitly allowed.
- Field-level filtering must happen before data leaves the vault boundary.
