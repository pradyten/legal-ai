"""Abstract LLM provider interface with OpenAI and Mistral implementations."""
from abc import ABC, abstractmethod
from typing import List, Dict, Any
from langchain_core.language_models import BaseChatModel
from langchain_openai import ChatOpenAI
from langchain_mistralai import ChatMistralAI
from backend.config import settings


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    def get_llm(self) -> BaseChatModel:
        """Return a configured LLM instance."""
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        """Return the provider name."""
        pass


class OpenAIProvider(LLMProvider):
    """OpenAI GPT provider."""

    def __init__(self, model: str = None, temperature: float = 0.0):
        self.model = model or settings.openai_model
        self.temperature = temperature

    def get_llm(self) -> BaseChatModel:
        """Return configured OpenAI ChatGPT instance."""
        return ChatOpenAI(
            model=self.model,
            temperature=self.temperature,
            api_key=settings.openai_api_key,
            streaming=False
        )

    @property
    def name(self) -> str:
        return f"OpenAI-{self.model}"


class MistralProvider(LLMProvider):
    """Mistral AI provider."""

    def __init__(self, model: str = None, temperature: float = 0.0):
        self.model = model or settings.mistral_model
        self.temperature = temperature

    def get_llm(self) -> BaseChatModel:
        """Return configured Mistral AI instance."""
        return ChatMistralAI(
            model=self.model,
            temperature=self.temperature,
            api_key=settings.mistral_api_key,
            streaming=False
        )

    @property
    def name(self) -> str:
        return f"Mistral-{self.model}"


def get_llm_provider(provider_name: str = None, fallback: bool = False) -> LLMProvider:
    """
    Factory function to get LLM provider.

    Args:
        provider_name: Name of the provider ('openai' or 'mistral')
        fallback: If True, return fallback provider if primary fails

    Returns:
        LLMProvider instance

    Raises:
        ValueError: If provider name is invalid
    """
    provider_name = provider_name or settings.llm_provider

    providers = {
        "openai": OpenAIProvider,
        "mistral": MistralProvider
    }

    if provider_name not in providers:
        raise ValueError(f"Invalid provider: {provider_name}. Must be one of {list(providers.keys())}")

    # Return primary provider
    if not fallback:
        return providers[provider_name]()

    # Return fallback provider (opposite of primary)
    fallback_providers = {
        "openai": "mistral",
        "mistral": "openai"
    }
    fallback_name = fallback_providers.get(provider_name)
    if fallback_name and settings.mistral_api_key:  # Only fallback if Mistral key exists
        return providers[fallback_name]()

    # If no fallback available, return primary
    return providers[provider_name]()


def get_primary_and_fallback_llms() -> tuple[BaseChatModel, BaseChatModel | None]:
    """
    Get both primary and fallback LLM instances.

    Returns:
        Tuple of (primary_llm, fallback_llm)
        fallback_llm may be None if not configured
    """
    primary_provider = get_llm_provider()
    primary_llm = primary_provider.get_llm()

    # Only get fallback if Mistral is configured and we're using OpenAI as primary
    fallback_llm = None
    if settings.llm_provider == "openai" and settings.mistral_api_key:
        try:
            fallback_provider = get_llm_provider(fallback=True)
            fallback_llm = fallback_provider.get_llm()
        except Exception:
            pass  # Fallback not available

    return primary_llm, fallback_llm
