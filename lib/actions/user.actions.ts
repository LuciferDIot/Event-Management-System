"use server";

import { userSchema } from "@/schema/user.schema";
import { IResponse, IUser, ResponseStatus, UserData } from "@/types";
import bcrypt from "bcrypt";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import { handleError } from "../utils";

// Create a new user account
export const createUser = async (
  userData: UserData
): Promise<IResponse<IUser | string>> => {
  try {
    // Validate the input using Zod
    const parsedData = userSchema.parse(userData);

    await connectToDatabase();

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);
    const newUser = await User.create({
      ...parsedData,
      password: hashedPassword,
    });

    return {
      status: ResponseStatus.Success,
      message: "User created successfully",
      code: 200,
      field: newUser,
    };
  } catch (error) {
    return handleError(error);
  }
};

// Remove user account
export const removeUser = async (
  userId: string
): Promise<IResponse<string>> => {
  try {
    await connectToDatabase();
    await User.findByIdAndDelete(userId);

    return {
      status: ResponseStatus.Success,
      message: "User removed successfully",
      code: 200,
      field: "Success",
    };
  } catch (error) {
    return handleError(error);
  }
};

// Deactivate user account
export const deactivateUser = async (
  userId: string
): Promise<IResponse<string>> => {
  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { isActive: false });

    return {
      status: ResponseStatus.Success,
      message: "User deactivated successfully",
      code: 200,
      field: "Success",
    };
  } catch (error) {
    return handleError(error);
  }
};

// Log in user
export const logInUser = async (
  email: string,
  password: string
): Promise<IResponse<IUser | string>> => {
  try {
    await connectToDatabase();
    const user: IUser | null = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        status: ResponseStatus.Success,
        message: "Login successful",
        code: 200,
        field: user, // You may return a token here instead
      };
    }

    return {
      status: ResponseStatus.Error,
      message: "Invalid credentials",
      code: 401,
      field: "Invalid credentials",
    };
  } catch (error) {
    return handleError(error);
  }
};
