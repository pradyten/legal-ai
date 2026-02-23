import { useEffect } from 'react';

interface KeyboardShortcuts {
  onFocusInput?: () => void;
  onToggleTheme?: () => void;
  onShowHelp?: () => void;
  onEscape?: () => void;
}

/**
 * Global keyboard shortcuts hook
 * Implements common shortcuts for the application
 */
export function useKeyboardShortcuts(callbacks: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // Ctrl/Cmd + K - Focus input
      if (isMod && e.key === 'k') {
        e.preventDefault();
        callbacks.onFocusInput?.();
      }

      // Ctrl/Cmd + D - Toggle dark mode
      if (isMod && e.key === 'd') {
        e.preventDefault();
        callbacks.onToggleTheme?.();
      }

      // Ctrl/Cmd + / - Show keyboard shortcuts help
      if (isMod && e.key === '/') {
        e.preventDefault();
        callbacks.onShowHelp?.();
      }

      // Escape - Close dialogs/modals (only when not in input)
      if (e.key === 'Escape' && !isInput) {
        callbacks.onEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
}
