import { useState, useEffect } from 'react';

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('filedrop_theme');
    return saved !== null ? JSON.parse(saved) : true; // Default dark mode
  });

  useEffect(() => {
    localStorage.setItem('filedrop_theme', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return { darkMode, toggleTheme };
}