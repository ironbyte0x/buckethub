import { useCallback, useEffect, useRef, useState } from 'react';

export function useCopy(resetDelay = 2000) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        if (!navigator?.clipboard) {
          throw new Error('Clipboard API not available');
        }

        await navigator.clipboard.writeText(text);
        setIsCopied(true);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsCopied(false);
          timeoutRef.current = null;
        }, resetDelay);

        return true;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        setIsCopied(false);

        return false;
      }
    },
    [resetDelay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copy, isCopied };
}
