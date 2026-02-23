"""Chat endpoint for RAG-powered legal research."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from backend.services.rag_pipeline import run_rag_query

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    """Individual message in conversation history."""
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    session_id: str = Field(..., description="Unique session identifier for conversation memory")
    message: str = Field(..., description="User's question", min_length=1)
    conversation_history: Optional[List[ChatMessage]] = Field(
        default=None,
        description="Optional conversation history for context"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "session_id": "550e8400-e29b-41d4-a716-446655440000",
                    "message": "What are the key principles of contract law consideration?",
                    "conversation_history": []
                }
            ]
        }
    }


class Citation(BaseModel):
    """Legal case citation."""
    case_name: str = Field(..., description="Name of the case")
    court: str = Field(..., description="Court that decided the case")
    date: str = Field(..., description="Date of the decision")
    citation: str = Field(..., description="Official citation")
    url: Optional[str] = Field(None, description="URL to case on CourtListener")
    excerpt: str = Field(..., description="Relevant excerpt from the case")


class RetrievedChunk(BaseModel):
    """Retrieved document chunk."""
    text: str = Field(..., description="Chunk text content")
    metadata: Dict[str, Any] = Field(..., description="Chunk metadata")


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    answer: str = Field(..., description="Assistant's answer to the question")
    confidence: str = Field(..., description="Confidence level: high/medium/low/insufficient")
    confidence_score: float = Field(..., description="Numerical confidence score (0-1)")
    citations: List[Citation] = Field(..., description="Legal case citations referenced")
    retrieved_chunks: List[RetrievedChunk] = Field(..., description="Documents retrieved for context")
    disclaimer: str = Field(..., description="Legal disclaimer")
    error: Optional[str] = Field(None, description="Error message if any")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "answer": "Contract consideration requires that each party provide something of value...",
                    "confidence": "high",
                    "confidence_score": 0.85,
                    "citations": [
                        {
                            "case_name": "Smith v. Jones Manufacturing Co.",
                            "court": "Supreme Court of California",
                            "date": "2023-05-15",
                            "citation": "123 Cal.4th 456",
                            "url": "https://www.courtlistener.com/?q=123+Cal.4th+456",
                            "excerpt": "Under California contract law, when a party fails to perform..."
                        }
                    ],
                    "retrieved_chunks": [],
                    "disclaimer": "This information is for educational purposes only and does not constitute legal advice."
                }
            ]
        }
    }


LEGAL_DISCLAIMER = (
    "This information is for educational purposes only and does not constitute legal advice. "
    "Consult a licensed attorney for advice specific to your situation."
)


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Process a legal research question and return a citation-grounded answer.

    Args:
        request: Chat request with question and conversation history

    Returns:
        ChatResponse with answer, confidence, and citations

    Raises:
        HTTPException: If query processing fails
    """
    try:
        # Convert conversation history to dict format
        conversation_history = None
        if request.conversation_history:
            conversation_history = [
                {"role": msg.role, "content": msg.content}
                for msg in request.conversation_history
            ]

        # Run RAG query
        result = await run_rag_query(
            query=request.message,
            session_id=request.session_id,
            conversation_history=conversation_history
        )

        # Build response
        return ChatResponse(
            answer=result["answer"],
            confidence=result["confidence"],
            confidence_score=result["confidence_score"],
            citations=[Citation(**citation) for citation in result["citations"]],
            retrieved_chunks=[
                RetrievedChunk(text=chunk["text"], metadata=chunk["metadata"])
                for chunk in result["retrieved_chunks"]
            ],
            disclaimer=LEGAL_DISCLAIMER,
            error=result.get("error")
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process query: {str(e)}"
        )


@router.get("/test")
async def test_endpoint() -> Dict[str, str]:
    """Simple test endpoint to verify chat router is working."""
    return {
        "status": "ok",
        "message": "Chat endpoint is operational"
    }
