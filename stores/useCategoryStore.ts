// src/stores/useCategoryStore.ts
import { ICategory } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware"; // Import persist middleware

interface CategoryState {
  categories: ICategory[];
  setCategories: (categories: ICategory[]) => void;
  addCategory: (category: ICategory) => void;
  hasHydrated: boolean; // Add a hydration flag
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories) => set(() => ({ categories })),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
      hasHydrated: false, // Initialize the hydration flag
    }),
    {
      name: "category-storage", // Unique name for the storage
      onRehydrateStorage: () => (state) => {
        // Set hasHydrated to true after rehydration
        if (state) state.hasHydrated = true;
      },
    }
  )
);
