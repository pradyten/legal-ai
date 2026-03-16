'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatRequest } from '@/types';
import { sendMessage } from '@/lib/api';
import Header from '@/components/Header';
import ChatArea from '@/components/ChatArea';
import SourceDrawer from '@/components/SourceDrawer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { toast } from 'sonner';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const latestAssistantIdRef = useRef<string | null>(null);

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const handleClearChat = () => {
    setMessages([]);
    setSelectedMessage(null);
    setDrawerOpen(false);
    setSessionId(uuidv4());
    latestAssistantIdRef.current = null;
  };

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const request: ChatRequest = {
        session_id: sessionId,
        message: content,
        conversation_history: conversationHistory,
      };

      const response = await sendMessage(request);

      const assistantId = uuidv4();
      latestAssistantIdRef.current = assistantId;

      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        confidence: response.confidence,
        confidence_score: response.confidence_score,
        retrieval_confidence: response.retrieval_confidence,
        llm_confidence: response.llm_confidence,
        chunks_count: response.retrieved_chunks?.length ?? 0,
        retrieved_chunks: response.retrieved_chunks,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.error) {
        toast.error('API Error', { description: response.error });
      }
    } catch (err) {
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      toast.error('Connection Error', {
        description: err instanceof Error ? err.message : 'Unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMessage = (message: Message) => {
    if (selectedMessage?.id === message.id && drawerOpen) {
      // Toggle drawer closed if clicking same message
      setDrawerOpen(false);
      setSelectedMessage(null);
    } else {
      // Open/swap drawer content
      setSelectedMessage(message);
      setDrawerOpen(true);
    }
  };

  return (
    <ErrorBoundary>
      <div className="h-screen h-[100dvh] w-full max-w-full flex flex-col bg-background overflow-hidden">
        <Header messages={messages} onClearChat={handleClearChat} />
        <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onSelectMessage={handleSelectMessage}
            selectedMessageId={selectedMessage?.id}
            latestAssistantId={latestAssistantIdRef.current ?? undefined}
          />
          <SourceDrawer
            message={selectedMessage}
            isOpen={drawerOpen}
            onClose={() => {
              setDrawerOpen(false);
              setSelectedMessage(null);
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
