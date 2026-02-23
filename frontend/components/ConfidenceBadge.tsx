import { CheckCircle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  confidence: 'high' | 'medium' | 'low' | 'insufficient';
  percentage?: number; // Optional percentage for tooltip
}

export default function ConfidenceBadge({ confidence, percentage }: ConfidenceBadgeProps) {
  const config = {
    high: {
      icon: CheckCircle,
      className: 'bg-success-50 text-success-700 border-success-600/20 hover:bg-success-100',
      label: 'High Confidence',
      description: 'Strong supporting evidence from multiple sources',
    },
    medium: {
      icon: AlertCircle,
      className: 'bg-warning-50 text-warning-700 border-warning-600/20 hover:bg-warning-100',
      label: 'Medium Confidence',
      description: 'Moderate supporting evidence',
    },
    low: {
      icon: AlertTriangle,
      className: 'bg-error-50 text-error-700 border-error-600/20 hover:bg-error-100',
      label: 'Low Confidence',
      description: 'Limited supporting evidence',
    },
    insufficient: {
      icon: XCircle,
      className: 'bg-neutral-50 text-neutral-700 border-neutral-600/20 hover:bg-neutral-100',
      label: 'Insufficient Data',
      description: 'Not enough evidence to support answer',
    },
  };

  const { icon: Icon, className, label, description } = config[confidence];

  const badge = (
    <Badge variant="outline" className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border', className)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );

  if (percentage !== undefined) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="font-semibold">{label} ({percentage}%)</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
