from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
import os
from fastapi.responses import StreamingResponse
from services.llm_services import stream_llm
from rag.ingest import ingest_pdf
from rag.chain import stream_rag_response
from core.dependencies import get_current_user
from models.user import User
from fastapi import Depends
from models.chat import ChatSession
from models.message import Message
from core.database import session_local

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    mode: str = "chat"
    session_id: str

@router.post("/chat")
async def chat(req: ChatRequest, current_user: User = Depends(get_current_user)):
    
    db = session_local()

    chat_session = db.query(ChatSession).filter(
        ChatSession.session_id == req.session_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not chat_session:

        chat_session = ChatSession(
            session_id=req.session_id,
            user_id=current_user.id
        )

        db.add(chat_session)

        db.commit()

        db.refresh(chat_session)

    user_message = Message(
        role="user",
        content=req.message,
        chat_session_id=chat_session.id
    )

    db.add(user_message)

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

            async for chunk in stream_llm(req.message, history):

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
async def upload_pdf(file: UploadFile = File(...), session_id: str = Form(...)):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")
    os.makedirs("./pdfs", exist_ok=True)
    file_path = "./pdfs/" + file.filename
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    ingest_pdf(file_path, session_id)
    return {"message": "PDF uploaded and vectorized successfully"}

