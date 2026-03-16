import { RetrievedChunk } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SourceViewerProps {
  chunks: RetrievedChunk[];
}

export default function SourceViewer({ chunks }: SourceViewerProps) {
  if (chunks.length === 0) return null;

  return (
    <div className="space-y-3">
      {chunks.map((chunk, idx) => (
        <Card key={idx} className="hover:border-primary/30 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground leading-snug flex items-start gap-2">
                  <span className="text-muted-foreground shrink-0">{idx + 1}.</span>
                  <span className="flex-1">{chunk.metadata.case_name || 'Unknown Case'}</span>
                </h4>
                <p className="text-xs font-mono text-muted-foreground mt-1.5">
                  {chunk.metadata.citation || 'No citation'}
                </p>
              </div>
              {chunk.metadata.score && (
                <Badge
                  variant="secondary"
                  className={cn(
                    'shrink-0 text-xs',
                    chunk.metadata.score >= 0.8
                      ? 'bg-success-50 text-success-700 border-success-600/20'
                      : chunk.metadata.score >= 0.6
                      ? 'bg-warning-50 text-warning-700 border-warning-600/20'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-600/20'
                  )}
                >
                  {(chunk.metadata.score * 100).toFixed(0)}% match
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground space-y-1 mb-3">
              <p className="font-medium">{chunk.metadata.court || 'Unknown court'}</p>
              <p>{chunk.metadata.date || 'Unknown date'}</p>
            </div>

            <div className="p-3 bg-muted/50 rounded-md border border-border/50">
              <p className="text-xs text-foreground/90 leading-relaxed">
                {chunk.text}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
