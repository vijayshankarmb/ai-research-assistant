from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
from dotenv import load_dotenv

load_dotenv()

def ingest_pdf(path: str, collection_name: str):
    loader = PyPDFLoader(file_path=path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    #embeddings = OllamaEmbeddings(model="nomic-embed-text")
    embeddings = GoogleGenerativeAIEmbeddings(
        google_api_key=os.getenv("GEMINI_API_KEY"),
        model="models/gemini-embedding-001",
        task_type="retrieval_document"
    )

    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="db/chroma_db",
        collection_name=collection_name,
    )

    print(f"vector store created for collection {collection_name}")





