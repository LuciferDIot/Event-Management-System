"use server";

import { userEventSchema } from "@/schema/userEvent.schema";
import {
  IResponse,
  IUserEvent,
  ResponseStatus,
  UserEventStatus,
  UserRole,
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
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
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

// Get user events (protected) with pagination
export const getUserEvents = async (
  userId: string,
  page: number = 1, // Default to the first page
  limit: number = 10, // Default limit for number of user events per page
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IUserEvent[] | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.User]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the paginated user events
    const userEvents: IUserEvent[] = await UserEvent.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .populate("event");

    // Get total count of user events for calculating total pages
    const totalUserEvents = await UserEvent.countDocuments({ user: userId });

    return {
      status: ResponseStatus.Success,
      message: "User events fetched successfully",
      code: 200,
      field: userEvents,
      totalEvents: totalUserEvents,
      totalPages: Math.ceil(totalUserEvents / limit),
      currentPage: page,
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
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
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
