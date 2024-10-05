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
import { handleServerError } from "../server-utils";
import { handleError } from "../utils";

export const logInUser = async (
  emailOrUsername: string,
  password: string
): Promise<IResponse<ILoginResponse | string>> => {
  try {
    await connectToDatabase();

    const user: IUser | null = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (user && user.isActive) {
      if (await bcrypt.compare(password.trim(), user.password)) {
        const token = await generateToken(JSON.parse(JSON.stringify(user)));

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user.toObject();

        return {
          status: ResponseStatus.Success,
          message: "Login successful",
          code: 200,
          field: JSON.parse(
            JSON.stringify({
              token,
              user: userWithoutPassword,
            })
          ),
        };
      }
      return {
        status: ResponseStatus.Error,
        message: "Invalid Password",
        code: 401,
        field: "Invalid Password",
      };
    } else if (user && !user.isActive) {
      return {
        status: ResponseStatus.Error,
        message: "User is deactivated. Please contact the admin",
        code: 401,
        field: "User is deactivated",
      };
    } else
      return {
        status: ResponseStatus.Error,
        message: "Invalid Email or Username",
        code: 401,
        field: "Invalid Email or Username",
      };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser.toObject();

    return {
      status: ResponseStatus.Success,
      message: "User created successfully",
      code: 200,
      field: JSON.parse(JSON.stringify(userWithoutPassword)),
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
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
    const serverError = handleServerError(error);
    if (serverError) return serverError;
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
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Get all users (protected) with optional pagination
export const getAllMembers = async (
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
      const users = await User.find({
        // role: { $ne: UserRole.Admin }
      })
        .lean()
        .skip(skip)
        .limit(limit)
        .select("-password");

      // Get total count of users for calculating total pages
      totalUsers = await User.countDocuments();

      return {
        status: ResponseStatus.Success,
        message: "Users fetched successfully with pagination",
        code: 200,
        field: JSON.parse(JSON.stringify(users)),
        totalCount: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      };
    } else {
      // Fetch all users without pagination
      users = await User.find({
        // role: { $ne: UserRole.Admin }
      })
        .lean()
        .select("-password");

      return {
        status: ResponseStatus.Success,
        message: "All users fetched successfully without pagination",
        code: 200,
        field: JSON.parse(JSON.stringify(users)),
      };
    }
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Update user attributes (protected)
export const updateUser = async (
  userId: string,
  updateData: Partial<UserData>, // Use Partial to allow partial updates
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IUser | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    // Validate the input using Zod; you can adjust validation as needed
    const parsedData = userSchema.partial().parse(updateData); // Allow partial updates

    await connectToDatabase();

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, parsedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update data against the schema
    }).select("-password");

    if (!updatedUser) {
      return {
        status: ResponseStatus.Error,
        message: "User not found",
        code: 404,
        field: "User not found",
      };
    }

    return {
      status: ResponseStatus.Success,
      message: "User updated successfully",
      code: 200,
      field: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

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
      users = await User.find({
        role: { $ne: UserRole.Admin },
        isActive: true,
      })
        .lean()
        .skip(skip)
        .limit(limit)
        .select("-password");

      // Get total count of non-admin users for calculating total pages
      totalUsers = await User.countDocuments({
        role: { $ne: UserRole.Admin },
      });

      return {
        status: ResponseStatus.Success,
        message: "Users fetched successfully with pagination",
        code: 200,
        field: JSON.parse(JSON.stringify(users)),
        totalCount: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      };
    } else {
      // Fetch all non-admin users without pagination
      users = await User.find({
        role: { $ne: UserRole.Admin },
        isActive: true,
      })
        .lean()
        .select("-password");

      return {
        status: ResponseStatus.Success,
        message: "All non-admin users fetched successfully without pagination",
        code: 200,
        field: JSON.parse(JSON.stringify(users)),
      };
    }
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Method to get user by userId and check if user exists and isActive
export const getUserByUserId = async (
  userId: string
): Promise<IResponse<IUser | string>> => {
  try {
    await connectToDatabase();

    const user = await User.findById(userId).lean().select("-password");

    if (!user) {
      return {
        status: ResponseStatus.Error,
        message: "User not found",
        code: 404,
        field: "User not found",
      };
    }

    if (!user.isActive) {
      return {
        status: ResponseStatus.Error,
        message: "User is deactivated. Please contact the admin.",
        code: 403,
        field: "User is deactivated",
      };
    }

    return {
      status: ResponseStatus.Success,
      message: "User found and is active",
      code: 200,
      field: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    return {
      status: ResponseStatus.Error,
      message: error instanceof Error ? error.message : "Unknown error",
      code: 500,
      field: "Server error",
    };
  }
};
