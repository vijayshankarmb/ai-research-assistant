from langchain_ollama import ChatOllama

llm = ChatOllama(model="qwen2.5:3b")

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
        yield chunk.content

