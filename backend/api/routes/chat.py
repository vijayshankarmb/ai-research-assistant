from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    File,
    Form,
    Depends
)

from pydantic import BaseModel

from fastapi.responses import StreamingResponse

from services.llm_services import stream_llm

from rag.ingest import ingest_pdf
from rag.chain import stream_rag_response

from core.dependencies import get_current_user, get_db
from sqlalchemy.orm import Session

from models.user import User
from models.chat import ChatSession
from models.message import Message

import os
import uuid


router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    mode: str = "chat"
    session_id: str


@router.post("/chat")
async def chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    chat_session = db.query(ChatSession).filter(
        ChatSession.session_id == req.session_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not chat_session:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found"
        )

    user_message = Message(
        role="user",
        content=req.message,
        chat_session_id=chat_session.id
    )

    db.add(user_message)

    db.commit()

    if chat_session.title == "New Chat":

        chat_session.title = (
            req.message[:40] + "..."
            if len(req.message) > 40
            else req.message
        )

        db.commit()

    messages = db.query(Message).filter(
        Message.chat_session_id == chat_session.id
    ).all()

    history = []

    for msg in messages:

        history.append({
            "role": msg.role,
            "content": msg.content
        })

    full_response = ""

    async def generate():

        nonlocal full_response

        if req.mode == "chat":

            async for chunk in stream_llm(
                req.message,
                history
            ):

                full_response += chunk

                yield chunk

        elif req.mode == "rag":

            async for chunk in stream_rag_response(
                req.message,
                history,
                req.session_id
            ):

                full_response += chunk

                yield chunk

        ai_message = Message(
            role="assistant",
            content=full_response,
            chat_session_id=chat_session.id
        )

        db.add(ai_message)

        db.commit()

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )


@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    session_id: str = Form(...)
):

    if not file:
        raise HTTPException(
            status_code=400,
            detail="File is required"
        )

    os.makedirs("./pdfs", exist_ok=True)

    file_path = f"./pdfs/{file.filename}"

    content = await file.read()

    with open(file_path, "wb") as f:
        f.write(content)

    ingest_pdf(file_path, session_id)

    return {
        "message": "PDF uploaded and vectorized successfully"
    }


@router.get("/sessions")
async def get_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).all()

    return [
        {
            "session_id": session.session_id,
            "title": session.title
        }
        for session in sessions
    ]


@router.post("/sessions")
async def create_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    session_id = str(uuid.uuid4())

    new_session = ChatSession(
        session_id=session_id,
        user_id=current_user.id,
        title="New Chat"
    )

    db.add(new_session)

    db.commit()

    db.refresh(new_session)

    return {
        "session_id": new_session.session_id,
        "title": new_session.title
    }


@router.get("/sessions/{session_id}/messages")
async def get_session_messages(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    chat_session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not chat_session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    messages = db.query(Message).filter(
        Message.chat_session_id == chat_session.id
    ).all()

    return [
        {
            "role": message.role,
            "content": message.content
        }
        for message in messages
    ]
