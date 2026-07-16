# Public API Surface

v2 should expose and document these endpoints through OpenAPI.

## Applications

```http
POST /applications
GET /applications
GET /applications/{app_id}
```

## OAuth-like Authorization

```http
POST /oauth/authorize
POST /oauth/token
```

## Resources

```http
GET /resources
POST /vault/upload
GET /vault/resource/{resource_id}
DELETE /vault/resource/{resource_id}
```

## Consent

```http
POST /consent/request
POST /consent/approve/{consent_id}
POST /consent/revoke/{consent_id}
```

## Data Access Barrier

```http
POST /barrier/authorize
POST /barrier/deny
POST /barrier/revoke/{token_id}
GET /barrier/transactions
GET /barrier/verify
```

The barrier is the mandatory control point between user data and external requesters. It checks consent, policy, capability limits, and ledger recording before any access is granted.

## Access

```http
POST /tokens/issue
POST /tokens/revoke/{token_id}
POST /tokens/introspect/{token_id}
```

## Audit

```http
POST /audit/events
GET /audit/events
```
