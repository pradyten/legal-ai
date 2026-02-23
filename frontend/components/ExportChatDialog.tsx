'use client';

import { useState } from 'react';
import { Download, FileText, FileJson } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Message } from '@/types';
import { toast } from 'sonner';

interface ExportChatDialogProps {
  messages: Message[];
}

export function ExportChatDialog({ messages }: ExportChatDialogProps) {
  const [open, setOpen] = useState(false);

  const exportAsText = () => {
    if (messages.length === 0) {
      toast.error('No messages to export');
      return;
    }

    const textContent = messages
      .map((msg) => {
        const timestamp = msg.timestamp.toLocaleString();
        const role = msg.role === 'user' ? 'You' : 'Assistant';
        let content = `[${timestamp}] ${role}:\n${msg.content}\n`;

        if (msg.citations && msg.citations.length > 0) {
          content += `\nCitations:\n`;
          msg.citations.forEach((citation, idx) => {
            content += `  ${idx + 1}. ${citation.case_name} - ${citation.citation}\n`;
          });
        }

        if (msg.confidence) {
          content += `Confidence: ${msg.confidence}\n`;
        }

        return content;
      })
      .join('\n---\n\n');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Chat exported as text file');
    setOpen(false);
  };

  const exportAsJson = () => {
    if (messages.length === 0) {
      toast.error('No messages to export');
      return;
    }

    const jsonContent = {
      exportedAt: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        confidence: msg.confidence,
        citations: msg.citations,
        retrieved_chunks: msg.retrieved_chunks,
      })),
    };

    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-ai-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Chat exported as JSON file');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Chat</DialogTitle>
          <DialogDescription>
            Download your conversation history in your preferred format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            onClick={exportAsText}
            className="h-auto p-4 justify-start"
            disabled={messages.length === 0}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Text File (.txt)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Human-readable format with timestamps and citations
                </p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={exportAsJson}
            className="h-auto p-4 justify-start"
            disabled={messages.length === 0}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="h-10 w-10 rounded-lg bg-success-500/10 flex items-center justify-center shrink-0">
                <FileJson className="h-5 w-5 text-success-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">JSON File (.json)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Structured data format with full metadata
                </p>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
