from fastapi import FastAPI
from pydantic import BaseModel, AnyUrl

app = FastAPI(title="StarVault Public API Gateway", version="0.1.0")


class AuthorizeRequest(BaseModel):
    client_id: str
    redirect_uri: AnyUrl
    response_type: str = "code"
    state: str
    resource_type: str
    capabilities: list[dict]


class TokenExchange(BaseModel):
    grant_type: str
    code: str
    client_id: str
    client_secret: str
    redirect_uri: AnyUrl


@app.post("/oauth/authorize")
def authorize(payload: AuthorizeRequest) -> dict:
    return {
        "authorization_code": "sv_code_demo",
        "state": payload.state,
        "consent_status": "pending_user_approval",
    }


@app.post("/oauth/token")
def exchange_token(payload: TokenExchange) -> dict:
    return {
        "access_token": "svt_capability_demo",
        "token_type": "capability",
        "expires_in": 86400,
        "scope": " ".join(["read"]),
    }


@app.get("/resources")
def list_resources() -> dict:
    return {"resources": []}
