// ThemeStore.js

import create from 'zustand';

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light', // Initialize theme from localStorage or default to 'light'
  setTheme: (newTheme) => {
    // Update theme in state
    set({ theme: newTheme });
    // Update theme in localStorage
    localStorage.setItem('theme', newTheme);
  },
  clearTheme: () => {
    // Remove theme from state
    set({ theme: 'light' });
    // Remove theme from localStorage
    localStorage.removeItem('theme');
  },
}));

export default useThemeStore;
