'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { Send, Scale, AlertCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MAX_MESSAGE_LENGTH } from '@/lib/constants';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onSelectMessage?: (message: Message) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function ChatPanel({
  messages,
  isLoading,
  onSendMessage,
  onSelectMessage,
  inputRef,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const finalInputRef = inputRef || internalInputRef;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Shift+Enter for new lines (future: textarea support)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Conversation messages"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center max-w-md">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Legal AI Research Assistant
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Ask questions about U.S. case law and receive citation-grounded answers with confidence scoring.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Example questions:</p>
                <p className="text-sm text-foreground/80">• "What is contract consideration?"</p>
                <p className="text-sm text-foreground/80">• "Explain the Fourth Amendment exclusionary rule"</p>
                <p className="text-sm text-foreground/80">• "What is qualified immunity for police officers?"</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onSelectMessage={onSelectMessage}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] space-y-3">
                  <Skeleton className="h-4 w-[300px]" />
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[280px]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Input
              ref={finalInputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a legal research question..."
              disabled={isLoading}
              maxLength={MAX_MESSAGE_LENGTH}
              className="flex-1 h-11 pr-16"
              aria-label="Legal research question input"
              aria-describedby="char-count"
            />
            <span
              id="char-count"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
            >
              {input.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="lg"
            className="px-6"
          >
            {isLoading ? (
              <>
                <span className="animate-pulse">Sending</span>
              </>
            ) : (
              <>
                Send
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        <div className="mt-2.5 flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            This is not legal advice. Consult a licensed attorney for specific legal guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
