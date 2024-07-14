import create from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      userId: null,
      username: null,
      setUserId: (userId) => set({ userId }),
      setUsername: (username) => set({ username }),
      
      // Read-only properties
      getImmutableUserId: () => get().userId,
      getImmutableUsername: () => get().username,
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;