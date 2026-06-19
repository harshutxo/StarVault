from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="StarVault Policy Service", version="0.1.0")


class PolicyEvaluation(BaseModel):
    actor: str
    action: str
    resource_type: str
    export_requested: bool = False


@app.post("/policies/evaluate")
def evaluate_policy(payload: PolicyEvaluation) -> dict:
    allowed = not payload.export_requested
    return {"allowed": allowed, "reason": "Exports are blocked by default." if not allowed else "Policy passed."}
