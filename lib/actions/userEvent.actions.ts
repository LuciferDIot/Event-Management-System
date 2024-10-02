"use server";

import { userEventSchema } from "@/schema/userEvent.schema";
import {
  IResponse,
  IUserEvent,
  ResponseStatus,
  UserEventStatus,
} from "@/types";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../database";
import UserEvent from "../database/models/userEvent.model";
import { verifyToken } from "../jwt";
import { handleError } from "../utils";

// Create user-event relationship (protected)
export const createUserEvent = async (
  userId: string,
  eventId: string,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IUserEvent | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    // Validate the input using Zod
    userEventSchema.parse({ user: userId, event: eventId });

    await connectToDatabase();
    const userEvent = await UserEvent.create({ user: userId, event: eventId });

    return {
      status: ResponseStatus.Success,
      message: "User-event relationship created successfully",
      code: 200,
      field: userEvent,
    };
  } catch (error) {
    return handleError(error);
  }
};

// Get user events (protected)
export const getUserEvents = async (
  userId: string,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IUserEvent[] | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();
    const userEvents = await UserEvent.find({ user: userId }).populate("event");

    return {
      status: ResponseStatus.Success,
      message: "User events fetched successfully",
      code: 200,
      field: userEvents,
    };
  } catch (error) {
    return handleError(error);
  }
};

// Update user event status (protected)
export const updateUserEventStatus = async (
  userEventId: string,
  newStatus: UserEventStatus,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();
    await UserEvent.findByIdAndUpdate(userEventId, { status: newStatus });

    return {
      status: ResponseStatus.Success,
      message: "User event status updated successfully",
      code: 200,
      field: "Success",
    };
  } catch (error) {
    return handleError(error);
  }
};
