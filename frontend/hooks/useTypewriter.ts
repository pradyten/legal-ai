'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TYPEWRITER_SPEED } from '@/lib/constants';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  enabled?: boolean;
}

interface UseTypewriterReturn {
  displayedText: string;
  isTyping: boolean;
  skip: () => void;
}

export function useTypewriter({
  text,
  speed = TYPEWRITER_SPEED,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState(enabled ? '' : text);
  const [isTyping, setIsTyping] = useState(enabled);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayedText(text);
    setIsTyping(false);
  }, [text]);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    indexRef.current = 0;
    setDisplayedText('');
    setIsTyping(true);

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setDisplayedText(text);
        setIsTyping(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setDisplayedText(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed, enabled]);

  return { displayedText, isTyping, skip };
}
