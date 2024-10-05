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
import { handleServerError } from "../server-utils";
import { handleError } from "../utils";

// Create user-event relationship (protected)
export const createUserEvent = async (
  userId: string,
  eventId: string,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IUserEvent | string | jwt.JwtPayload>> => {
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse;
  }

  try {
    userEventSchema.parse({ user: userId, event: eventId });

    await connectToDatabase();

    // Check if there is already a userEvent with the same userId and eventId
    const existingUserEvent = await UserEvent.findOne({
      user: userId,
      event: eventId,
    });

    if (existingUserEvent) {
      return {
        status: ResponseStatus.Error,
        message: "User-event relationship already exists",
        code: 400,
      };
    }

    // Create a new userEvent if it doesn't exist
    const userEvent = await UserEvent.create({ user: userId, event: eventId });

    return {
      status: ResponseStatus.Success,
      message: "User-event relationship created successfully",
      code: 200,
      field: JSON.parse(JSON.stringify(userEvent)),
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Get user events by event ID (protected)
export const getUserEventsByEventId = async (
  eventId: string,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IUserEvent[] | string | jwt.JwtPayload>> => {
  const tokenResponse = await verifyToken(token, [UserRole.User]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();

    // Fetch user events by event ID
    const userEvents: IUserEvent[] = await UserEvent.find({
      event: eventId,
    }).populate("user");

    return {
      status: ResponseStatus.Success,
      message: "User events fetched successfully",
      code: 200,
      field: JSON.parse(JSON.stringify(userEvents)),
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Remove all user events with the same user and event (protected)
export const removeUserEvent = async (
  userId: string,
  eventId: string,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<string | jwt.JwtPayload>> => {
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();

    // Find and remove all user events based on user ID and event ID
    const result = await UserEvent.deleteMany({
      user: userId,
      event: eventId,
    });

    // Check if any user events were deleted
    if (result.deletedCount === 0) {
      return {
        status: ResponseStatus.Error,
        message: "No user events found for the specified user and event",
        code: 404,
      };
    }

    return {
      status: ResponseStatus.Success,
      message: "User events removed successfully",
      code: 200,
      field: "Success",
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Get user events (protected) with pagination
export const getUserEvents = async (
  userId: string,
  token: string, // Expect the JWT token to be passed
  page: number = 1, // Default to the first page
  limit: number = 10 // Default limit for number of user events per page
): Promise<IResponse<IUserEvent[] | string | jwt.JwtPayload>> => {
  const tokenResponse = await verifyToken(token, [
    UserRole.User,
    UserRole.Admin,
  ]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const userEvents: IUserEvent[] = await UserEvent.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .populate("event");

    const totalUserEvents = await UserEvent.countDocuments({ user: userId });

    return {
      status: ResponseStatus.Success,
      message: "User events fetched successfully",
      code: 200,
      field: JSON.parse(JSON.stringify(userEvents)),
      totalCount: totalUserEvents,
      totalPages: Math.ceil(totalUserEvents / limit),
      currentPage: page,
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Get users for a specific event (protected) with pagination
export const getEventUsers = async (
  eventId: string,
  token: string, // Expect the JWT token to be passed
  page: number = 1, // Default to the first page
  limit: number = 10 // Default limit for number of users per page
): Promise<IResponse<IUserEvent[] | string | jwt.JwtPayload>> => {
  const tokenResponse = await verifyToken(token, [
    UserRole.User,
    UserRole.Admin,
  ]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    const eventUsers: IUserEvent[] = await UserEvent.find({ event: eventId })
      .skip(skip)
      .limit(limit)
      .populate("user");

    const totalEventUsers = await UserEvent.countDocuments({ event: eventId });

    return {
      status: ResponseStatus.Success,
      message: "Event users fetched successfully",
      code: 200,
      field: JSON.parse(JSON.stringify(eventUsers)),
      totalCount: totalEventUsers,
      totalPages: Math.ceil(totalEventUsers / limit),
      currentPage: page,
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Update user event status (protected)
export const updateUserEventStatus = async (
  userEventId: string,
  newStatus: UserEventStatus,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<string | jwt.JwtPayload>> => {
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
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};
