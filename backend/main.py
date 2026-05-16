from fastapi import FastAPI
from api.routes.chat import router
from fastapi.middleware.cors import CORSMiddleware

# models
from models.user import User
from models.chat import ChatSession
from models.message import Message

# db
from core.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(router)



