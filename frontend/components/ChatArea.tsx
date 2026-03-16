'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';
import EmptyState from './EmptyState';
import ScrollToBottomButton from './ScrollToBottomButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MAX_MESSAGE_LENGTH } from '@/lib/constants';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onSelectMessage: (message: Message) => void;
  selectedMessageId?: string;
  latestAssistantId?: string;
}

export default function ChatArea({
  messages,
  isLoading,
  onSendMessage,
  onSelectMessage,
  selectedMessageId,
  latestAssistantId,
}: ChatAreaProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background">
      {/* Messages Area */}
      {messages.length === 0 && !isLoading ? (
        <EmptyState onSendMessage={onSendMessage} />
      ) : (
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 overflow-y-auto relative"
          role="log"
          aria-live="polite"
          aria-label="Conversation messages"
        >
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
            {messages.map((message) => {
              const isLatest = message.id === latestAssistantId;
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onSelectMessage={onSelectMessage}
                  isLatest={isLatest}
                  isLoading={false}
                  selectedMessageId={selectedMessageId}
                  enableTypewriter={isLatest && message.role === 'assistant'}
                />
              );
            })}

            {/* Loading indicator — pipeline stepper as a pseudo-message */}
            {isLoading && (
              <MessageBubble
                message={{
                  id: '__loading__',
                  role: 'assistant',
                  content: '',
                  timestamp: new Date(),
                }}
                isLatest={true}
                isLoading={true}
              />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to Bottom */}
          {messages.length > 0 && (
            <ScrollToBottomButton
              containerRef={messagesContainerRef}
              messagesCount={messages.length}
            />
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="shrink-0 border-t border-border bg-background px-4 sm:px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a legal research question..."
                disabled={isLoading}
                maxLength={MAX_MESSAGE_LENGTH}
                className="h-11 pr-16"
                aria-label="Legal research question input"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {input.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <Button type="submit" disabled={isLoading || !input.trim()} size="lg" className="px-6">
              {isLoading ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                <>
                  Send
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <p>This is not legal advice. Consult a licensed attorney for specific legal guidance.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
