from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

app = FastAPI(title="StarVault Identity Service", version="0.1.0")


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@app.post("/users")
def create_user(payload: UserCreate) -> dict:
    return {"id": "user_demo", "email": payload.email, "display_name": payload.display_name}


@app.post("/login")
def login(payload: LoginRequest) -> dict:
    return {"access_token": "demo.jwt.token", "token_type": "bearer"}


@app.get("/profile")
def profile() -> dict:
    return {"id": "user_demo", "email": "demo@starvault.local", "status": "active"}


@app.delete("/users/{user_id}")
def delete_user(user_id: str) -> dict:
    return {"id": user_id, "deleted": True}
