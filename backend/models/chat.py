from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, nullable=False)
    title = Column(String, default="New Chat")
    user_id = Column(Integer, ForeignKey("users.id"))

