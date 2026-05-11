from langchain_ollama import ChatOllama

llm = ChatOllama(model="qwen2.5:3b")

async def stream_llm(message: str):
    async for chunk in llm.astream(message):
        yield chunk.content