"use server";

import { categorySchema } from "@/schema/category.schema";
import {
  CreateCategoryParams,
  ICategory,
  IResponse,
  ResponseStatus,
} from "@/types";
import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";
import { handleError } from "../utils";

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams): Promise<IResponse<ICategory | string>> => {
  try {
    // Validate the input using Zod
    const parsedData = categorySchema.parse({ name: categoryName });

    await connectToDatabase();

    const newCategory: ICategory = await Category.create(parsedData);

    return {
      status: ResponseStatus.Success,
      message: "Category created successfully",
      code: 200,
      field: newCategory,
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getAllCategories = async (): Promise<
  IResponse<ICategory[] | string>
> => {
  try {
    await connectToDatabase();

    const categories: ICategory[] = await Category.find();

    return {
      status: ResponseStatus.Success,
      message: "Categories fetched successfully",
      code: 200,
      field: categories,
    };
  } catch (error) {
    return handleError(error);
  }
};
