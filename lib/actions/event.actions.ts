"use server";

import { eventSchema } from "@/schema/event.schema";
import {
  EventData,
  EventDue,
  IEvent,
  IResponse,
  ResponseStatus,
  UserRole,
} from "@/types"; // Ensure the path is correct
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";
import Event from "../database/models/event.model";
import { verifyToken } from "../jwt";
import { handleError } from "../utils";

// Create a new event (protected)
export const createEvent = async (
  eventData: EventData,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IEvent | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    // Validate the input using Zod
    const parsedData = eventSchema.parse(eventData);

    await connectToDatabase();

    // Check if category exists; if not, create it
    const categoryExists = await Category.findOne({
      name: parsedData.category.name,
    });
    let categoryId;

    if (!categoryExists) {
      const newCategory = await Category.create({
        name: parsedData.category.name,
      });
      categoryId = newCategory._id;
    } else {
      categoryId = categoryExists._id;
    }

    const newEvent = await Event.create({
      ...parsedData,
      category: categoryId,
    });
    return {
      status: ResponseStatus.Success,
      message: "Event created successfully",
      code: 200,
      field: newEvent,
    };
  } catch (error) {
    return handleError(error);
  }
};

// Update event status (protected)
export const updateEventStatus = async (
  eventId: string,
  newStatus: EventDue,
  token: string // Expect the JWT token to be passed
): Promise<IResponse<string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();
    await Event.findByIdAndUpdate(eventId, { status: newStatus });
    return {
      status: ResponseStatus.Success,
      message: "Event status updated successfully",
      code: 200,
      field: "Success",
    };
  } catch (error) {
    return handleError(error);
  }
};

// Get all events (not protected) with pagination
export const getAllEvents = async (
  page: number = 1, // Default to the first page
  limit: number = 10, // Default limit for number of events per page
  token: string // Expect the JWT token to be passed
): Promise<IResponse<IEvent[] | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  let findQuery = {};
  const isAdmintokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (isAdmintokenResponse.status === ResponseStatus.Error) {
    findQuery = {
      isFree: true,
    };
  }

  try {
    await connectToDatabase();

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the paginated events
    const events: IEvent[] = await Event.find(findQuery)
      .skip(skip)
      .limit(limit);

    // Get the total count of events, applying the same filter as the findQuery
    const totalEvents = await Event.countDocuments(findQuery);

    return {
      status: ResponseStatus.Success,
      message: "All events fetched successfully",
      code: 200,
      field: events,
      totalCount: totalEvents,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page,
    };
  } catch (error) {
    return handleError(error);
  }
};

// Get events based on user ID and status (protected) with pagination
export const getUserEvents = async (
  userId: string,
  token: string, // Expect the JWT token to be passed
  page: number = 1, // Default to the first page
  limit: number = 10 // Default limit for number of events per page
): Promise<IResponse<IEvent[] | string | jwt.JwtPayload>> => {
  // Verify the token before proceeding
  const tokenResponse = await verifyToken(token, [
    UserRole.Admin,
    UserRole.User,
  ]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse; // Return unauthorized if token is invalid
  }

  try {
    await connectToDatabase();

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    const events: IEvent[] = await Event.find({
      organizer: userId,
      status: { $in: ["Pending", "Overdue"] },
    })
      .skip(skip)
      .limit(limit);

    // Get total count of events for calculating total pages
    const totalEvents = await Event.countDocuments({
      organizer: userId,
      status: { $in: ["Pending", "Overdue"] },
    });

    return {
      status: ResponseStatus.Success,
      message: "Events fetched successfully",
      code: 200,
      field: events,
      totalCount: totalEvents,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page,
    };
  } catch (error) {
    return handleError(error);
  }
};
