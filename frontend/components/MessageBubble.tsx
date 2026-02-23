'use client';

import { useState } from 'react';
import { Message } from '@/types';
import { Copy, Check } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  onSelectMessage?: (message: Message) => void;
}

export default function MessageBubble({ message, onSelectMessage }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn(
          'group relative max-w-[85%] rounded-xl px-5 py-4 transition-all',
          isUser
            ? 'bg-primary-500 text-white shadow-sm hover:shadow-md'
            : 'bg-card text-card-foreground border border-border hover:border-primary/30 cursor-pointer'
        )}
        onClick={() => !isUser && onSelectMessage?.(message)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Copy Button */}
        {isHovered && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
              'absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-md',
              isUser ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-background'
            )}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="sr-only">Copy message</span>
          </Button>
        )}

        {/* Message Content */}
        <div className={cn(
          'text-base leading-relaxed whitespace-pre-wrap',
          isUser ? 'text-white' : 'text-foreground'
        )}>
          {message.content}
        </div>

        {/* Assistant Message Metadata */}
        {!isUser && (
          <>
            {message.confidence && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <ConfidenceBadge
                  confidence={message.confidence as 'high' | 'medium' | 'low' | 'insufficient'}
                />
                {message.citations && message.citations.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {message.citations.length} citation{message.citations.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}

            <div className="mt-3 text-xs text-muted-foreground/70">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
