from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="StarVault Consent Service", version="0.1.0")


class ConsentRequest(BaseModel):
    requester_app_id: str
    requester_name: str
    resource_type: str
    purpose: str
    scope: list[str]
    duration_seconds: int
    export_allowed: bool
    user_benefit: str
    retention: str
    revocation_endpoint: str


@app.post("/consent/request")
def request_consent(payload: ConsentRequest) -> dict:
    return {"consent_id": "consent_demo", "status": "pending", "request": payload.model_dump()}


@app.post("/consent/approve/{consent_id}")
def approve_consent(consent_id: str) -> dict:
    return {"consent_id": consent_id, "status": "approved"}


@app.post("/consent/revoke/{consent_id}")
def revoke_consent(consent_id: str) -> dict:
    return {"consent_id": consent_id, "status": "revoked"}
