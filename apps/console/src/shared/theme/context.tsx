import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Theme } from '@buckethub/rpc-contract';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'theme';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;

  if (resolved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return resolved;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

export const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = ({
  children,
  initialTheme = 'system',
  onThemeChange
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;

    return stored || initialTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    return applyTheme(theme);
  });

  const setTheme = useCallback(
    (newTheme: Theme) => {
      const updateTheme = () => {
        setThemeState(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);

        const resolved = applyTheme(newTheme);

        setResolvedTheme(resolved);
        onThemeChange?.(newTheme);
      };

      if (document.startViewTransition) {
        document.startViewTransition(updateTheme);
      } else {
        updateTheme();
      }
    },
    [onThemeChange]
  );

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const listener = () => {
      const updateTheme = () => {
        const resolved = applyTheme('system');

        setResolvedTheme(resolved);
      };

      if (document.startViewTransition) {
        document.startViewTransition(updateTheme);
      } else {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
