"use server";

import { userSchema } from "@/schema/user.schema";
import { IResponse, IUser, ResponseStatus, UserData } from "@/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import { verifyToken } from "../jwt";
import { handleError } from "../utils";

// Create a new user account (protected)
export const createUser = async (
  userData: UserData,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IUser | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token);
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
  const tokenResponse = await verifyToken(token);
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
  const tokenResponse = await verifyToken(token);
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
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

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
