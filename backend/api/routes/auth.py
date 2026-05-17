from pydantic import EmailStr
from pydantic import BaseModel
from fastapi import APIRouter, Response, Depends, HTTPException
from core.database import session_local
from models.user import User
from core.security import hash_password, create_access_token, verify_password
from core.dependencies import get_current_user

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

router = APIRouter()

@router.post("/signup")
async def signup(req: SignupRequest, response: Response):
    db = session_local()
    
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
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
        raise HTTPException(status_code=401, detail="User not found")
    
    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid password")
    
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

@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }


