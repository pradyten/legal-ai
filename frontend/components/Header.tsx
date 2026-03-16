'use client';

import { Scale, Github, Linkedin } from 'lucide-react';
import { Message } from '@/types';
import { ThemeToggle } from '@/components/theme-toggle';
import { ExportChatDialog } from '@/components/ExportChatDialog';
import { ClearChatDialog } from '@/components/ClearChatDialog';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  messages: Message[];
  onClearChat: () => void;
}

export default function Header({ messages, onClearChat }: HeaderProps) {
  return (
    <header className="shrink-0 z-50 w-full max-w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
      <div className="flex h-14 items-center px-4 sm:px-6 justify-between min-w-0 max-w-full">
        <div className="flex items-center gap-3 min-w-0 shrink">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Scale className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground leading-tight truncate">Legal AI</h1>
            <p className="text-[11px] text-muted-foreground leading-tight truncate">
              Powered by LangGraph + GPT-4o
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ExportChatDialog messages={messages} />
          <ClearChatDialog onClearChat={onClearChat} messageCount={messages.length} />
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <a href="https://github.com/pradyten/legal-ai" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <a href="https://www.linkedin.com/in/p-tendulkar/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <Linkedin className="h-4 w-4" />
            </a>
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
