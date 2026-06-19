from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="StarVault Vault Service", version="0.1.0")


class VaultUpload(BaseModel):
    resource_type: str
    encrypted_payload: str
    metadata: dict = {}


@app.post("/vault/upload")
def upload_resource(payload: VaultUpload) -> dict:
    return {"resource_id": "res_demo", "resource_type": payload.resource_type, "encrypted": True}


@app.get("/vault/resource/{resource_id}")
def get_resource(resource_id: str) -> dict:
    return {"resource_id": resource_id, "encrypted_payload": "demo_ciphertext"}


@app.delete("/vault/resource/{resource_id}")
def delete_resource(resource_id: str) -> dict:
    return {"resource_id": resource_id, "deleted": True}
