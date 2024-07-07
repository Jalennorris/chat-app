import create from 'zustand';

const useAuthStore = create((set) => ({
  userId: localStorage.getItem('userId') || null, // Initialize userId from localStorage or null if not found
  username: localStorage.getItem('username') || null, // Initialize username from localStorage or null if not found
  setUserId: (userId) => {
    localStorage.setItem('userId', userId); // Store userId in localStorage
    set({ userId }); // Update userId in Zustand state
  },

  setUsername: (username) => {
    localStorage.setItem('username', username); // Store username in localStorage
    set({ username }); // Update username in Zustand state
  },


}));

export default useAuthStore;

