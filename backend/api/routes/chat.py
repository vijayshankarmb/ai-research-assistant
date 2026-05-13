from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import os
from fastapi.responses import StreamingResponse
from services.llm_services import stream_llm
from rag.ingest import ingest_pdf
from rag.chain import stream_rag_response
from core.session_store import sessions

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    mode: str = "chat|rag"
    session_id: str

@router.post("/chat")
async def chat(req: ChatRequest):

    if req.session_id not in sessions:
        sessions[req.session_id] = []

    sessions[req.session_id].append({"role": "user", "content": req.message})

    async def generate():
        full_response = ""
        if req.mode == "rag":
            async for chunk in stream_rag_response(req.message, sessions[req.session_id]):
                full_response += chunk
                yield chunk
        else:
            async for chunk in stream_llm(req.message, sessions[req.session_id]):
                full_response += chunk
                yield chunk
        
        sessions[req.session_id].append({"role": "assistant", "content": full_response})

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")
    os.makedirs("./pdfs", exist_ok=True)
    file_path = "./pdfs/" + file.filename
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    ingest_pdf(file_path)
    return {"message": "PDF uploaded and vectorized successfully"}

