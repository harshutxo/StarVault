from secrets import token_urlsafe

from fastapi import FastAPI
from pydantic import BaseModel, AnyUrl

app = FastAPI(title="StarVault Application Registry", version="0.1.0")


class ApplicationCreate(BaseModel):
    name: str
    redirect_uris: list[AnyUrl]
    public_key: str
    rate_limit_tier: str = "sandbox"


@app.post("/applications")
def register_application(payload: ApplicationCreate) -> dict:
    return {
        "app_id": "sv_app_demo",
        "client_secret": token_urlsafe(32),
        "public_key": payload.public_key,
        "redirect_uris": [str(uri) for uri in payload.redirect_uris],
        "rate_limit_tier": payload.rate_limit_tier,
    }


@app.get("/applications")
def list_applications() -> dict:
    return {"applications": []}


@app.get("/applications/{app_id}")
def get_application(app_id: str) -> dict:
    return {"app_id": app_id, "name": "Demo Application", "status": "active"}
