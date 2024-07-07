import React, { createContext, useContext, useEffect } from 'react';
import useThemeStore from '../Store/themeStore';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem('theme') || 'light'; // Get theme from local storage or default to 'light'
  const { theme, setTheme } = useThemeStore(storedTheme);
  
  useEffect(() => {
    setTheme(storedTheme); // Set the theme from localStorage
  }, []);


  // Ensure localStorage stays updated with the selected theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
