import { create } from "zustand";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const useUserStore = create((set) => ({
  xp: 0,
  level: 1,
  gems: 0,
  streak: 0,
  lessonsCompleted: 0,
  totalStudyTime: 0,
  dailyXP: 0,
  dailyGoalXP: 50,
  achievements: [],

  // Fetch user data from backend
  fetchUserData: async () => {
    try {
      const token = localStorage.getItem("kannada_auth_token");
      if (!token) return;

      // text (❌ removed)

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        set({
          xp: data.xp || 0,
          level: data.level || 1,
          gems: data.gems || 0,
          streak: data.streak || 0,
          lessonsCompleted: data.lessonsCompleted || 0,
          totalStudyTime: data.totalStudyTime || 0,
          dailyXP: data.dailyXP || 0,
          dailyGoalXP: data.dailyGoalXP || 50,
          achievements: data.achievements || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  },

  updateXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  updateLevel: (newLevel) => set({ level: newLevel }),
  updateGems: (amount) => set((state) => ({ gems: state.gems + amount })),
  updateStreak: (newStreak) => set({ streak: newStreak }),
  incrementLessonsCompleted: () =>
    set((state) => ({ lessonsCompleted: state.lessonsCompleted + 1 })),
  updateDailyXP: (amount) =>
    set((state) => ({ dailyXP: state.dailyXP + amount })),

  resetDailyXP: () => set({ dailyXP: 0 }),
  addAchievement: (achievement) =>
    set((state) => ({
      achievements: [...state.achievements, achievement],
    })),
}));
