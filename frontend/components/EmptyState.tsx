'use client';

import { Scale } from 'lucide-react';

interface EmptyStateProps {
  onSendMessage: (message: string) => void;
}

const EXAMPLE_QUESTIONS = [
  'What is contract consideration?',
  'Explain the Fourth Amendment exclusionary rule',
  'What is qualified immunity for police officers?',
  'How does the doctrine of stare decisis work?',
];

export default function EmptyState({ onSendMessage }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Scale className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Legal AI Research Assistant
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Ask questions about U.S. case law and receive citation-grounded answers
          with confidence scoring powered by RAG.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {EXAMPLE_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => onSendMessage(question)}
              className="text-left p-3.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-foreground/80 leading-snug"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
