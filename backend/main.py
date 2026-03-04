from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agent_core import Orchestrator

# Create FastAPI app
app = FastAPI(title="Bird Backend - AI Coach")

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since this is local, permit all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the AI routing orchestrator
orchestrator = Orchestrator()

from api.doctor_routes import router as doctor_router
app.include_router(doctor_router)

# Request model
class ChatRequest(BaseModel):
    user_id: str
    message: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Main entry point for user chats. Routes to Sentry, Pharmacist, Chronicler, or Coach.
    """
    try:
        response = orchestrator.handle_request(request.user_id, request.message)
        
        # If the response is a generator (streaming tokens), return a StreamingResponse
        import types
        if isinstance(response, types.GeneratorType):
            return StreamingResponse(response, media_type="text/event-stream")
            
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
