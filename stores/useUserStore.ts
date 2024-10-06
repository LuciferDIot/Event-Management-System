// src/hooks/useUserStore.ts
import { IUser } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  users: IUser[];
  nonAdminUsers: IUser[];
  hasHydrated: boolean; // Hydration flag
  setUsers: (users: IUser[]) => void;
  setNonAdminUsers: (users: IUser[]) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      nonAdminUsers: [],
      hasHydrated: false, // Initial state for hydration flag
      setUsers: (users) => set({ users }),
      setNonAdminUsers: (users) => set({ nonAdminUsers: users }),
    }),
    {
      name: "user-storage",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null; // Parse stringified value
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value)); // Stringify the value
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true; // Set the flag to true after rehydration
        }
      },
    }
  )
);
