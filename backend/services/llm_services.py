from langchain_ollama import ChatOllama

llm = ChatOllama(model="qwen2.5:3b")

def get_response(prompt):
    res = llm.invoke(prompt)
    return res.content