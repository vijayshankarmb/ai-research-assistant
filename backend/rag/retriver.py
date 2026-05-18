
import dotenv
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
from dotenv import load_dotenv

load_dotenv()

def get_retriver(collection_name: str): 
    #embeddings = OllamaEmbeddings(model="nomic-embed-text")
    embeddings = GoogleGenerativeAIEmbeddings(
        google_api_key=os.getenv("GEMINI_API_KEY"),
        model="models/gemini-embedding-001",
        task_type="retrieval_document"
    )

    vector_store = Chroma(
        persist_directory="db/chroma_db",
        collection_name=collection_name,
        embedding_function=embeddings
    )

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )

    return retriever


