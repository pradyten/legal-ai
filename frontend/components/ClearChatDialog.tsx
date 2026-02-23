'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ClearChatDialogProps {
  onClearChat: () => void;
  messageCount: number;
}

export function ClearChatDialog({ onClearChat, messageCount }: ClearChatDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onClearChat();
    toast.success('Chat cleared');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" disabled={messageCount === 0}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning-500" />
            Clear Chat History
          </DialogTitle>
          <DialogDescription className="pt-2">
            This will permanently delete all {messageCount} message{messageCount !== 1 ? 's' : ''}{' '}
            in this conversation. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
