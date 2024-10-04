// src/stores/useCategoryStore.ts
import { ICategory } from "@/types";
import { create } from "zustand";

interface CategoryState {
  categories: ICategory[];
  setCategories: (categories: ICategory[]) => void;
  addCategory: (category: ICategory) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  setCategories: (categories) => set(() => ({ categories })),
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
}));
