import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    try {
      const stored = switchable ? localStorage.getItem("theme") : null;
      if (stored === "dark" || stored === "light") setTheme(stored);
    } catch {
      /* The theme still works when browser storage is unavailable. */
    }
    setStorageReady(true);
  }, [switchable]);

  useEffect(() => {
    const root = document.documentElement;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#171715" : "#f4f0e8");
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable && storageReady) {
      try {
        localStorage.setItem("theme", theme);
      } catch {
        /* Optional persistence. */
      }
    }
  }, [theme, switchable, storageReady]);

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  }, []);
  const value = React.useMemo(
    () => ({
      theme,
      toggleTheme: switchable ? toggleTheme : undefined,
      switchable,
    }),
    [theme, toggleTheme, switchable]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
