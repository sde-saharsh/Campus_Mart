import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    console.log('Initial theme from localStorage:', saved);
    return saved || "light";
  });

  useEffect(() => {
    console.log('Theme changed to:', theme);
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove("dark", "light");
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Also set data-theme for Tailwind v4
    root.setAttribute("data-theme", theme);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Log for debugging
    console.log('HTML classes:', root.className);
    console.log('data-theme:', root.getAttribute('data-theme'));
  }, [theme]);

  const toggleTheme = () => {
    console.log('🔄 Toggle clicked! Current theme:', theme);
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      console.log('✅ Switching to:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
