
from langchain_ollama import ChatOllama
from rag.retriver import get_retriver

retriever = get_retriver()

async def stream_rag_response(query: str):

    results = retriever.invoke(query)

    context = "\n\n".join(
        [doc.page_content for doc in results]
    )

    prompt = f"""
    Answer the question only from the provided context.

    Context:
    {context}

    Question:
    {query}

    If the answer is not in the context, say "I don't know".
    """

    llm = ChatOllama(model="qwen2.5:3b")

    async for chunk in llm.astream(prompt):
        yield chunk.content

