"use server";

import { userSchema } from "@/schema/user.schema";
import {
  ILoginResponse,
  IResponse,
  IUser,
  ResponseStatus,
  UserData,
  UserRole,
} from "@/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import { generateToken, verifyToken } from "../jwt";
import { handleError } from "../utils";

export const logInUser = async (
  emailOrUsername: string,
  password: string
): Promise<IResponse<ILoginResponse | string>> => {
  try {
    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (user) {
      if (await bcrypt.compare(password.trim(), user.password)) {
        const token = await generateToken({
          userId: user._id,
          email: user.email,
          role: user.role,
          username: user.username,
        });

        console.log(token);

        return {
          status: ResponseStatus.Success,
          message: "Login successful",
          code: 200,
          field: {
            token,
            user,
          },
        };
      }
      return {
        status: ResponseStatus.Error,
        message: "Invalid Password",
        code: 401,
        field: "Invalid Password",
      };
    } else
      return {
        status: ResponseStatus.Error,
        message: "Invalid Email or Username",
        code: 401,
        field: "Invalid Email or Username",
      };
  } catch (error) {
    console.error("Login error:", error);
    return handleError(error);
  }
};

// Create a new user account (protected)
export const createUser = async (
  userData: UserData,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IUser | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse;
  }

  try {
    // Validate the input using Zod
    const parsedData = userSchema.parse(userData);

    await connectToDatabase();

    const newUser = await User.create({
      ...parsedData,
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

// Remove user account (protected)
export const removeUser = async (
  userId: string,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

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

// Deactivate user account (protected)
export const deactivateUser = async (
  userId: string,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

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

// Get all users (protected) with optional pagination
export const getAllUsers = async (
  token: string, // Expect the JWT token to be passed
  page?: number, // Optional page number for pagination
  limit?: number // Optional limit for number of users per page
): Promise<IResponse<IUser[] | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();

    let users: IUser[] = [];
    let totalUsers: number = 0;

    if (page && limit) {
      // Calculate the number of documents to skip for pagination
      const skip = (page - 1) * limit;

      // Fetch the paginated users
      users = await User.find({}).skip(skip).limit(limit);

      // Get total count of users for calculating total pages
      totalUsers = await User.countDocuments();

      return {
        status: ResponseStatus.Success,
        message: "Users fetched successfully with pagination",
        code: 200,
        field: users,
        totalCount: totalUsers, // Renamed for clarity
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      };
    } else {
      // Fetch all users without pagination
      users = await User.find({});

      return {
        status: ResponseStatus.Success,
        message: "All users fetched successfully without pagination",
        code: 200,
        field: users,
      };
    }
  } catch (error) {
    return handleError(error);
  }
};
