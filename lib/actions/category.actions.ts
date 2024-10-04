"use server";

import { categorySchema } from "@/schema/category.schema";
import {
  CreateCategoryParams,
  ICategory,
  IResponse,
  ResponseStatus,
  UserRole,
} from "@/types";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";
import { verifyToken } from "../jwt";
import { handleError } from "../utils";

// Protected route for creating category
export const createCategory = async (
  { categoryName }: CreateCategoryParams,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<ICategory | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    // Validate the input using Zod
    const parsedData = categorySchema.parse({ name: categoryName });

    await connectToDatabase();

    const newCategory: ICategory = await Category.create(parsedData);

    return {
      status: ResponseStatus.Success,
      message: "Category created successfully",
      code: 200,
      field: JSON.parse(JSON.stringify(newCategory)),
    };
  } catch (error) {
    return handleError(error);
  }
};

// Public route for getting all categories
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
      field: JSON.parse(JSON.stringify(categories)),
    };
  } catch (error) {
    return handleError(error);
  }
};
