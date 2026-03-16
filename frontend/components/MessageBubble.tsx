'use client';

import { useState } from 'react';
import { Message } from '@/types';
import { Copy, Check, FileText } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import PipelineStepper from './PipelineStepper';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTypewriter } from '@/hooks/useTypewriter';
import { COPY_SUCCESS_DURATION } from '@/lib/constants';

interface MessageBubbleProps {
  message: Message;
  onSelectMessage?: (message: Message) => void;
  isLatest?: boolean;
  isLoading?: boolean;
  selectedMessageId?: string;
  enableTypewriter?: boolean;
}

export default function MessageBubble({
  message,
  onSelectMessage,
  isLatest = false,
  isLoading = false,
  selectedMessageId,
  enableTypewriter = false,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isSelected = selectedMessageId === message.id;

  const { displayedText, isTyping, skip } = useTypewriter({
    text: message.content,
    enabled: enableTypewriter && !isUser,
  });

  const showMetadata = !isUser && !isTyping && !enableTypewriter || !isUser && !isTyping;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), COPY_SUCCESS_DURATION);
    } catch {
      toast.error('Failed to copy message');
    }
  };

  // Show pipeline stepper for loading state
  if (!isUser && isLoading && isLatest) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-xl px-5 py-3 bg-card border border-border">
          <PipelineStepper isActive={true} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'group relative max-w-[85%] rounded-xl px-5 py-4 transition-all',
          isUser
            ? 'bg-primary-500 text-white shadow-sm'
            : 'bg-card text-card-foreground border border-border cursor-pointer hover:border-primary/30',
          !isUser && isSelected && 'border-primary/50 bg-primary/5'
        )}
        onClick={() => {
          if (!isUser) {
            if (isTyping) {
              skip();
            } else {
              onSelectMessage?.(message);
            }
          }
        }}
      >
        {/* Copy Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className={cn(
            'absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity',
            isUser
              ? 'hover:bg-white/20 text-white'
              : 'bg-background/80 hover:bg-background border border-border'
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="sr-only">Copy message</span>
        </Button>

        {/* Message Content */}
        <div
          className={cn(
            'text-base leading-relaxed whitespace-pre-wrap',
            isUser ? 'text-white' : 'text-foreground'
          )}
        >
          {isUser ? message.content : displayedText}
          {isTyping && (
            <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-text-bottom" />
          )}
        </div>

        {/* Metadata — fades in after typewriter completes */}
        {!isUser && (
          <div
            className={cn(
              'transition-opacity duration-500',
              showMetadata ? 'opacity-100' : 'opacity-0'
            )}
          >
            {message.confidence && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <ConfidenceBadge
                  confidence={message.confidence as 'high' | 'medium' | 'low' | 'insufficient'}
                  confidenceScore={message.confidence_score}
                  retrievalConfidence={message.retrieval_confidence}
                  llmConfidence={message.llm_confidence}
                  chunksCount={message.chunks_count}
                />
                {message.citations && message.citations.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {message.citations.length} citation{message.citations.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}

            <div className="mt-3 text-xs text-muted-foreground/70">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}

        {/* User timestamp */}
        {isUser && (
          <div className="mt-2 text-xs text-white/70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}
