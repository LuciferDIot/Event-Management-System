import { IUser } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: IUser | null;
  token: string | null;
  expiresAt: number | null;
  setUserData: (user: IUser, token: string, expiresAt: number) => void;
  clearUserData: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      expiresAt: null,

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
      name: "auth-storage", // Name of the item in the sessionStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
