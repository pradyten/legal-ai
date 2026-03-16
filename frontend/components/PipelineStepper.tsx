'use client';

import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PIPELINE_STEPS, PIPELINE_STEP_DURATION } from '@/lib/constants';

interface PipelineStepperProps {
  isActive: boolean;
}

export default function PipelineStepper({ isActive }: PipelineStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedAll, setCompletedAll] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && !completedAll) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          // Hold on the last step if API takes longer
          if (prev >= PIPELINE_STEPS.length - 1) {
            return prev;
          }
          return prev + 1;
        });
      }, PIPELINE_STEP_DURATION);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }

    // When isActive goes false, complete all steps
    if (!isActive && currentStep > 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCompletedAll(true);
    }
  }, [isActive, completedAll, currentStep]);

  return (
    <div className="flex items-center gap-1 py-4 px-2">
      {PIPELINE_STEPS.map((step, idx) => {
        const isCompleted = completedAll || idx < currentStep;
        const isActiveStep = !completedAll && idx === currentStep && isActive;
        const isPending = !isCompleted && !isActiveStep;

        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300',
                  isCompleted && 'bg-success-500 text-white',
                  isActiveStep && 'bg-primary-500 text-white animate-pipeline-pulse',
                  isPending && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium whitespace-nowrap',
                  isCompleted && 'text-success-600',
                  isActiveStep && 'text-primary',
                  isPending && 'text-muted-foreground'
                )}
              >
                {step}
              </span>
            </div>
            {idx < PIPELINE_STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-6 mb-5 transition-colors duration-300',
                  (completedAll || idx < currentStep - 1 || (idx < currentStep))
                    ? 'bg-success-500'
                    : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
