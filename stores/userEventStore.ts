// src/stores/userEventStore.ts
import { IUserEvent } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserEventStore {
  userEvents: IUserEvent[];
  categoryUserEvents: IUserEvent[];
  setUserEvents: (events: IUserEvent[]) => void;
  setCategoryUserEvents: (events: IUserEvent[]) => void;
  hasHydrated: boolean; // Add a hydration flag
}

export const useUserEventStore = create<UserEventStore>()(
  persist(
    (set) => ({
      userEvents: [],
      setUserEvents: (events) => set({ userEvents: events }),
      categoryUserEvents: [],
      setCategoryUserEvents: (events) => set({ userEvents: events }),
      hasHydrated: false, // Initialize the hydration flag
    }),
    {
      name: "user-event-storage", // Unique name for the storage
      onRehydrateStorage: () => (state) => {
        // Set hasHydrated to true after rehydration
        if (state) state.hasHydrated = true;
      },
    }
  )
);
