
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_chroma import Chroma

def get_retriver(): 
    embeddings = OllamaEmbeddings(model="nomic-embed-text")

    vector_store = Chroma(
        persist_directory="db/chroma_db",
        collection_name="lc_pdf_rag",
        embedding_function=embeddings
    )

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )

    return retriever


