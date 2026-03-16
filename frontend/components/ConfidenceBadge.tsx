'use client';

import { CheckCircle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  confidence: 'high' | 'medium' | 'low' | 'insufficient';
  confidenceScore?: number;
  retrievalConfidence?: number;
  llmConfidence?: number;
  chunksCount?: number;
}

const config = {
  high: {
    icon: CheckCircle,
    className: 'bg-success-50 text-success-700 border-success-600/20 hover:bg-success-100',
    barColor: 'bg-success-500',
    label: 'High Confidence',
  },
  medium: {
    icon: AlertCircle,
    className: 'bg-warning-50 text-warning-700 border-warning-600/20 hover:bg-warning-100',
    barColor: 'bg-warning-500',
    label: 'Medium Confidence',
  },
  low: {
    icon: AlertTriangle,
    className: 'bg-error-50 text-error-700 border-error-600/20 hover:bg-error-100',
    barColor: 'bg-error-500',
    label: 'Low Confidence',
  },
  insufficient: {
    icon: XCircle,
    className: 'bg-neutral-50 text-neutral-700 border-neutral-600/20 hover:bg-neutral-100',
    barColor: 'bg-neutral-400',
    label: 'Insufficient Data',
  },
};

function ProgressBar({ value, color, label }: { value: number; color: string; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ConfidenceBadge({
  confidence,
  confidenceScore,
  retrievalConfidence,
  llmConfidence,
  chunksCount,
}: ConfidenceBadgeProps) {
  const { icon: Icon, className, barColor, label } = config[confidence];
  const hasBreakdown = retrievalConfidence !== undefined && llmConfidence !== undefined;

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border cursor-default',
        hasBreakdown && 'cursor-pointer',
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );

  if (!hasBreakdown) return badge;

  return (
    <Popover>
      <PopoverTrigger asChild>{badge}</PopoverTrigger>
      <PopoverContent className="w-72" side="top" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm text-foreground">{label}</h4>
            {confidenceScore !== undefined && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Weighted score: {Math.round(confidenceScore * 100)}%
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <ProgressBar
              value={retrievalConfidence}
              color="bg-primary-500"
              label="Retrieval quality"
            />
            <ProgressBar
              value={llmConfidence}
              color={barColor}
              label="LLM self-assessment"
            />
          </div>

          <div className="pt-1 border-t border-border">
            <p className="text-[10px] text-muted-foreground">
              60% retrieval + 40% LLM self-assessment
            </p>
            {chunksCount !== undefined && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {chunksCount} chunks retrieved
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
