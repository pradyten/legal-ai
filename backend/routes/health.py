"""Health check endpoint."""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
async def health_check() -> Dict[str, Any]:
    """
    Health check endpoint to verify service status.

    Returns:
        Health status including Pinecone connection
    """
    try:
        from backend.services.retriever import get_retriever

        # Check Pinecone connection
        retriever = get_retriever()
        pinecone_status = retriever.health_check()

        return {
            "status": "healthy" if pinecone_status["status"] == "healthy" else "degraded",
            "service": "legal-ai-backend",
            "components": {
                "api": "healthy",
                "pinecone": pinecone_status
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "legal-ai-backend",
            "error": str(e),
            "components": {
                "api": "healthy",
                "pinecone": "not_configured"
            }
        }
