import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: ThemeMode;
  theme: "light" | "dark"; // resolved theme
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "system",
  theme: "light",
  setMode: () => {},
  toggleTheme: () => {},
});

function getSystemTheme(): "light" | "dark" {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme-mode") as ThemeMode) || "system";
    }
    return "system";
  });

  const [resolved, setResolved] = useState<"light" | "dark">(() =>
    mode === "system" ? getSystemTheme() : mode
  );

  // Listen for OS preference changes when in system mode
  useEffect(() => {
    if (mode !== "system") {
      setResolved(mode);
      return;
    }
    setResolved(getSystemTheme());
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setResolved(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mode]);

  // Apply class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  }, [resolved]);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem("theme-mode", m);
  };

  const toggleTheme = () => {
    const next = resolved === "light" ? "dark" : "light";
    setMode(next);
  };

  return (
    <ThemeContext.Provider value={{ mode, theme: resolved, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
