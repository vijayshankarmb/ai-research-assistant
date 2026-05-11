from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from services.llm_services import stream_llm

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(req: ChatRequest):

    async def generate():
        async for chunk in stream_llm(req.message):
            yield chunk

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )