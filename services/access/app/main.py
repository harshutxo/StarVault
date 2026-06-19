from datetime import datetime, timedelta, timezone

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="StarVault Access Gateway", version="0.1.0")


class TokenIssue(BaseModel):
    subject: str
    audience: str
    resource_id: str
    scope: list[str]
    duration_seconds: int


@app.post("/tokens/issue")
def issue_token(payload: TokenIssue) -> dict:
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=payload.duration_seconds)
    return {"token": "svt_demo_token", "expires_at": expires_at.isoformat(), "scope": payload.scope}


@app.post("/tokens/revoke/{token_id}")
def revoke_token(token_id: str) -> dict:
    return {"token_id": token_id, "status": "revoked"}


@app.post("/tokens/introspect/{token_id}")
def introspect_token(token_id: str) -> dict:
    return {"token_id": token_id, "active": True}
