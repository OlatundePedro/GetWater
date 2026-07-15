import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export const lightTheme = {
  background: "#FFFFFF",
  card: "#F9FAFB",
  border: "#F3F4F6",
  text: "#1F2937",
  textMuted: "#6B7280",
  textFaint: "#9CA3AF",
  primary: "#12a5e4",
  danger: "#be3030",
};

export const darkTheme = {
  background: "#0F172A",
  card: "#1E293B",
  border: "#334155",
  text: "#F1F5F9",
  textMuted: "#94A3B8",
  textFaint: "#64748B",
  primary: "#12a5e4",
  danger: "#be3030",
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("theme-preference").then((value) => {
      if (value === "dark") setIsDark(true);
      setLoaded(true);
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem("theme-preference", next ? "dark" : "light");
  };

  const colors = isDark ? darkTheme : lightTheme;

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
