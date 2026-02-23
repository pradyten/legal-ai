"""Confidence assessment for RAG responses."""
from typing import Literal
from backend.config import settings


ConfidenceLevel = Literal["high", "medium", "low", "insufficient"]


def calculate_weighted_confidence(
    retrieval_score: float,
    llm_confidence_score: float,
    retrieval_weight: float = None,
    llm_weight: float = None
) -> float:
    """
    Calculate weighted confidence score.

    Args:
        retrieval_score: Average similarity score from vector search (0-1)
        llm_confidence_score: Self-assessed confidence from LLM (0-1)
        retrieval_weight: Weight for retrieval score (default from settings)
        llm_weight: Weight for LLM confidence (default from settings)

    Returns:
        Weighted confidence score (0-1)
    """
    retrieval_weight = retrieval_weight or settings.retrieval_confidence_weight
    llm_weight = llm_weight or settings.llm_confidence_weight

    # Normalize weights to sum to 1
    total_weight = retrieval_weight + llm_weight
    retrieval_weight = retrieval_weight / total_weight
    llm_weight = llm_weight / total_weight

    return (retrieval_score * retrieval_weight) + (llm_confidence_score * llm_weight)


def score_to_level(
    confidence_score: float,
    high_threshold: float = None,
    medium_threshold: float = None
) -> ConfidenceLevel:
    """
    Convert numerical confidence score to categorical level.

    Args:
        confidence_score: Weighted confidence score (0-1)
        high_threshold: Threshold for high confidence (default from settings)
        medium_threshold: Threshold for medium confidence (default from settings)

    Returns:
        Confidence level string
    """
    high_threshold = high_threshold or settings.high_confidence_threshold
    medium_threshold = medium_threshold or settings.medium_confidence_threshold

    if confidence_score >= high_threshold:
        return "high"
    elif confidence_score >= medium_threshold:
        return "medium"
    elif confidence_score >= 0.25:
        return "low"
    else:
        return "insufficient"


def extract_llm_confidence_from_response(response: str) -> float:
    """
    Extract confidence assessment from LLM response.

    Looks for confidence indicators in the response text.
    This is a simple heuristic-based approach.

    Args:
        response: The LLM's response text

    Returns:
        Estimated confidence score (0-1)
    """
    response_lower = response.lower()

    # Check for explicit confidence markers
    if "i don't have enough information" in response_lower or \
       "insufficient information" in response_lower or \
       "cannot answer" in response_lower:
        return 0.2

    if "limited information" in response_lower or \
       "may not fully answer" in response_lower or \
       "somewhat relevant" in response_lower:
        return 0.5

    if "the retrieved documents" in response_lower and \
       "directly address" in response_lower:
        return 0.9

    # Default to medium-high if no explicit markers
    # Assume the LLM is reasonably confident if it provided an answer
    return 0.7


def parse_llm_self_assessment(assessment_text: str) -> tuple[float, ConfidenceLevel]:
    """
    Parse LLM's self-assessment of confidence.

    Expected format: "CONFIDENCE: [HIGH/MEDIUM/LOW/INSUFFICIENT]"

    Args:
        assessment_text: The LLM's confidence assessment

    Returns:
        Tuple of (confidence_score, confidence_level)
    """
    assessment_lower = assessment_text.lower()

    # Extract confidence level from text
    if "high" in assessment_lower:
        return 0.9, "high"
    elif "medium" in assessment_lower:
        return 0.6, "medium"
    elif "low" in assessment_lower:
        return 0.3, "low"
    elif "insufficient" in assessment_lower:
        return 0.1, "insufficient"
    else:
        # Fallback: extract from response content
        score = extract_llm_confidence_from_response(assessment_text)
        level = score_to_level(score)
        return score, level


class ConfidenceAssessor:
    """Helper class for confidence assessment."""

    def __init__(
        self,
        retrieval_weight: float = None,
        llm_weight: float = None,
        high_threshold: float = None,
        medium_threshold: float = None
    ):
        """
        Initialize confidence assessor.

        Args:
            retrieval_weight: Weight for retrieval score
            llm_weight: Weight for LLM confidence
            high_threshold: Threshold for high confidence
            medium_threshold: Threshold for medium confidence
        """
        self.retrieval_weight = retrieval_weight or settings.retrieval_confidence_weight
        self.llm_weight = llm_weight or settings.llm_confidence_weight
        self.high_threshold = high_threshold or settings.high_confidence_threshold
        self.medium_threshold = medium_threshold or settings.medium_confidence_threshold

    def assess(
        self,
        retrieval_score: float,
        llm_confidence_score: float
    ) -> tuple[float, ConfidenceLevel]:
        """
        Assess overall confidence.

        Args:
            retrieval_score: Average similarity score from retrieval
            llm_confidence_score: LLM's self-assessed confidence

        Returns:
            Tuple of (weighted_score, confidence_level)
        """
        weighted_score = calculate_weighted_confidence(
            retrieval_score,
            llm_confidence_score,
            self.retrieval_weight,
            self.llm_weight
        )

        level = score_to_level(
            weighted_score,
            self.high_threshold,
            self.medium_threshold
        )

        return weighted_score, level
