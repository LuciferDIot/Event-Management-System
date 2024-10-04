// src/hooks/useFetchCategories.ts
import { useAuth } from "@/hooks/useAuth";
import {
  createCategory,
  getAllCategories,
} from "@/lib/actions/category.actions";
import { handleError } from "@/lib/utils";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { ICategory, ResponseStatus } from "@/types";
import { useEffect, useState } from "react";

const useFetchCategories = () => {
  const { categories, setCategories, addCategory } = useCategoryStore(); // Zustand store
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();

      if (response.status === ResponseStatus.Success) {
        if (response.field && Array.isArray(response.field)) {
          setCategories(response.field as ICategory[]); // Update Zustand store
        } else {
          throw new Error("Invalid response field.");
        }
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorRecreate = handleError(error);
      console.error(error);
      setErrorMessage(
        errorRecreate.message || "An error occurred while fetching categories."
      );
    }
  };

  // Create a new category
  const createNewCategory = async (categoryName: string) => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await createCategory({ categoryName }, token);

      if (response.status === ResponseStatus.Success) {
        if (response.field && typeof response.field === "object") {
          addCategory(response.field as ICategory); // Add new category to Zustand store
        } else {
          throw new Error("Invalid response field.");
        }
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorRecreate = handleError(error);
      console.error(error);
      setErrorMessage(
        errorRecreate.message ||
          "An error occurred while creating the category."
      );
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchCategories();
  }, []);

  return {
    categories,
    errorMessage,
    isMounted,
    fetchCategories,
    createNewCategory,
  };
};

export default useFetchCategories;
