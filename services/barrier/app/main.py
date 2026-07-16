from datetime import datetime, timezone
from hashlib import sha256
from uuid import uuid4

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="StarVault Data Access Barrier", version="0.1.0")

LEDGER_EVENTS: list[dict] = []


class Capability(BaseModel):
    action: str
    resource: str
    fields: list[str] | None = None
    one_time: bool = True
    expires_in_seconds: int = 3600
    export_allowed: bool = False
    resharing_allowed: bool = False


class BarrierRequest(BaseModel):
    user_id: str
    requester_app_id: str
    requester_name: str
    resource_type: str
    purpose: str
    consent_id: str
    capabilities: list[Capability]


def hash_event(event: dict, previous_hash: str | None) -> str:
    payload = f"{event}|{previous_hash or ''}".encode("utf-8")
    return sha256(payload).hexdigest()


def append_ledger_event(payload: BarrierRequest, decision: str, token_id: str | None = None) -> dict:
    previous_hash = LEDGER_EVENTS[0]["event_hash"] if LEDGER_EVENTS else None
    event = {
        "transaction_id": f"svtx_{uuid4().hex[:16]}",
        "user_hash": sha256(payload.user_id.encode("utf-8")).hexdigest(),
        "requester_app_id": payload.requester_app_id,
        "requester_name": payload.requester_name,
        "resource_type": payload.resource_type,
        "purpose": payload.purpose,
        "capabilities": [capability.model_dump() for capability in payload.capabilities],
        "consent_id": payload.consent_id,
        "token_id": token_id,
        "decision": decision,
        "ledger_network": "local-dev-ledger",
        "previous_event_hash": previous_hash,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    event["event_hash"] = hash_event(event, previous_hash)
    LEDGER_EVENTS.insert(0, event)
    return event


@app.post("/barrier/authorize")
def authorize(payload: BarrierRequest) -> dict:
    export_requested = any(capability.export_allowed for capability in payload.capabilities)
    resharing_requested = any(capability.resharing_allowed for capability in payload.capabilities)

    if export_requested or resharing_requested:
        event = append_ledger_event(payload, "denied")
        return {"allowed": False, "reason": "Export and resharing are denied by default.", "ledger_event": event}

    token_id = f"svt_{uuid4().hex[:16]}"
    event = append_ledger_event(payload, "approved", token_id=token_id)
    return {"allowed": True, "capability_token": token_id, "ledger_event": event}


@app.post("/barrier/deny")
def deny(payload: BarrierRequest) -> dict:
    event = append_ledger_event(payload, "denied")
    return {"allowed": False, "ledger_event": event}


@app.get("/barrier/transactions")
def transactions() -> dict:
    return {"transactions": LEDGER_EVENTS}
