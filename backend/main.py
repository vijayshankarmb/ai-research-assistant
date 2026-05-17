from fastapi import FastAPI
from api.routes.chat import router
from fastapi.middleware.cors import CORSMiddleware

from models.user import User
from models.chat import ChatSession
from models.message import Message
from core.database import engine, Base

from api.routes import auth


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(router)

app.include_router(auth.router)

