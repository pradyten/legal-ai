"""LangGraph-based RAG pipeline for legal research assistant."""
import os
from typing import TypedDict, List, Optional, Dict, Any, Annotated
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_core.documents import Document
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from backend.services.llm_provider import get_primary_and_fallback_llms
from backend.services.retriever import get_retriever
from backend.services.confidence import ConfidenceAssessor, parse_llm_self_assessment
from backend.config import settings


# Load system prompt
SYSTEM_PROMPT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "prompts",
    "system_prompt.txt"
)

with open(SYSTEM_PROMPT_PATH, 'r', encoding='utf-8') as f:
    SYSTEM_PROMPT = f.read()


class RAGState(TypedDict):
    """State for the RAG pipeline."""
    messages: List[BaseMessage]
    session_id: str
    query: str
    rewritten_query: Optional[str]
    retrieved_chunks: List[Document]
    retrieval_confidence: float
    answer: str
    llm_confidence: float
    llm_confidence_level: str
    citations: List[Dict[str, Any]]
    error: Optional[str]


def rewrite_question(state: RAGState) -> RAGState:
    """
    Node 1: Rewrite the question based on conversation history.

    If this is a follow-up question, reformulate it to be standalone.
    """
    messages = state["messages"]
    current_query = state["query"]

    # If this is the first message or no conversation context, use query as-is
    if len(messages) <= 1:
        state["rewritten_query"] = current_query
        return state

    # If there's conversation history, reformulate the question
    primary_llm, _ = get_primary_and_fallback_llms()

    reformulation_prompt = f"""Given the conversation history and the follow-up question, rewrite the follow-up question to be a standalone question that includes necessary context.

Conversation history:
{_format_conversation_history(messages[:-1])}

Follow-up question: {current_query}

Rewritten standalone question:"""

    try:
        response = primary_llm.invoke([HumanMessage(content=reformulation_prompt)])
        rewritten = response.content.strip()
        state["rewritten_query"] = rewritten
    except Exception as e:
        # If reformulation fails, use original query
        state["rewritten_query"] = current_query
        state["error"] = f"Query reformulation failed: {str(e)}"

    return state


def retrieve_documents(state: RAGState) -> RAGState:
    """
    Node 2: Retrieve relevant documents from Pinecone.
    """
    query = state["rewritten_query"] or state["query"]
    retriever = get_retriever()

    try:
        documents, avg_score = retriever.retrieve(
            query=query,
            top_k=settings.top_k_chunks
        )
        state["retrieved_chunks"] = documents
        state["retrieval_confidence"] = avg_score
    except Exception as e:
        state["retrieved_chunks"] = []
        state["retrieval_confidence"] = 0.0
        state["error"] = f"Retrieval failed: {str(e)}"

    return state


def assess_retrieval(state: RAGState) -> RAGState:
    """
    Node 3: Assess the quality of retrieved documents.

    This is already done in retrieve_documents via avg_score.
    This node exists for potential future enhancements like relevance filtering.
    """
    # Retrieval confidence is already set by retrieve_documents
    # Could add additional logic here like filtering low-relevance docs
    return state


def generate_answer(state: RAGState) -> RAGState:
    """
    Node 4: Generate answer using LLM with retrieved context.
    """
    query = state["rewritten_query"] or state["query"]
    documents = state["retrieved_chunks"]
    primary_llm, fallback_llm = get_primary_and_fallback_llms()

    # Format retrieved documents as context
    context = _format_retrieved_documents(documents)

    # Build the generation prompt
    generation_prompt = f"""Based on the following retrieved legal cases, answer the user's question.

Retrieved Cases:
{context}

User Question: {query}

Remember to:
1. Cite specific cases using [Case Name, Citation] format
2. Ground all claims in the retrieved cases
3. If the retrieved cases don't adequately address the question, say so
4. Include the legal disclaimer

Answer:"""

    # Try primary LLM
    try:
        response = primary_llm.invoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=generation_prompt)
        ])
        answer = response.content.strip()
        state["answer"] = answer

        # Extract citations
        state["citations"] = _extract_citations(answer, documents)

    except Exception as e:
        # Try fallback LLM if available
        if fallback_llm:
            try:
                response = fallback_llm.invoke([
                    SystemMessage(content=SYSTEM_PROMPT),
                    HumanMessage(content=generation_prompt)
                ])
                answer = response.content.strip()
                state["answer"] = answer
                state["citations"] = _extract_citations(answer, documents)
            except Exception as fallback_error:
                state["answer"] = "I apologize, but I'm currently unable to generate a response. Please try again later."
                state["error"] = f"Both primary and fallback LLMs failed: {str(e)}, {str(fallback_error)}"
                state["citations"] = []
        else:
            state["answer"] = "I apologize, but I'm currently unable to generate a response. Please try again later."
            state["error"] = f"LLM generation failed: {str(e)}"
            state["citations"] = []

    return state


