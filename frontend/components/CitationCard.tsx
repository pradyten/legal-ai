'use client';

import { useState } from 'react';
import { Citation } from '@/types';
import { ExternalLink, Copy, Check, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { COPY_SUCCESS_DURATION, EXCERPT_PREVIEW_LENGTH } from '@/lib/constants';

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export default function CitationCard({ citation, index }: CitationCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isLongExcerpt = citation.excerpt.length > EXCERPT_PREVIEW_LENGTH;
  const displayExcerpt = expanded || !isLongExcerpt
    ? citation.excerpt
    : citation.excerpt.substring(0, EXCERPT_PREVIEW_LENGTH) + '...';

  const handleCopy = async () => {
    const citationText = `${citation.case_name}, ${citation.citation} (${citation.court}, ${citation.date})`;

    try {
      await navigator.clipboard.writeText(citationText);
      setCopied(true);
      toast.success('Citation copied to clipboard');
      setTimeout(() => setCopied(false), COPY_SUCCESS_DURATION);
    } catch (err) {
      toast.error('Failed to copy citation');
    }
  };

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground leading-snug">
                  {index + 1}. {citation.case_name}
                </h4>
                <p className="text-xs font-mono text-muted-foreground mt-1.5">
                  {citation.citation}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="sr-only">Copy citation</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="text-xs text-muted-foreground space-y-1 mb-3">
          <p className="font-medium">{citation.court}</p>
          <p>{citation.date}</p>
        </div>

        <div className={cn(
          "p-3 bg-muted/50 rounded-md border border-border/50",
          "text-xs text-foreground/90 leading-relaxed"
        )}>
          <p className="italic">"{displayExcerpt}"</p>
          {isLongExcerpt && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-primary hover:text-primary/80 font-medium text-xs"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </CardContent>

      {citation.url && (
        <CardFooter className="pt-0">
          <Button
            variant="link"
            size="sm"
            asChild
            className="h-auto p-0 text-xs"
          >
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              View on CourtListener
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
