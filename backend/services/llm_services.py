from langchain_ollama import ChatOllama

llm = ChatOllama(model="qwen2.5:7b")

def get_response(prompt):
    res = llm.invoke(prompt)
    return res.content