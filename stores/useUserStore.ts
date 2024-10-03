// src/hooks/useUserStore.ts
import { IUser } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  users: IUser[];
  setUsers: (users: IUser[]) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      setUsers: (users) => set({ users }),
    }),
    {
      name: "user-storage",
    }
  )
);
