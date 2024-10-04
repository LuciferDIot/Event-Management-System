// src/stores/useEventStore.ts
import { IEvent } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EventStore {
  events: IEvent[];
  setEvents: (events: IEvent[]) => void;
  hasHydrated: boolean; // Add a hydration flag
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],
      setEvents: (events) => set({ events }),
      hasHydrated: false, // Initialize the hydration flag
    }),
    {
      name: "event-storage", // Unique name for the storage
      onRehydrateStorage: () => (state) => {
        // Set hasHydrated to true after rehydration
        if (state) state.hasHydrated = true;
      },
    }
  )
);
