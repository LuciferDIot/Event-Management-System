"use server";

import { userSchema } from "@/schema/user.schema";
import { IResponse, IUser, ResponseStatus, UserData, UserRole } from "@/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import { generateToken, verifyToken } from "../jwt";
import { handleError } from "../utils";

// Log in user and return JWT token
export const logInUser = async (
  emailOrUsername: string,
  password: string
): Promise<IResponse<string>> => {
  try {
    await connectToDatabase();

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate a JWT token
      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
      });

      return {
        status: ResponseStatus.Success,
        message: "Login successful",
        code: 200,
        field: token, // Returning token
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

// Get all users (protected) with pagination
export const getAllUsers = async (
  page: number = 1, // Default to the first page
  limit: number = 10, // Default limit for number of users per page
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IUser[] | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the paginated users
    const users: IUser[] = await User.find({}).skip(skip).limit(limit);

    // Get total count of users for calculating total pages
    const totalUsers = await User.countDocuments();

    return {
      status: ResponseStatus.Success,
      message: "All users fetched successfully",
      code: 200,
      field: users,
      totalEvents: totalUsers, // You can rename this field if needed, for clarity
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  } catch (error) {
    return handleError(error);
  }
};
