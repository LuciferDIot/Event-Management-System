"use server";

import { UserEventData } from "@/types";
import { connectToDatabase } from "../database";
import UserEvent from "../database/models/userEvent.model";
import { handleError } from "../utils";

// Create user-event relationship
export const createUserEvent = async ({ userId, eventId }: UserEventData) => {
  try {
    await connectToDatabase();
    const userEvent = await UserEvent.create({ user: userId, event: eventId });
    return JSON.parse(JSON.stringify(userEvent));
  } catch (error) {
    handleError(error);
  }
};

// Get user events
export const getUserEvents = async (userId: string) => {
  try {
    await connectToDatabase();
    const userEvents = await UserEvent.find({ user: userId }).populate("event");
    return JSON.parse(JSON.stringify(userEvents));
  } catch (error) {
    handleError(error);
  }
};

// Update user event status
export const updateUserEventStatus = async (
  userEventId: string,
  newStatus: "Pending" | "Completed" | "Overdue"
) => {
  try {
    await connectToDatabase();
    await UserEvent.findByIdAndUpdate(userEventId, { status: newStatus });
  } catch (error) {
    handleError(error);
  }
};
