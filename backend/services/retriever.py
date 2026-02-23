"""Pinecone retriever for legal document search."""
from typing import List, Dict, Any, Tuple
from pinecone import Pinecone
from openai import OpenAI
from langchain_core.documents import Document
from backend.config import settings


class LegalDocumentRetriever:
    """Retriever for legal documents from Pinecone vector database."""

    def __init__(self):
        """Initialize Pinecone and OpenAI clients."""
        self.pc = Pinecone(api_key=settings.pinecone_api_key)
        self.index = self.pc.Index(settings.pinecone_index_name)
        self.openai_client = OpenAI(api_key=settings.openai_api_key)

    def _generate_query_embedding(self, query: str) -> List[float]:
        """
        Generate embedding for a query string.

        Args:
            query: The search query

        Returns:
            Embedding vector
        """
        response = self.openai_client.embeddings.create(
            model=settings.embedding_model,
            input=query
        )
        return response.data[0].embedding

    def retrieve(
        self,
        query: str,
        top_k: int = None,
        filter_dict: Dict[str, Any] = None
    ) -> Tuple[List[Document], float]:
        """
        Retrieve relevant documents from Pinecone.

        Args:
            query: The search query
            top_k: Number of results to return (default from settings)
            filter_dict: Optional metadata filters

        Returns:
            Tuple of (list of Documents, average similarity score)
        """
        top_k = top_k or settings.top_k_chunks

        # Generate query embedding
        query_embedding = self._generate_query_embedding(query)

        # Search Pinecone
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            filter=filter_dict
        )

        # Convert to LangChain Documents and calculate average score
        documents = []
        total_score = 0.0

        for match in results.matches:
            metadata = match.metadata.copy()
            text = metadata.pop("text", "")

            doc = Document(
                page_content=text,
                metadata={
                    **metadata,
                    "score": match.score,
                    "id": match.id
                }
            )
            documents.append(doc)
            total_score += match.score

        # Calculate average similarity score
        avg_score = total_score / len(documents) if documents else 0.0

        return documents, avg_score

    def health_check(self) -> Dict[str, Any]:
        """
        Check connection to Pinecone.

        Returns:
            Dictionary with health status
        """
        try:
            stats = self.index.describe_index_stats()
            return {
                "status": "healthy",
                "total_vectors": stats.total_vector_count,
                "dimension": stats.dimension,
                "index_fullness": stats.index_fullness
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e)
            }


# Global retriever instance
_retriever_instance = None


def get_retriever() -> LegalDocumentRetriever:
    """Get or create global retriever instance."""
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = LegalDocumentRetriever()
    return _retriever_instance
