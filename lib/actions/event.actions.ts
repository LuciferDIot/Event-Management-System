"use server";

import { eventSchema } from "@/schema/event.schema";
import {
  EventData,
  EventDue,
  IEvent,
  IResponse,
  ResponseStatus,
  UserRole,
} from "@/types";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";
import Event from "../database/models/event.model";
import { verifyToken } from "../jwt";
import { handleServerError } from "../server-utils";
import { handleError } from "../utils";

// Create a new event (protected)
export const createEvent = async (
  eventData: EventData,
  token: string
): Promise<IResponse<IEvent | string | jwt.JwtPayload>> => {
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse;
  }

  try {
    const parsedData = eventSchema.parse(eventData);
    await connectToDatabase();

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
      field: JSON.parse(JSON.stringify(newEvent)),
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Update event status (protected)
export const updateEventStatus = async (
  eventId: string,
  newStatus: EventDue,
  token: string
): Promise<IResponse<string | jwt.JwtPayload>> => {
  const tokenResponse = await verifyToken(token, [UserRole.Admin]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse;
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
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Get all events (not protected) with pagination
export const getAllEvents = async (
  page: number = 1,
  limit: number = 10,
  token?: string | null
): Promise<IResponse<IEvent[] | string | jwt.JwtPayload>> => {
  let findQuery = {};
  if (token) {
    const isAdminTokenResponse = await verifyToken(token, [UserRole.Admin]);
    if (isAdminTokenResponse.status === ResponseStatus.Error) {
      findQuery = {
        isFree: true,
      };
    }
  }

  try {
    await connectToDatabase();
    const skip = (page - 1) * limit;

    const events: IEvent[] = await Event.find(findQuery)
      .skip(skip)
      .limit(limit)
      .populate("category")
      .populate("organizer")
      .select("-password");

    const totalEvents = await Event.countDocuments(findQuery);

    return {
      status: ResponseStatus.Success,
      message: "All events fetched successfully",
      code: 200,
      field: JSON.parse(JSON.stringify(events)),
      totalCount: totalEvents,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page,
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};

// Get events based on user ID and status (protected) with pagination
export const getUserEvents = async (
  userId: string,
  token: string,
  page: number = 1,
  limit: number = 10
): Promise<IResponse<IEvent[] | string | jwt.JwtPayload>> => {
  const tokenResponse = await verifyToken(token, [
    UserRole.Admin,
    UserRole.User,
  ]);
  if (tokenResponse.status === ResponseStatus.Error) {
    return tokenResponse;
  }

  try {
    await connectToDatabase();
    const skip = (page - 1) * limit;

    const events: IEvent[] = await Event.find({
      organizer: userId,
      status: { $in: ["Pending", "Overdue"] },
    })
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments({
      organizer: userId,
      status: { $in: ["Pending", "Overdue"] },
    });

    return {
      status: ResponseStatus.Success,
      message: "Events fetched successfully",
      code: 200,
      field: JSON.parse(JSON.stringify(events)),
      totalCount: totalEvents,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page,
    };
  } catch (error) {
    const serverError = handleServerError(error);
    if (serverError) return serverError;
    return handleError(error);
  }
};
