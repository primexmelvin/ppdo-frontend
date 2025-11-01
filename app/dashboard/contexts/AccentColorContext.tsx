"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AccentColor = "green" | "blue" | "purple" | "orange" | "red" | "teal";

interface AccentColorContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  accentColorValue: string;
  gradientStart: string;
  gradientEnd: string;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(
  undefined
);

const accentColorConfig = {
  green: {
    value: "#15803d",
    gradientStart: "#fbbf24", // Yellow to green
    gradientEnd: "#15803d",
  },
  blue: {
    value: "#3b82f6",
    gradientStart: "#60a5fa", // Light blue to dark blue
    gradientEnd: "#1e40af",
  },
  purple: {
    value: "#9333ea",
    gradientStart: "#c084fc", // Light purple to dark purple
    gradientEnd: "#6b21a8",
  },
  orange: {
    value: "#f59e0b",
    gradientStart: "#fcd34d", // Light orange to dark orange
    gradientEnd: "#d97706",
  },
  red: {
    value: "#ef4444",
    gradientStart: "#fca5a5", // Light red to dark red
    gradientEnd: "#dc2626",
  },
  teal: {
    value: "#14b8a6",
    gradientStart: "#5eead4", // Light teal to dark teal
    gradientEnd: "#0d9488",
  },
};

export function AccentColorProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColorState] = useState<AccentColor>("green");

  // Load accent color from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem("accentColor") as AccentColor;
    if (savedColor && accentColorConfig[savedColor]) {
      setAccentColorState(savedColor);
    }
  }, []);

  // Save accent color to localStorage
  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem("accentColor", color);
  };

  const config = accentColorConfig[accentColor];

  return (
    <AccentColorContext.Provider
      value={{
        accentColor,
        setAccentColor,
        accentColorValue: config.value,
        gradientStart: config.gradientStart,
        gradientEnd: config.gradientEnd,
      }}
    >
      {children}
    </AccentColorContext.Provider>
  );
}

export function useAccentColor() {
  const context = useContext(AccentColorContext);
  if (context === undefined) {
    throw new Error("useAccentColor must be used within an AccentColorProvider");
  }
  return context;
}

