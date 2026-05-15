
from langchain_ollama import ChatOllama
from rag.retriver import get_retriver

async def stream_rag_response(query: str, history: list, session_id: str):
    conversation = ""
    for msg in history:
        conversation += f"{msg['role']}: {msg['content']}\n"
    
    retriever = get_retriver(session_id)
    results = retriever.invoke(query)

    sources = []

    for doc in results:
        page = doc.metadata.get("page")

        if page is not None:
            sources.append(page+1)

    context = "\n\n".join(
        [doc.page_content for doc in results]
    )

    prompt = f"""
    Answer the question only from the provided context.

    CONVERSATION HISTORY:
    {conversation}

    Context:
    {context}

    Question:
    {query}

    If the answer is not in the context, say "I don't know".
    """

    llm = ChatOllama(model="qwen2.5:3b")

    async for chunk in llm.astream(prompt):
        yield chunk.content

    yield f"\n__SOURCES__:{list(set(sources))}"
