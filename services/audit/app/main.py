from datetime import datetime, timezone

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="StarVault Audit Service", version="0.1.0")


class AuditEvent(BaseModel):
    actor: str
    action: str
    resource_id: str | None = None
    purpose: str | None = None


@app.post("/audit/events")
def create_event(payload: AuditEvent) -> dict:
    return {"event_id": "evt_demo", "created_at": datetime.now(timezone.utc).isoformat(), **payload.model_dump()}


@app.get("/audit/events")
def list_events() -> dict:
    return {"events": []}
