import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: (email) => {
        set({ isLoading: true });
        setTimeout(() => {
          set({
            user: { id: '1', name: 'Demo User', email, avatar: '🐘', district: 'Bangalore Urban' },
            isAuthenticated: true,
            isLoading: false,
          });
        }, 300);
      },
      
      signup: (userData) => {
        set({ isLoading: true });
        setTimeout(() => {
          set({
            user: { id: Date.now().toString(), ...userData },
            isAuthenticated: true,
            isLoading: false,
          });
        }, 300);
      },
      
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    { name: 'kannada-auth' }
  )
);
