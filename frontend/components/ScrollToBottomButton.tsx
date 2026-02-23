'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScrollToBottomButtonProps {
  containerRef: React.RefObject<HTMLDivElement>;
  messagesCount: number;
}

export default function ScrollToBottomButton({
  containerRef,
  messagesCount,
}: ScrollToBottomButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // Show button if user has scrolled up more than 200px from bottom
      setIsVisible(distanceFromBottom > 200);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToBottom}
      className={cn(
        'absolute bottom-4 right-4 z-10 h-10 w-10 rounded-full shadow-lg',
        'bg-background border-2 border-primary/20 hover:border-primary/40',
        'transition-all duration-200',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      )}
      aria-label="Scroll to bottom"
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
  );
}
