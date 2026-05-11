from dotenv import load_dotenv
import os
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

model = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    verbose=True,
    temperature=0.3,
    google_api_key=os.getenv("GEMINI_API_KEY"),
)

response = model.invoke("just Say hello")

print(response)

