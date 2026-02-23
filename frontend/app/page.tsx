'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatRequest, RetrievedChunk } from '@/types';
import { sendMessage } from '@/lib/api';
import ChatPanel from '@/components/ChatPanel';
import SourceViewer from '@/components/SourceViewer';
import CitationCard from '@/components/CitationCard';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare conversation history
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const request: ChatRequest = {
        session_id: sessionId,
        message: content,
        conversation_history: conversationHistory,
      };

      // Send to API
      const response = await sendMessage(request);

      // Add assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        confidence: response.confidence,
        retrieved_chunks: response.retrieved_chunks,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSelectedMessage(assistantMessage); // Auto-select to show sources

      if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-6 shadow-lg">
        <h1 className="text-2xl font-bold">Legal AI Research Assistant</h1>
        <p className="text-sm text-gray-300 mt-1">
          Citation-grounded answers from U.S. case law
        </p>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - 60% */}
        <div className="w-3/5 border-r border-gray-200 flex flex-col">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onSelectMessage={setSelectedMessage}
          />
        </div>

        {/* Source Viewer - 40% */}
        <div className="w-2/5 bg-gray-50 p-6 overflow-hidden flex flex-col">
          {selectedMessage && selectedMessage.citations && selectedMessage.citations.length > 0 ? (
            <div className="h-full overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 sticky top-0 bg-gray-50 pb-2 border-b">
                Citations ({selectedMessage.citations.length})
              </h3>
              <div className="space-y-4">
                {selectedMessage.citations.map((citation, idx) => (
                  <CitationCard key={idx} citation={citation} index={idx} />
                ))}
              </div>

              {selectedMessage.retrieved_chunks && selectedMessage.retrieved_chunks.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-4 mt-8 sticky top-0 bg-gray-50 pb-2 border-b">
                    Retrieved Sources ({selectedMessage.retrieved_chunks.length})
                  </h3>
                  <SourceViewer chunks={selectedMessage.retrieved_chunks} />
                </>
              )}
            </div>
          ) : selectedMessage && selectedMessage.retrieved_chunks ? (
            <SourceViewer chunks={selectedMessage.retrieved_chunks} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              <p>Ask a question to see sources and citations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
