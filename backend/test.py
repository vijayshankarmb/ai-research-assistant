from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

embeddings = OllamaEmbeddings(model="nomic-embed-text")

vector_store = Chroma(
    persist_directory="db/chroma_db",
    collection_name="lc_pdf_rag",
    embedding_function=embeddings
)

print("Total chunks:", vector_store._collection.count())

results = vector_store.similarity_search("python", k=3)
for r in results:
    print("---")
    print(r.page_content[:200])