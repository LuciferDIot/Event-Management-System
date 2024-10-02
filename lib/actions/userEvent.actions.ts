"use server";

import { userEventSchema } from "@/schema/userEvent.schema";
import {
  EventDue,
  IResponse,
  IUserEvent,
  ResponseStatus,
  UserEventStatus,
} from "@/types";
import { connectToDatabase } from "../database";
import UserEvent from "../database/models/userEvent.model";
import { handleError } from "../utils";

// Create user-event relationship
export const createUserEvent = async ({
  userId,
  eventId,
}: EventDue): Promise<IResponse<IUserEvent | string>> => {
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

// Get user events
export const getUserEvents = async (
  userId: string
): Promise<IResponse<IUserEvent[] | string>> => {
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

// Update user event status
export const updateUserEventStatus = async (
  userEventId: string,
  newStatus: UserEventStatus
): Promise<IResponse<string>> => {
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
