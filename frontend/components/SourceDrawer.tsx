'use client';

import { X, FileText } from 'lucide-react';
import { Message } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import CitationCard from './CitationCard';
import SourceViewer from './SourceViewer';
import ConfidenceBadge from './ConfidenceBadge';
import { cn } from '@/lib/utils';
import { DRAWER_WIDTH } from '@/lib/constants';

interface SourceDrawerProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SourceDrawer({ message, isOpen, onClose }: SourceDrawerProps) {
  return (
    <div
      className={cn(
        'border-l border-border bg-background overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0',
        isOpen ? `w-[${DRAWER_WIDTH}px]` : 'w-0 border-l-0'
      )}
      style={{ width: isOpen ? DRAWER_WIDTH : 0 }}
    >
      {message && (
        <div key={message.id} className="h-full flex flex-col animate-fade-in" style={{ width: DRAWER_WIDTH }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background/95 backdrop-blur">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Sources & Citations
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
              <X className="h-4 w-4" />
              <span className="sr-only">Close drawer</span>
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-5 space-y-5">
              {/* Confidence Breakdown */}
              {message.confidence && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Confidence
                  </h4>
                  <ConfidenceBadge
                    confidence={message.confidence as 'high' | 'medium' | 'low' | 'insufficient'}
                    confidenceScore={message.confidence_score}
                    retrievalConfidence={message.retrieval_confidence}
                    llmConfidence={message.llm_confidence}
                    chunksCount={message.chunks_count}
                  />
                </div>
              )}

              {/* Citations */}
              {message.citations && message.citations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Citations ({message.citations.length})
                  </h4>
                  <div className="space-y-3">
                    {message.citations.map((citation, idx) => (
                      <CitationCard key={idx} citation={citation} index={idx} />
                    ))}
                  </div>
                </div>
              )}

              {/* Retrieved Chunks */}
              {message.retrieved_chunks && message.retrieved_chunks.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Retrieved Sources ({message.retrieved_chunks.length})
                    </h4>
                    <SourceViewer chunks={message.retrieved_chunks} />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
