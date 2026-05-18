from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

# llm = ChatOllama(model="qwen2.5:3b")
llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    verbose=True,
    temperature=0.3,
    google_api_key=os.getenv("GEMINI_API_KEY"),
)

async def stream_llm(message: str, history: list):
    conversation = ""
    for msg in history:
        conversation += f"{msg['role']}: {msg['content']}\n"
    
    prompt = f"""
    You are a helpful assistant.

    CONVERSATION HISTORY:
    {conversation}

    CURRENT MESSAGE:
    {message}
    """
    async for chunk in llm.astream(prompt):
        for part in chunk.content:
            if isinstance(part, dict) and part.get("type") == "text":
                yield part["text"]

