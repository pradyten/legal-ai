'use client';

import { Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { keys: [`${modKey}`, 'K'], description: 'Focus message input' },
    { keys: [`${modKey}`, 'D'], description: 'Toggle dark mode' },
    { keys: [`${modKey}`, '/'], description: 'Show keyboard shortcuts' },
    { keys: ['Enter'], description: 'Send message' },
    { keys: ['Shift', 'Enter'], description: 'New line (future)' },
    { keys: ['Esc'], description: 'Close dialogs' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate the application efficiently
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {shortcuts.map((shortcut, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIdx) => (
                  <span key={keyIdx} className="flex items-center gap-1">
                    <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
                      {key}
                    </kbd>
                    {keyIdx < shortcut.keys.length - 1 && (
                      <span className="text-xs text-muted-foreground">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Press <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">{modKey}</kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">/</kbd> anytime to view shortcuts
        </p>
      </DialogContent>
    </Dialog>
  );
}
