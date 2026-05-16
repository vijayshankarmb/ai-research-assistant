from sqlalchemy import Column, Integer, String, ForeignKey, Text
from core.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    chat_session_id = Column(
        Integer,
        ForeignKey("chat_sessions.id")
    )

