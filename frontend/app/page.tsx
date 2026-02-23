'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Scale, Sparkles, FileText } from 'lucide-react';
import { Message, ChatRequest } from '@/types';
import { sendMessage } from '@/lib/api';
import ChatPanel from '@/components/ChatPanel';
import SourceViewer from '@/components/SourceViewer';
import CitationCard from '@/components/CitationCard';
import { ThemeToggle } from '@/components/theme-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

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
        toast.error('API Error', {
          description: response.error,
        });
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
        description: err instanceof Error ? err.message : 'Unknown error occurred. Please check your connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Legal AI Research Assistant
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </h1>
              <p className="text-xs text-muted-foreground">
                Citation-grounded answers from U.S. case law
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - 60% on desktop, full width on mobile */}
        <div className="w-full md:w-3/5 border-r border-border flex flex-col">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onSelectMessage={setSelectedMessage}
          />
        </div>

        {/* Source Viewer - 40% on desktop, hidden on mobile */}
        <div className="hidden md:flex md:w-2/5 bg-muted/30 flex-col overflow-hidden">
          {selectedMessage && selectedMessage.citations && selectedMessage.citations.length > 0 ? (
            <div className="h-full flex flex-col overflow-hidden">
              {/* Citations Section */}
              <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b border-border px-6 py-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Citations
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    {selectedMessage.citations.length}
                  </span>
                </h3>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-4 p-6">
                  {selectedMessage.citations.map((citation, idx) => (
                    <CitationCard key={idx} citation={citation} index={idx} />
                  ))}
                </div>

                {selectedMessage.retrieved_chunks && selectedMessage.retrieved_chunks.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="px-6 pb-6">
                      <h3 className="text-base font-semibold mb-4 text-foreground">
                        Retrieved Sources ({selectedMessage.retrieved_chunks.length})
                      </h3>
                      <SourceViewer chunks={selectedMessage.retrieved_chunks} />
                    </div>
                  </>
                )}
              </ScrollArea>
            </div>
          ) : selectedMessage && selectedMessage.retrieved_chunks ? (
            <SourceViewer chunks={selectedMessage.retrieved_chunks} />
          ) : (
            <SourceViewer chunks={[]} />
          )}
        </div>
      </div>
    </div>
  );
}
