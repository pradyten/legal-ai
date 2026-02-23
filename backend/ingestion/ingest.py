"""Ingestion pipeline for loading legal documents into Pinecone."""
import json
import os
from typing import List, Dict, Any
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from backend.config import settings
from backend.ingestion.chunker import create_text_splitter, chunk_document


def load_mock_data(file_path: str = None) -> List[Dict[str, Any]]:
    """Load mock legal documents from JSON file."""
    if file_path is None:
        file_path = os.path.join(os.path.dirname(__file__), "mock_data.json")

    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def generate_embeddings(texts: List[str], client: OpenAI) -> List[List[float]]:
    """
    Generate embeddings for a list of texts using OpenAI.

    Args:
        texts: List of text strings to embed
        client: OpenAI client instance

    Returns:
        List of embedding vectors
    """
    response = client.embeddings.create(
        model=settings.embedding_model,
        input=texts
    )
    return [item.embedding for item in response.data]


def create_pinecone_index(pc: Pinecone, index_name: str, dimension: int = 1536):
    """
    Create a Pinecone index if it doesn't exist.

    Args:
        pc: Pinecone client instance
        index_name: Name of the index to create
        dimension: Dimension of the embedding vectors
    """
    existing_indexes = [index.name for index in pc.list_indexes()]

    if index_name not in existing_indexes:
        pc.create_index(
            name=index_name,
            dimension=dimension,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region=settings.pinecone_environment
            )
        )
        print(f"Created index: {index_name}")
    else:
        print(f"Index {index_name} already exists")


def upsert_to_pinecone(
    chunks: List[Dict[str, Any]],
    embeddings: List[List[float]],
    index,
    batch_size: int = 100
):
    """
    Upsert chunks and their embeddings to Pinecone.

    Args:
        chunks: List of chunk dictionaries
        embeddings: List of embedding vectors
        index: Pinecone index instance
        batch_size: Number of vectors to upsert in each batch
    """
    vectors = []
    for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        vector_id = f"{chunk['metadata']['case_name']}_chunk_{chunk['metadata']['chunk_id']}"
        vector_id = vector_id.replace(" ", "_").replace(".", "")

        vectors.append({
            "id": vector_id,
            "values": embedding,
            "metadata": {
                **chunk["metadata"],
                "text": chunk["text"]
            }
        })

        # Upsert in batches
        if len(vectors) >= batch_size:
            index.upsert(vectors=vectors)
            print(f"Upserted batch of {len(vectors)} vectors")
            vectors = []

    # Upsert remaining vectors
    if vectors:
        index.upsert(vectors=vectors)
        print(f"Upserted final batch of {len(vectors)} vectors")


def run_ingestion():
    """Main ingestion pipeline."""
    print("Starting ingestion pipeline...")

    # Initialize clients
    openai_client = OpenAI(api_key=settings.openai_api_key)
    pc = Pinecone(api_key=settings.pinecone_api_key)

    # Create or connect to index
    print(f"\nCreating/connecting to Pinecone index: {settings.pinecone_index_name}")
    create_pinecone_index(pc, settings.pinecone_index_name, settings.embedding_dimension)
    index = pc.Index(settings.pinecone_index_name)

    # Load mock data
    print("\nLoading mock legal documents...")
    documents = load_mock_data()
    print(f"Loaded {len(documents)} documents")

    # Chunk documents
    print("\nChunking documents...")
    text_splitter = create_text_splitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap
    )

    all_chunks = []
    for doc in documents:
        chunks = chunk_document(doc, text_splitter)
        all_chunks.extend(chunks)

    print(f"Created {len(all_chunks)} chunks from {len(documents)} documents")

    # Generate embeddings
    print("\nGenerating embeddings...")
    texts = [chunk["text"] for chunk in all_chunks]
    embeddings = generate_embeddings(texts, openai_client)
    print(f"Generated {len(embeddings)} embeddings")

    # Upsert to Pinecone
    print("\nUpserting to Pinecone...")
    upsert_to_pinecone(all_chunks, embeddings, index)

    # Verify
    stats = index.describe_index_stats()
    print(f"\nIngestion complete!")
    print(f"Index stats: {stats}")
    print(f"Total vectors in index: {stats.total_vector_count}")


if __name__ == "__main__":
    run_ingestion()
