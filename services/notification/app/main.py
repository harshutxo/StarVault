from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="StarVault Notification Service", version="0.1.0")


class Notification(BaseModel):
    user_id: str
    channel: str
    message: str


@app.post("/notifications")
def create_notification(payload: Notification) -> dict:
    return {"id": "notification_demo", "queued": True, **payload.model_dump()}
