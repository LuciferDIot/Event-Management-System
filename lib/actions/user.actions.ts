"use server";

import { UserData } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import bcrypt from "bcrypt";

// Create a new user account
export const createUser = async (userData: UserData) => {
  try {
    await connectToDatabase();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

// Remove user account
export const removeUser = async (userId: string) => {
  try {
    await connectToDatabase();
    await User.findByIdAndDelete(userId);
  } catch (error) {
    handleError(error);
  }
};

// Deactivate user account
export const deactivateUser = async (userId: string) => {
  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { isActive: false });
  } catch (error) {
    handleError(error);
  }
};

// Log in user
export const logInUser = async (email: string, password: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return JSON.parse(JSON.stringify(user)); // Return user data or token
    }
    throw new Error("Invalid credentials");
  } catch (error) {
    handleError(error);
  }
};
