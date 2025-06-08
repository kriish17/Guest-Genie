from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
import pinecone
import httpx

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Pinecone
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT")
)

# Initialize embeddings
embeddings = OpenAIEmbeddings(
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    model="text-embedding-ada-002"
)

# Initialize vector store
vectorstore = Pinecone.from_existing_index(
    index_name="marriott-concierge",
    embedding=embeddings,
    namespace="hotel-knowledge"
)

class ChatRequest(BaseModel):
    message: str
    guest_context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Create context-aware prompt
        context_prompt = ""
        if request.guest_context:
            context_prompt = f"""
            Guest Information:
            - Name: {request.guest_context.get('name', 'Not provided')}
            - Room: {request.guest_context.get('room', 'Not provided')}
            - Preferences: {request.guest_context.get('preferences', 'Not provided')}
            - Previous Interactions: {request.guest_context.get('previous_interactions', 'Not provided')}
            """

        # Perform similarity search
        docs = vectorstore.similarity_search(
            request.message,
            k=3
        )
        
        # Create context from relevant documents
        context = "\n".join([doc.page_content for doc in docs])
        
        # Create the full prompt
        full_prompt = f"""
        {context_prompt}
        
        Relevant Hotel Information:
        {context}
        
        Guest Question: {request.message}
        
        Please provide a helpful, personalized response based on the guest's context and the relevant hotel information.
        """

        # Make request to OpenRouter API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Marriott Concierge"
                },
                json={
                    "model": "anthropic/claude-3-opus-20240229",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an AI concierge for Marriott hotels, providing personalized assistance to guests."
                        },
                        {
                            "role": "user",
                            "content": full_prompt
                        }
                    ]
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Error from OpenRouter API")
            
            result = response.json()
            return ChatResponse(response=result["choices"][0]["message"]["content"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 