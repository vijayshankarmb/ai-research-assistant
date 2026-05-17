from pydantic import BaseModel
from fastapi import APIRouter
from core.database import session_local
from models.user import User
from core.security import hash_password, create_access_token, verify_password
from fastapi import Response

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

router = APIRouter()

@router.post("/signup")
async def signup(req: SignupRequest, response: Response):
    db = session_local()
    
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        return {"error": "User already exists"}
    
    hashed_password = hash_password(req.password)

    user = User(
        username = req.username,
        email = req.email,
        hashed_password = hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    
    access_token = create_access_token(
        {"user_id": str(user.id)}
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return {
        "message": "Signup successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }

@router.post("/login")
async def login(req: LoginRequest, response: Response):
    db = session_local()
    
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        return {"error": "User not found"}
    
    if not verify_password(req.password, user.hashed_password):
        return {"error": "Invalid password"}
    
    access_token = create_access_token(
        {"user_id": str(user.id)}
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }

@router.post("/logout")
async def logout(response: Response):

    response.delete_cookie("access_token")

    return {
        "message": "Logged out successfully"
    }

