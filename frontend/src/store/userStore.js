import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      gems: 0,
      streak: 0,
      lastActivityDate: null,
      lessonsCompleted: 0,
      achievements: [],
      dailyXP: 0,

      addXP: (amount) => {
        const newXP = get().xp + amount;
        const newLevel = Math.floor(newXP / 500) + 1;
        const leveledUp = newLevel > get().level;

        set({
          xp: newXP,
          level: newLevel,
          dailyXP: get().dailyXP + amount,
          gems: leveledUp ? get().gems + 100 : get().gems,
        });

        return { leveledUp, newLevel };
      },

      // NEW: Complete a lesson and update lessonsCompleted
      completeLesson: (lessonId) => {
        const currentCompleted = get().lessonsCompleted;
        if (lessonId > currentCompleted) {
          set({ lessonsCompleted: lessonId });
        }
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const last = get().lastActivityDate;

        if (!last || last !== today) {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const newStreak = last === yesterday ? get().streak + 1 : 1;
          set({ streak: newStreak, lastActivityDate: today });
        }
      },

      unlockAchievement: (id) => {
        if (!get().achievements.includes(id)) {
          set({
            achievements: [...get().achievements, id],
            gems: get().gems + 50,
          });
          return true;
        }
        return false;
      },

      incrementLessons: () =>
        set({ lessonsCompleted: get().lessonsCompleted + 1 }),

      addGems: (amount) => set({ gems: get().gems + amount }),

      // Reset for testing
      resetProgress: () => {
        set({
          xp: 0,
          level: 1,
          gems: 0,
          streak: 0,
          lessonsCompleted: 0,
          achievements: [],
          dailyXP: 0,
        });
      },
    }),
    { name: "kannada-user" }
  )
);
