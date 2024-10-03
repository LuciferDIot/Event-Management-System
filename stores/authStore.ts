import { IUser } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: IUser | null;
  token: string | null;
  expiresAt: number | null;
  hasHydrated: boolean; // Add this flag for hydration
  setUserData: (user: IUser, token: string, expiresAt: number) => void;
  clearUserData: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      expiresAt: null,
      hasHydrated: false, // Initial state for hydration flag

      setUserData: (user, token, expiresAt) => {
        set({
          user,
          token,
          expiresAt,
        });
      },

      clearUserData: () => {
        set({
          user: null,
          token: null,
          expiresAt: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true; // Set the flag to true after rehydration
        }
      },
    }
  )
);
