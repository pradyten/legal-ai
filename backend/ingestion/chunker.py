"""Text chunking utilities for legal documents."""
from typing import List, Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter
import tiktoken


def create_text_splitter(chunk_size: int = 512, chunk_overlap: int = 50) -> RecursiveCharacterTextSplitter:
    """
    Create a text splitter optimized for legal documents.

    Args:
        chunk_size: Target size of each chunk in tokens
        chunk_overlap: Number of overlapping tokens between chunks

    Returns:
        RecursiveCharacterTextSplitter instance
    """
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=lambda text: len(tiktoken.get_encoding("cl100k_base").encode(text)),
        separators=["\n\n", "\n", ". ", " ", ""],
        keep_separator=True
    )


def chunk_document(
    document: Dict[str, Any],
    text_splitter: RecursiveCharacterTextSplitter
) -> List[Dict[str, Any]]:
    """
    Split a legal document into chunks while preserving metadata.

    Args:
        document: Dictionary containing case information
        text_splitter: Text splitter instance

    Returns:
        List of chunks with metadata
    """
    content = document["content"]
    chunks = text_splitter.split_text(content)

    chunked_docs = []
    for idx, chunk in enumerate(chunks):
        chunked_doc = {
            "text": chunk,
            "metadata": {
                "case_name": document["case_name"],
                "court": document["court"],
                "date": document["date"],
                "citation": document["citation"],
                "topic": document["topic"],
                "chunk_id": idx,
                "total_chunks": len(chunks)
            }
        }
        chunked_docs.append(chunked_doc)

    return chunked_docs


def count_tokens(text: str) -> int:
    """Count the number of tokens in a text string."""
    encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text))
