from fastapi import APIRouter
from pydantic import BaseModel
from services.llm_services import get_response

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    
@router.post("/chat")
def chat(req: ChatRequest):
    res = get_response(req.query)
    return {"response": res}
    