def assess_llm_confidence(state: RAGState) -> RAGState:
    """
    Node 5: Assess LLM's confidence in its answer.
    """
    answer = state["answer"]
    primary_llm, _ = get_primary_and_fallback_llms()

    # Ask LLM to self-assess confidence
    confidence_prompt = f"""You previously generated this answer to a legal research question:

"{answer}"

Assess your confidence in this answer based on:
1. How directly the retrieved documents addressed the question
2. The quality and relevance of the citations
3. Whether you had to make inferences beyond what was explicitly stated

Provide ONLY one word as your confidence level: HIGH, MEDIUM, LOW, or INSUFFICIENT

Confidence:"""

    try:
        response = primary_llm.invoke([HumanMessage(content=confidence_prompt)])
        assessment = response.content.strip()

        # Parse the assessment
        llm_score, llm_level = parse_llm_self_assessment(assessment)
        state["llm_confidence"] = llm_score
        state["llm_confidence_level"] = llm_level

    except Exception as e:
        # Fallback to heuristic-based confidence
        from backend.services.confidence import extract_llm_confidence_from_response
        llm_score = extract_llm_confidence_from_response(answer)
        from backend.services.confidence import score_to_level
        llm_level = score_to_level(llm_score)

        state["llm_confidence"] = llm_score
        state["llm_confidence_level"] = llm_level
        state["error"] = state.get("error", "") + f" | Confidence assessment failed: {str(e)}"

    return state


def _format_conversation_history(messages: List[BaseMessage]) -> str:
    """Format conversation history for context."""
    formatted = []
    for msg in messages[-10:]:  # Keep last 10 messages
        if isinstance(msg, HumanMessage):
            formatted.append(f"User: {msg.content}")
        elif isinstance(msg, AIMessage):
            formatted.append(f"Assistant: {msg.content}")
    return "\n".join(formatted)


def _format_retrieved_documents(documents: List[Document]) -> str:
    """Format retrieved documents for context."""
    if not documents:
        return "No relevant cases found."

    formatted = []
    for idx, doc in enumerate(documents, 1):
        metadata = doc.metadata
        formatted.append(
            f"\n--- Case {idx} ---\n"
            f"Case Name: {metadata.get('case_name', 'Unknown')}\n"
            f"Court: {metadata.get('court', 'Unknown')}\n"
            f"Date: {metadata.get('date', 'Unknown')}\n"
            f"Citation: {metadata.get('citation', 'Unknown')}\n"
            f"Relevance Score: {metadata.get('score', 0.0):.2f}\n"
            f"Content:\n{doc.page_content}\n"
        )
    return "\n".join(formatted)


def _extract_citations(answer: str, documents: List[Document]) -> List[Dict[str, Any]]:
    """
    Extract citations from the answer and match them to retrieved documents.
    """
    citations = []
    seen_cases = set()

    for doc in documents:
        case_name = doc.metadata.get('case_name', '')
        citation = doc.metadata.get('citation', '')

        # Check if this case is mentioned in the answer
        if case_name and case_name in answer and case_name not in seen_cases:
            citations.append({
                "case_name": case_name,
                "court": doc.metadata.get('court', 'Unknown'),
                "date": doc.metadata.get('date', 'Unknown'),
                "citation": citation,
                "excerpt": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                "url": f"https://www.courtlistener.com/?q={citation.replace(' ', '+')}" if citation else None
            })
            seen_cases.add(case_name)

    return citations


# Build the LangGraph
def create_rag_graph():
    """Create the RAG pipeline graph."""
    workflow = StateGraph(RAGState)

    # Add nodes
    workflow.add_node("rewrite_question", rewrite_question)
    workflow.add_node("retrieve_documents", retrieve_documents)
    workflow.add_node("assess_retrieval", assess_retrieval)
    workflow.add_node("generate_answer", generate_answer)
    workflow.add_node("assess_llm_confidence", assess_llm_confidence)

    # Define edges
    workflow.set_entry_point("rewrite_question")
    workflow.add_edge("rewrite_question", "retrieve_documents")
    workflow.add_edge("retrieve_documents", "assess_retrieval")
    workflow.add_edge("assess_retrieval", "generate_answer")
    workflow.add_edge("generate_answer", "assess_llm_confidence")
    workflow.add_edge("assess_llm_confidence", END)

    # Add memory for conversation history
    memory = MemorySaver()

    return workflow.compile(checkpointer=memory)


# Global graph instance
_graph_instance = None


def get_rag_graph():
    """Get or create global RAG graph instance."""
    global _graph_instance
    if _graph_instance is None:
        _graph_instance = create_rag_graph()
    return _graph_instance


async def run_rag_query(query: str, session_id: str, conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
    """
    Run a RAG query through the pipeline.

    Args:
        query: User's question
        session_id: Session identifier for conversation memory
        conversation_history: Optional list of previous messages

    Returns:
        Dictionary containing answer, confidence, citations, etc.
    """
    graph = get_rag_graph()

    # Build messages from conversation history
    messages = []
    if conversation_history:
        for msg in conversation_history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

    # Add current query
    messages.append(HumanMessage(content=query))

    # Initial state
    initial_state: RAGState = {
        "messages": messages,
        "session_id": session_id,
        "query": query,
        "rewritten_query": None,
        "retrieved_chunks": [],
        "retrieval_confidence": 0.0,
        "answer": "",
        "llm_confidence": 0.0,
        "llm_confidence_level": "insufficient",
        "citations": [],
        "error": None
    }

    # Run the graph
    config = {"configurable": {"thread_id": session_id}}
    result = await graph.ainvoke(initial_state, config)

    # Calculate final confidence
    assessor = ConfidenceAssessor()
    final_score, final_level = assessor.assess(
        result["retrieval_confidence"],
        result["llm_confidence"]
    )

    return {
        "answer": result["answer"],
        "confidence": final_level,
        "confidence_score": final_score,
        "retrieval_confidence": result["retrieval_confidence"],
        "llm_confidence": result["llm_confidence"],
        "citations": result["citations"],
        "retrieved_chunks": [
            {
                "text": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in result["retrieved_chunks"]
        ],
        "error": result.get("error")
    }
