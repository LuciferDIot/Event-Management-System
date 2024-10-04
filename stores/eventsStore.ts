// src/stores/useEventStore.ts
import { IEvent } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EventStore {
  events: IEvent[];
  setEvents: (events: IEvent[]) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],
      setEvents: (events) => set({ events }),
    }),
    {
      name: "event-storage", // Unique name for the storage
    }
  )
);
